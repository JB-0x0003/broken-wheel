import {Serv} from './global-service-provider';
import ErrorPanel from './error-panel';
import ItemCollection, {ItemID} from './game-state/items';
import {CurrencySchema} from './world-data';
import {Tooltip, InventoryTooltip} from './tooltips';

interface StoreSlotProps {
	
	ID: ItemID;

}


export default function StoreSlot(props: StoreSlotProps){

	let sv = Serv();
	if (sv === undefined) return <ErrorPanel/>;

	function handleBuy(ev, id: ItemID){
		
		let index = -1;

		if(ev.shiftKey){
			
			index = sv.World.attemptBuyItem(id, 100);
		} else if(ev.ctrlKey){
			
			index = sv.World.attemptBuyItem(id, 10);
		} else index = sv.World.attemptBuyItem(id, 1);
		
		if (index === -1) sv.Log.pushLog("You can't afford that!");

	}


	let item = ItemCollection[props.ID];

	return (
		
		<div className="storeLi">
			<span className="storeSlot">
				<span>
					{item.name}
				</span>
				<span>
					{CurrencySchema.symbol + item.value}
				</span>
				<InventoryTooltip id={props.ID} />
			</span>
			<span 
				className="butt"
				onClick={(ev) => handleBuy(ev, props.ID)}
			>
				Buy
				<Tooltip>
					<div>{"Ctrl-Click -> buy 10"}</div>
					<div>{"Shift-Click -> buy 100"}</div>
				</Tooltip>
			</span>
		</div>

	);

}
