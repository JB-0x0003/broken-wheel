import React from 'react';
import ZonePanel from './zone-panel';
import PersonalPanel from './personal-panel';
import InventoryPanel from './inventory-panel';

export default function Center1Panel(){

	let [currentTab, setCurrentTab] = React.useState(0);

	
	let displayedPanel;

	switch (currentTab) {
		
		case 0:
			displayedPanel = <ZonePanel/>;
			break;
		case 1:
			displayedPanel = <InventoryPanel/>;
			break;
		case 2:
			displayedPanel = <PersonalPanel/>;
			break;
		default:	
			displayedPanel = <div className="panel"/>; 
	};


	return(
		<div className="panelWrapper">
			
			<div className="panelTabContainer">
				<span className={"panelTab leftmost" + (currentTab===0? " selected" : "")}
						onClick = {()=>{setCurrentTab(0)}}
				>
					Environment
				</span>
				<span className = {"panelTab" + (currentTab===1? " selected" : "")}
						onClick = {()=>{setCurrentTab(1)}}
					>
					Inventory
				</span>
				<span className={"panelTab rightmost" + (currentTab===2? " selected" : "")}
						onClick = {()=>{setCurrentTab(2)}}
				>
					Personal
				</span>
			</div>
			{displayedPanel}

		</div>




	);

}

