import React from 'react';
import {Serv} from './global-service-provider';
import {InventoryStack} from './body';
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

	let inventory : InventoryStack[] = sv.Character.getInventory();
	

	let stackHTML = [[],[]];

	for (let i = 0; i < 30; ++i){
		
		let item = inventory[i];
		if (item === undefined){
			
			stackHTML[i % 2].push(
				<div className="inventoryLi">
					<div className="rowCenter">
						{"-------"}
					</div>
				</div>
			
			);

		} else {

			let id : ItemID = inventory[i].ID;
			
			stackHTML[i % 2].push(
				
				<div className="inventoryLi" draggable="true">
					<span>
						{ItemCollection[id].name}
					</span>
					<span>
						{"x" + inventory[i].amount}
					</span>
				</div>

			);

		}
		
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
