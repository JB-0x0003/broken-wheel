import React from 'react';
import {ServiceObject} from './global-service-provider';
import {BagID} from './game-state/inventory';
import ItemCollection, {ItemID} from './game-state/items';

interface BagSlotProps{

	sv: ServiceObject;
	bagID: BagID;
	index: number;

}

export default function BagSlot(props : BagSlotProps){
	
	let [selected, setSelected] = React.useState(false);

	function drag(ev, originBag : BagID, originIndex : number){
		ev.dataTransfer.setData("bagID", originBag);
		ev.dataTransfer.setData("index", originIndex);
		setSelected(true);
	}
	
	function allowDrag(e){
		
		e.preventDefault();
		setSelected(true);
	}
	
	function leaveDrag(e){
		
		setSelected(false);

	}

	function dropSwapSlots(ev, destBag: BagID, destIndex: number){
		

		let originBag = ev.dataTransfer.getData("bagID");
		let originIndex = ev.dataTransfer.getData("index");

		setSelected(false);
		props.sv.Character.swapInventoryStacks(originBag, originIndex, destBag, destIndex);
	}

	


	let bag = props.sv.Character.getBag(props.bagID);
	let item = bag.contents[props.index];
	if (item === undefined || item === null){
		//console.log(props.sv.Character.getBag(BagID.Inventory)[0]);	
		return(
			<div className={"inventoryLi" + (selected? " selected" : "")} 
				onDragOver={allowDrag}
				onDragLeave={leaveDrag}
				onDrop={(ev)=>{dropSwapSlots(ev,props.bagID,props.index)}}
			>
				<div className="rowCenter">
					{"-------"}
				</div>
			</div>
		
		);

	} else {

		let id : ItemID = item.ID;
		let amount = bag.contents[props.index].amount;
		
		return(
			
			<div className={"inventoryLi" + (selected? " selected" : "")}
				draggable="true" 
				onDragStart={(ev)=>{drag(ev, props.bagID, props.index)}} 
				onDragOver={allowDrag} 
				onDragLeave={leaveDrag}
				onDragEnd={leaveDrag}
				onDrop={(ev)=>{dropSwapSlots(ev,props.bagID,props.index)}}
			>
				<span>
					{ItemCollection[id].name}
				</span>
				<span>
					{(amount > 1.5)? "x" + bag.contents[props.index].amount : ""}
				</span>
			</div>

		);

	}
		
}
