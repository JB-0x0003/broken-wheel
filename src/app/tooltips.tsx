import ItemCollection, {ItemID, ItemTags} from './game-state/items';


interface InventoryTooltipProps {
	
	id: ItemID;

}

let working

function traverseObject(inObj: object) {
	
	let elements = [];

	for (let key in inObj){
		if (typeof inObj[key] === 'object'){
			elements.push(
				<div className="tooltipElement">
					{key} {traverseObject(inObj[key])}
				</div>
			);
		} else {

			let sign = "";
			if (typeof inObj[key] === "number"){
				if (inObj[key] > 0){
					sign = "+";
				}
			}
			elements.push(

				<div className="tooltipElement">		
					{key + ": " + sign + inObj[key] + "\n"}
				</div>
			);
		}

	}
	
	return elements;
}


export function InventoryTooltip(props: InventoryTooltipProps) {

	const item = ItemCollection[props.id];

	let tags = "";
	
	for (let key in ItemTags){
		if (item[key] !== undefined && item[key] !== false){
			tags += key + ", ";
		}
	}

	let elements = [];
	if (item.consumeBonus !== undefined){
		elements.push(
			<div className="tooltipSegment">
				On Consume:
				{traverseObject(item.consumeBonus)}
			</div>
		);
	}
	if (item.equipBonus !== undefined){
		elements.push(
			<div className="tooltipSegment">
				On Equip:
				{traverseObject(item.equipBonus)}
			</div>
		);
	}

	return (
		<div className="tooltipContainer">
			<span className="tooltip">
				<div className="tooltipHeader">
					<div className="rowSpreader">
						<span>{item.name}</span>
						<span>₹{item.value}</span>
					</div>
					<div className="tooltipTags">
						{tags}
					</div>
				</div>
				<div className="tooltipSegment">
					{item.description}
				</div>
				{elements}
			</span>
		</div>

	);



}
