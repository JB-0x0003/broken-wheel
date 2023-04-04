import {Jati} from './reincarnation';
import {ItemID} from './items';
import {ItemMaskID, Bag} from './inventory'; 

export const __INVENTORY_SLOTS = 30;

export enum AttributeType{

	Body = "body",
	Cunning = "cunning",
	Learning = "learning",
	Charisma = "charisma",
	Nobility = "nobility",
	Shine = "shine",
	Summer = "summer",

}

export type AttributeObject = {
	[key in AttributeType]:{
		value: number;
		aptitude: number;
	}


}

export enum DerivativeType{

	Attack = "attack",
	Defense = "defense",

}

export type DerivativeObject = {
	
	[key in DerivativeType]: {

		value: number,
		base: number,

	};

}



export enum ResourceType{

	Stamina = "Stamina",
	Health = "Health",
	Life = "Lifespan",

}

export type ResourceObject = {

	[key in ResourceType]:{
		value: number;
		max: number;
	}

}

export interface Body{

	attributes: AttributeObject;
	derivatives: DerivativeObject;
	resources: ResourceObject;
	money: number;
	inventory: Bag;
	equipment: Bag;
	jati: Jati;
	age: number;

};

export function genBody(inJati:Jati): Body{

	let tempBod = {

		//this is the only way I know to do deep copies lol
		attributes: JSON.parse(JSON.stringify(inJati.initialAttributes)),
		derivatives: {},
		money: 0,
		inventory : {
			size: 30,
			mask: {},
			contents: [],
		},
		equipment: {
			size: 5,
			mask: {},
			contents: [],

		},
		jati: inJati,
		resources : {
			
			Stamina: {
				value: 100,
				max: 100,
			},

			Health: {
				value: 33,
				max: 100,
			},

			Lifespan: {
				value: 100,
				max: 100,
			},
		},

		age : 360 * 16,
	};
	
	tempBod.inventory.mask[-1] = ItemMaskID.True;

	tempBod.inventory.contents.push(
		{
			ID: ItemID.Rice,
			amount: 300,

		}

	);
	tempBod.inventory.contents.push(
		{
			ID: ItemID.Garbage,
			amount: 300,

		}
	);	
	tempBod.inventory.contents.push(
		{
			ID: ItemID.SharpenedStick,
			amount: 1,
		}
	);

	tempBod.equipment.mask[-1] = ItemMaskID.EquipGeneric;
	tempBod.equipment.mask[0] = ItemMaskID.EquipWeapon;
	
	//TODO move this character-service
	//it requipres st information, not just body information
	


	return tempBod as Body; 


}




