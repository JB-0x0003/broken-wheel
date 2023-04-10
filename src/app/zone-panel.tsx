import React from 'react';
import ErrorPanel from './error-panel';
import {Location} from './game-state/locations';
import {Serv} from "./global-service-provider";
import ActivityCollection from "./game-state/activities";

function ZonePanel(){
	
	let sv = Serv();

	//TODO Replace dumb refresh system w/ updating every time activityRecord updates
	let [, dummyState] = React.useState({});

	//Abort if state isn't done loading
	if (sv === undefined) return <ErrorPanel/>;
	
	//Dumb refreshes
	//TODO only refresh when activity state changes
	function refresh(){
		
		dummyState({});

	}

	sv.MainLoop.subscribeToLongTick(refresh);
	

	//Prepare to render
	
	let currentZone = sv.World.getCurrentZone();
	//this is absolute, including non-visible locations, in memory order
	//must be sanity-checked when locations are changed
	//TODO memoize
	let possibleLocations = currentZone.locations;
	let locationContent = [];
	let currentLocIndex = sv.World.getCurrentLocationIndex();
	let currentActID = sv.World.getCurrentActivityID();
	
	//console.log("Currently selected Location is: " +currentLocIndex);
	//console.log("Currently selected Activity is: " +currentActID);
	//begin enumerating the possible locations
	for (let i = 0; i< possibleLocations.length; ++i){

		//this is absolute, including non-visible activities
		//must be sanity-checked when list changes
		//TODO memoize
		let possibleActivities = possibleLocations[i].activities;
		let activityContent : React.ReactNode[] = [];
		
		//begin enumerating possible activities within this location
		for (let j = 0; j< possibleActivities.length; ++j){

			let jActivity = ActivityCollection[possibleActivities[j]];
			let jID = possibleActivities[j];
			let selectedBool : boolean = false;
			let reqMet: boolean = true;

			if (i === currentLocIndex && jID === currentActID){ 
					selectedBool = true;
			}
			
			if (sv.Character.getActivityDiscoverState(jID)===true){	

				reqMet = sv.Character.getActivityReqState(jID);
				
				activityContent.push(

					<div className={"activitySegment" +
						(reqMet ===false? " disabled" : "")
					}>
						<span 
							className={'activitySegmentTitleButton' + 
								(selectedBool? ' buttActive': '') + 
								(reqMet? '': ' disabled')

							}
							onClick={()=>{sv.World.reqStartAct(i,jID)}}
						>
							{jActivity.name}
						</span>
						<span className="activitySegmentDescription">
							{jActivity.description}
						</span>
					</div>


				)
			}
		}


		//push this locations content, then repeat
		locationContent.push(
			<div className="locationSegment">
				<div className="locationSegmentHeader">
					<span className="locationSegmentTitle">{possibleLocations[i].name}</span>
				</div>	
				<div className="locationSegmentActivities">
					{activityContent}
				</div>
			</div>
		);

	}
	 
	return(

		<div className="panel">
			<div className="panelHeader">
				<span className="townName">{currentZone.name}
				</span>
				<span className="townStinger">{currentZone.stinger}
				</span>
			</div>
			{locationContent}
			
		</div>
	);

}


export default ZonePanel;
