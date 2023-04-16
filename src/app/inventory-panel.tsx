import React from 'react';
import ErrorPanel from './error-panel';
import BagSlot from './bag-slot';
import {Serv} from './global-service-provider';
import {BagID} from './game-state/inventory';

export default function InventoryPanel(){

	let [,dummyState] = React.useState({});

	let sv = Serv();
	
	//If state isn't done being created, abort
	if (sv === undefined) return <ErrorPanel/>;

	//TODO make alert system to only update when needed
	function refresh():void{
		
		dummyState({});

	}
	sv.MainLoop.subscribeToLongTick(refresh);
	

	let stackHTML = [[],[]];

	for (let i = 0; i < 30; ++i){
		
		stackHTML[i % 2].push(
			<BagSlot key = {"inv" + i} sv={sv} bagID={BagID.Inventory} index={i}/>			
		);

		
	}

	return(

	<div className="panel spanning">
		<div className="flexColumn">
			<div className="panelHeader">
				Inventory
			</div>
			<div className="scrollableWrapper">
				<div className="scrollable">
					<div className="inventoryFlexRow">
						<span className="inventoryFlexColumn">
							{stackHTML[0]}
						</span>
						<span className="inventoryFlexColumn">
							{stackHTML[1]}
						</span>
					</div>
				</div>
			</div>
		</div>

	</div>


	);


}
