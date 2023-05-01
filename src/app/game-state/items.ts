import {AttributeType, DerivativeType, ResourceType, BonusObject} from '../common-types';
import {ServiceObject} from '../global-service-provider';

export const __ITEM_LARGE_STACK = 1000;

export const enum ItemID{
	
	HouseGrain = "housegrain",
	Soybeans = "soybeans",
	Wheat = "wheat",
	Barley = "barley",
	Millet = "millet",
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

	//may say that this is hemp
	[ItemID.HouseGrain] : {
		
		name: "House Grain",
		ID: ItemID.HouseGrain,
		type: ItemType.Generic,
		description: "Virtueless specks of brown and black. There are many schemes to make it palatable, but you don't care for any of them.",
		value: 1,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 1.5}},
		},


	},
	
	[ItemID.Soybeans] : {

		name:"Soybeans",
		ID: ItemID.Soybeans,
		type: ItemType.Generic,
		description: "One of the fundamental grains. Scholars are unanimous that it is the lowest of them. Difficult to digest.",
		value: 2,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 2}},
		},
	},

	[ItemID.Barley] : {
		
		name:"Barley",
		ID: ItemID.Barley,
		type: ItemType.Generic,
		description: "One of the fundamental grains. Its position is disputed, but agreed to be lower. You don't dislike it.",
		value: 4,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 2.5}},
		},

	},

	[ItemID.Wheat] : {
		name:"Wheat",
		ID: ItemID.Wheat,
		type: ItemType.Generic,
		description: "One of the fundamental grains. Its position among them is disputed, but known to be lower. It's at least palatable.",
		value: 8,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 3}},
		},

	},

	[ItemID.Millet] : {
		
		name:"Millet",
		ID: ItemID.Millet,
		type: ItemType.Generic,
		description: "The lowest of the fundamental grains. It's not much, but it's something.",
		value: 16,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 4}},
		},

	},


	[ItemID.Rice] : {

		name:"Rice",
		ID: ItemID.Rice,
		type: ItemType.Generic,
		description: "The highest of the fundamental grains. Its virtue is known in the little prep required to feed one.",
		value: 30,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 5}},
			
		},
	},



	[ItemID.Rabbit]:{
		name:"Rabbit Meat",
		ID: ItemID.Rabbit,
		type: ItemType.Generic,
		description:"Fresh and lively. You can almost see it twitching. You really can hunt now.",
		value: 50,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {[ResourceType.Health]: {value: 6}},
		},
	},

	[ItemID.Venison]:{
		name:"Venison",
		ID: ItemID.Venison,
		type: ItemType.Generic,
		description: "Gamey with occasional rank hairs, but red and full of life. There's meat on your bones now.",
		value: 100,
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
		consumeBonus: {
			resources: {
				[ResourceType.Health]: {
					value: 8,
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
		maxStack: __ITEM_LARGE_STACK,
		consumable: true,
		edible: true,
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
