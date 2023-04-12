import {Jati,JatiCollection, JatiID} from './reincarnation';
import {ItemID} from './items';
import {ItemMaskID, Bag} from './inventory'; 
import {DerivativeType, ResourceType, AttributeObject, DerivativeObject, ResourceObject} from '../common-types';

export const __INVENTORY_SLOTS = 30;



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

export function defaultDerivatives(): DerivativeObject{
	
	//These are in a stupid manual format to keep typesafety
	return {
		[DerivativeType.Attack]: {
			value: 0,
			base: 0,
			attrBonus: 0,
			bonus: 0,
			mult: 1,

		},
		[DerivativeType.Defense]: {
			value: 0,
			base: 0,
			attrBonus: 0,
			bonus: 0,
			mult: 1,
		},
	};

}

export function defaultResources(): ResourceObject{

	return {
		[ResourceType.Stamina]: {
			value: 100,
			maxValue: 100,
			maxBase: 100,
			maxBonus: 0,
			maxMult: 1,
		},

		[ResourceType.Health]: {
			value: 33,
			maxValue: 100,
			maxBase: 100,
			maxBonus: 0,
			maxMult: 1,
		},

		[ResourceType.Life]: {
			value: 100,
			maxValue: 100,
			maxBase: 100,
			maxBonus: 0,
			maxMult: 1,
		},
	};

}
//TODO
//These are all way too complicated
//Should just replace it with a new default object,
//then copy over the value of the 'base' key from the old one
export function refreshAttributes(inBod: Body): void{
	
	for (let attr in inBod.attributes){
		let targetAttr = inBod.attributes[attr];
		for (let key in targetAttr){
			if (key === 'base' || key === 'aptitudeBase') continue;
			else if (key ==='mult'){
				targetAttr[key] = 1;
			} else{
				targetAttr[key] = 0;
			}
		}
		targetAttr['value'] = targetAttr['base'];
		targetAttr['aptitude'] = targetAttr['aptitudeBase'];
	}

}

export function refreshResources(inBod: Body): void{

	for (let res in inBod.resources){
		let targetRes = inBod.resources[res];
		for (let key in targetRes){
			if (key === 'maxBase' || key === 'value') continue;
			else if (key === 'maxMult'){
				targetRes[key] = 1;
			} else{
				targetRes[key] = 0;
			}
		}
		targetRes['maxValue'] = targetRes['maxBase'];
	}

}

export function refreshDerivatives(inBod: Body): void{

	for (let stat in inBod.derivatives){
		let targetStat = inBod.derivatives[stat];
		for (let key in targetStat){
			if (key === 'base') continue;
			else if (key === 'mult'){
				targetStat[key] = 1;
			} else{
				targetStat[key] = 0;
			}
		}
		targetStat['value'] = targetStat['base'];
	}

}

export function refreshBody(inBod: Body): void{
	
	refreshAttributes(inBod);
	refreshResources(inBod);
	refreshDerivatives(inBod);

}

export function genBody(inJati:JatiID): Body{
	
	let jati = JatiCollection[inJati];

	let tempBod : Body = {

		//this is the only way I know to do deep copies lol
		attributes: JSON.parse(JSON.stringify(jati.initialAttributes)),
		derivatives: defaultDerivatives(),
		resources : defaultResources(),
		money: 0,
		inventory : {
			size: 30,
			defaultMask: ItemMaskID.True,
			mask: {} as {[key: number]: ItemMaskID},
			contents: {},
		},
		equipment: {
			size: 5,
			defaultMask: ItemMaskID.EquipGeneric,
			mask: {
				0: ItemMaskID.EquipWeaponNoble,
			},
			contents: {},

		},
		jati: jati,

		age : 360 * 16,
	};
	
	
	tempBod.inventory.contents[0] =(
		{
			ID: ItemID.Rice,
			amount: 300,

		}

	);
	
	tempBod.inventory.contents[1] = (
		{
			ID: ItemID.Garbage,
			amount: 300,

		}
	);	
	tempBod.inventory.contents[2] = (
		{
			ID: ItemID.SharpenedStick,
			amount: 1,
		}
	);
	tempBod.inventory.contents[3] = (
		{
			ID: ItemID.Rapier,
			amount: 1,
		}
	);
	
	
	return tempBod; 


}

export function defaultBody(): Body{

	return genBody(JatiID.Laborer);

}

export function initialBody(): Body{

	return genBody(JatiID.Wretch);

}


