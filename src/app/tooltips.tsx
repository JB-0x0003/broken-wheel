import ItemCollection, {ItemID, ItemTags} from './game-state/items';
import {AttributeType, AttributeData, DerivativeType, DerivativeData} from './common-types';
import SecretCollection, {SecretID} from './game-state/secrets';
import ErrorPanel from './error-panel';

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
	let buffer = "";

	for (let key in ItemTags){
		if (item[key] !== undefined && item[key] !== false){
			tags += buffer + " ";
			buffer = key;
		}
	}
	tags += buffer;	

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

interface StatTooltipProps{
	
	category: "attribute" | "derivative";
	stat: AttributeType | DerivativeType;
	direction?: "left" | "right";

}

export function StatTooltip({category, stat, direction = "right"}: StatTooltipProps){
	
	let data;

	switch (category){

		case "attribute":
			data = AttributeData;
		break;
		case "derivative":
			data = DerivativeData;
		break;	
		default:
			data = AttributeData;
	};
	
	if (data[stat] === undefined) return (<ErrorPanel/>);

	return(

		<div className={"tooltipContainer " + direction}>
			<div className="tooltip">
				<div className="tooltipHeader">
					{data[stat].name}
				</div>
				<div className="tooltipSegment">
					{data[stat].description}
				</div>
			</div>

		</div>
	);

}

interface SecretTooltipProps {
	
	ID: SecretID;
	currRank: number;
}

function findNextSpecificBonus(inObj: object, currRank: number){

	let keys = Object.keys(inObj);
	let currentBest = null
	//this is very unsafe code :/
	for (let i in keys){
		if (keys[i] as unknown as number > currRank){
			currentBest = keys[i];
			break;
		}	
	}

	return currentBest;

}

export function SecretTooltip(props: SecretTooltipProps){

	let secret = SecretCollection[props.ID];
	//console.log(Object.keys(SecretCollection[SecretID.Swords].specificBonus));	
	let specificHTML = [];
	let overwriteHTML = [];
	
	if (secret.specificBonus !== undefined){
		let specificIndex = findNextSpecificBonus(secret.specificBonus, props.currRank);
		if (specificIndex !== null){
			console.log(specificIndex);
			specificHTML.push(
				<div className="tooltipSegment">
					At Rank {specificIndex}:
					{traverseObject(secret.specificBonus[specificIndex])}
				</div>
			);
		}
	}
	if (secret.specificOverwriteBonus !== undefined){
		let overwriteIndex = findNextSpecificBonus(secret.specificOverwriteBonus, props.currRank);
		if (overwriteIndex !== null){
			overwriteHTML.push(
				<div className="tooltipSegment">
					At Rank {overwriteIndex}:
					{traverseObject(secret.specificOverwriteBonus[overwriteIndex])}
				</div>
			);

		}
	}
	return(
		
		<div className="tooltipContainer">
			<div className="tooltip">
				<div className="tooltipHeader">
					{secret.name}
				</div>
				<div className="tooltipSegment">
					{secret.description}
				</div>
				<div className="tooltipSegment">
					On Level Up:
					{traverseObject(secret.constantBonus)}
				</div>
				{specificHTML}
				{overwriteHTML}
			</div>

		</div>

	)


}
