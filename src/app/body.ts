import {Jati,JatiCollection, JatiID} from './reincarnation';
import {ItemID} from './items';
import {ItemMaskID, Bag} from './inventory'; 
import {DerivativeType, ResourceType, AttributeObject, DerivativeObject, ResourceObject} from './common-types';

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

	let dummyData = {
		value: 0,
		base: 0,

	}

	return {
		[DerivativeType.Attack]: JSON.parse(JSON.stringify(dummyData)),
		[DerivativeType.Defense]: JSON.parse(JSON.stringify(dummyData)),
	};

}

export function defaultResources(): ResourceObject{

	return {
		[ResourceType.Stamina]: {
			value: 100,
			max: 100,
		},

		[ResourceType.Health]: {
			value: 33,
			max: 100,
		},

		[ResourceType.Life]: {
			value: 100,
			max: 100,
		},
	};

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
			contents: [],
		},
		equipment: {
			size: 5,
			defaultMask: ItemMaskID.EquipGeneric,
			mask: {
				0: ItemMaskID.EquipWeapon,
			},
			contents: [],

		},
		jati: jati,

		age : 360 * 16,
	};
	
	
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
	
	
	return tempBod; 


}

export function defaultBody(): Body{

	return genBody(JatiID.Laborer);

}

export function initialBody(): Body{

	return genBody(JatiID.Wretch);

}


