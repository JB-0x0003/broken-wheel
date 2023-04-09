import {AttributeType, DerivativeType, ResourceType, BonusObject} from './common-types';
import {ServiceObject} from './global-service-provider';

export const enum ItemID{

	Rice = "rice",
	Garbage = "garbage",
	SharpenedStick = "sharpenedstick",

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
}

type ItemObject = {
	
	[key in ItemID] : Item

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

};



export default ItemCollection;
