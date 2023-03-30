import {Jati} from './reincarnation';
import {ItemID} from './items';

export const __INVENTORY_SLOTS = 30;

export enum AttributeType{

	body = "body",
	cunning = "cunning",
	learning = "learning",
	charisma = "charisma",
	nobility = "nobility",
	shine = "shine",
	summer = "summer",

}

export type AttributeObject = {
	[key in AttributeType]:{
		value: number;
		aptitude: number;
	}


}

export enum DerivativeType{

	attack = "attack",
	defense = "defense",

}

export type DerivativeObject = {
	
	[key in DerivativeType]:{
		value: number;

	}

}

export function attackFunction(inBody: number, inCunning: number):number{
	
	return 2;

}

export function defenseFunction(inBody: number, inCunning: number): number{

	return 2;

}

export function calcDerivatives(inBod : Body): void{

	let attr = inBod.attributes;

	let tempAttack = attackFunction(attr.body.value, attr.cunning.value);
	let tempDefense = attackFunction(attr.body.value, attr.cunning.value);
	
	inBod.derivatives.attack.value = tempAttack;
	inBod.derivatives.defense.value = tempDefense;

}

export enum StatusType{

	stamina = "Stamina",
	health = "Health",
	life = "Lifespan",

}

export type StatusObject = {

	[key in StatusType]:{
		value: number;
		max: number;
	}

}

export type InventoryStack = {
	
	ID: ItemID;
	amount: number;

}

export interface Body{

	attributes: AttributeObject;
	derivatives: DerivativeObject;
	statuses: StatusObject;
	money: number;
	inventory: InventoryStack[];
	equipment: InventoryStack[];
	jati: Jati;
	age: number;

};

export function genBody(inJati:Jati): Body{

	let tempBod = {

		//this is the only way I know to do deep copies lol
		attributes: JSON.parse(JSON.stringify(inJati.initialAttributes)),
		derivatives: {},
		money: 0,
		inventory : [],
		equipment: [],
		jati: inJati,
		statuses : {
			
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

	tempBod.inventory.push(
		{
			ID: ItemID.Rice,
			amount: 300,

		}

	);
	tempBod.inventory.push(
		{
			ID: ItemID.Garbage,
			amount: 300,

		}

	);

	return tempBod as Body; 


}




