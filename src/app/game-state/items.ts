import {AttributeType, DerivativeType, ResourceType, BonusObject} from '../common-types';
import {ServiceObject} from '../global-service-provider';

export const enum ItemID{

	Rice = "rice",
	Rabbit = "rabbit",
	Venison = "venison",
	Garbage = "garbage",
	SharpenedStick = "sharpenedstick",
	Rapier = "rapier",

}

export enum ItemType{
	
	Generic = "generic",
	Food = "food",
	Weapon = "weapon",
	Accessory = "accessory",
	Hat = "hat",
	Hands = "hands",
	Body = "body",
	Legs = "legs",
	OffHand = "offhand",
}




export interface Item{

	name: string;
	ID: ItemID;
	type: ItemType;
	description: string;
	value: number;
	maxStack: number;
	//automatically eat once per day
	//Activates consume bonus
	edible?: boolean;
	//Consumable is on-demand eating
	consumable?: boolean;
	consumeBonus?: BonusObject;
	consumeConsequence?: (sv: ServiceObject) => void;
	equipable?: boolean;
	equipBonus?: BonusObject;
	noble?: boolean
}

type ItemTagType = {

	[key in ItemID] : string
}

export enum ItemTags{

	noble = "noble",
	edible = "food",
	consumable = "consumable",
	equipable = "equipable",

}


type ItemObject = {
	
	[key in ItemID] : Item

}


export type ItemDrop = {
	
	[key in ItemID]? : number 

}

export function addItemToDropObject(drop: ItemDrop, inputID: ItemID, inputAmount: number){


	if(drop[inputID]){

		drop[inputID] += inputAmount;

	}else{

		drop[inputID] = inputAmount;

	}


}

let ItemCollection : ItemObject = {

	[ItemID.Rice] : {

		name:"Rice",
		ID: ItemID.Rice,
		type: ItemType.Generic,
		description: "Raw calories. It keeps you alive.",
		value: 1,
		maxStack: 1000,
		consumable: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 2}},
			
		},
	},

	[ItemID.Rabbit]:{
		name:"Rabbit Meat",
		ID: ItemID.Rabbit,
		type: ItemType.Generic,
		description:"Fresh and lively. You can almost see it twitching. You really can hunt now.",
		value: 10,
		maxStack: 1000,
		consumable: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 3}},
		},
	},

	[ItemID.Venison]:{
		name:"Venison",
		ID: ItemID.Venison,
		type: ItemType.Generic,
		description: "Gamey with occasional rank hairs, but red and full of life. There's meat on your bones now.",
		value: 25,
		maxStack: 1000,
		consumable: true,
		consumeBonus: {
			resources: {
				[ResourceType.Health]: {
					value: 4,
					maxBase: 0.01,
				}
			},

		}


	},



	[ItemID.Garbage]:{

		name:"Garbage",
		ID: ItemID.Garbage,
		type: ItemType.Generic,
		description: "Trash.",
		value: 0,
		maxStack: 1000,
		consumable: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 0.8}},
			
		},

	},
	
	[ItemID.SharpenedStick]:{

		name:"Sharpened Stick",
		ID: ItemID.SharpenedStick,
		type: ItemType.Weapon,
		description: "A sharpened and fire-hardened branch. It's functional as a weapon.",
		value: 5,
		maxStack: 1,
		equipable: true,
		equipBonus: {
			derivatives: {[DerivativeType.Attack]: {bonus: 1}},

		},
		

	},

	[ItemID.Rapier]:{
		name:"Rapier",
		ID: ItemID.Rapier,
		type: ItemType.Weapon,
		description: "Nobility in a blade.",
		value: 100,
		maxStack: 1,
		equipable: true,
		equipBonus: {
			derivatives: {[DerivativeType.Attack]: {bonus: 10}},

		},
		noble: true,

	},

};

let meatGenItems = [ItemID.Rabbit, ItemID.Venison];
meatGenItems.sort((a,b) => (ItemCollection[b].value - ItemCollection[a].value));
export {meatGenItems};

//requires sorted array to function
let overflowValue = 0;
export function generateItems(inSet: ItemID[], inValue: number) : ItemDrop{

	let outDrop : ItemDrop = {};
	let itemValue = 0;
	
	inValue += overflowValue;
	overflowValue = 0;

	for(let i = 0; i < inSet.length; i++){
		
		itemValue = ItemCollection[inSet[i]].value;
		if(inValue + overflowValue >= itemValue){
			
			let itemAmount = Math.floor((inValue) / itemValue);
			inValue -= itemValue * itemAmount;
			outDrop[inSet[i]] = itemAmount;
		}

	}
	
	overflowValue = inValue;
	console.log("overflow value: " + overflowValue);
	console.log("outDrop: " + JSON.stringify(outDrop));
	return outDrop;

}

export default ItemCollection;
