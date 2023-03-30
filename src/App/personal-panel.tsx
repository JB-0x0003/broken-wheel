import React from 'react';
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
	
	function drag(ev, originBag : BagID, originIndex : number){
		ev.dataTransfer.setData("bagID", originBag);
		ev.dataTransfer.setData("index", originIndex);
	}
	
	function allowDrag(e){
		
		e.preventDefault();

	}

	function dropSwapSlots(ev, destBag: BagID, destIndex: number){
		

		let originBag = ev.dataTransfer.getData("bagID");
		originBag = Number(originBag);
		let originIndex = ev.dataTransfer.getData("index");
		
		sv.Character.swapInventoryStacks(originBag, originIndex, destBag, destIndex);
	}

	let inventory : InventoryStack[] = sv.Character.getInventory();
	

	let stackHTML = [[],[]];

	for (let i = 0; i < 30; ++i){
		
		let item = inventory[i];
		if (item === undefined){
			
			stackHTML[i % 2].push(
				<div className="inventoryLi"
					onDragOver={allowDrag}
					onDrop={(ev)=>{dropSwapSlots(ev,BagID.Inventory,i)}}
				>
					<div className="rowCenter">
						{"-------"}
					</div>
				</div>
			
			);

		} else {

			let id : ItemID = inventory[i].ID;
			
			stackHTML[i % 2].push(
				
				<div className="inventoryLi" 
					draggable="true" 
					onDragStart={(ev)=>{drag(ev, BagID.Inventory, i)}} 
					onDragOver={allowDrag} 
					onDrop={(ev)=>{dropSwapSlots(ev,BagID.Inventory,i)}}
				>
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
