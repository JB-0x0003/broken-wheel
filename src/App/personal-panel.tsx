import React from 'react';
import BagSlot from './bag-slot';
import {Serv} from './global-service-provider';
import {InventoryStack, BagID} from './body';
import ItemCollection, {ItemID} from './items';

export default function PersonalPanel(){

	let [,dummyState] = React.useState({});

	let sv = Serv();
	
	//If state isn't done being created, abort
	if (sv === undefined) return;

	//TODO make alert system to only update when needed
	function refresh():void{
		
		dummyState({});

	}
	sv.MainLoop.subscribeToLongTick(refresh);
	

	let stackHTML = [[],[]];

	for (let i = 0; i < 30; ++i){
		
		stackHTML[i % 2].push(
			<BagSlot sv={sv} bagID={BagID.Inventory} index={i}/>			
		);

		
	}

	return(

	<div className="panel">
		<div className="panelHeader">
			Personal Information
		</div>
		<span className="flexRow">
			<span className="inventoryFlexColumn">
				{stackHTML[0]}
			</span>
			<span className="inventoryFlexColumn">
				{stackHTML[1]}
			</span>
			<span className="inventoryFlexColumn">
			</span>
		</span>

	</div>


	);

}
