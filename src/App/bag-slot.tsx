import {ServiceObject} from './global-service-provider';
import {BagID, InventoryStack} from './body';
import ItemCollection, {ItemID} from './items';

interface BagSlotProps{

	sv: ServiceObject;
	bagID: BagID;
	index: number;

}

export default function BagSlot(props : BagSlotProps){


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
		
		props.sv.Character.swapInventoryStacks(originBag, originIndex, destBag, destIndex);
	}


	let bag = props.sv.Character.getBag(props.bagID);
	let item = bag[props.index];
	if (item === undefined || item === null){
		//console.log(props.sv.Character.getBag(BagID.Inventory)[0]);	
		return(
			<div className="inventoryLi"
				onDragOver={allowDrag}
				onDrop={(ev)=>{dropSwapSlots(ev,props.bagID,props.index)}}
			>
				<div className="rowCenter">
					{"-------"}
				</div>
			</div>
		
		);

	} else {

		let id : ItemID = item.ID;
		
		return(
			
			<div className="inventoryLi" 
				draggable="true" 
				onDragStart={(ev)=>{drag(ev, props.bagID, props.index)}} 
				onDragOver={allowDrag} 
				onDrop={(ev)=>{dropSwapSlots(ev,props.bagID,props.index)}}
			>
				<span>
					{ItemCollection[id].name}
				</span>
				<span>
					{"x" + bag[props.index].amount}
				</span>
			</div>

		);

	}
		
}
