import {AttributeType,BonusObject,BonusObjectRanks, DerivativeType} from '../common-types';
import {ItemMaskID} from './inventory';

export const __SECRET_XP_EXPONENT = 1.4;

export enum SecretID{

	Swords = 'swords',
	Weapons = 'weapons',

}

export type Secret = {
	
	name: string[];
	description: string[];
	constantBonus: BonusObject;
	specificBonus: BonusObjectRanks;
	//only executed once, manually sets values
	//mostly for unique effects
	specificOverwriteBonus?: BonusObjectRanks;
	baseXP: number;
	XPExponent: number;

}

export type SecretRecord = {
	
	ID: SecretID;
	rank: number;
	XP: number;
}

export type SecretObject = {

	[key in SecretID]: SecretRecord;	

}

type SecretSuite = {
	
	[key in SecretID]: Secret;

}

let SecretCollection : SecretSuite = {
	
	[SecretID.Swords]: {
		name: ["Noble Edges"],
		description: ["TODO"],
		constantBonus: {
			attributes: {
				[AttributeType.Nobility]: {
					value: 15,
					bonus: 15,

				}

			},
		},
		specificBonus: {
			4: {
				attributes: {
					[AttributeType.Learning]: {
						value: 100,
						bonus: 100,
					},
				},
			},
		},
		baseXP: 100,
		XPExponent: __SECRET_XP_EXPONENT,
	},
	[SecretID.Weapons]: {
		name: ["Weapon Mastery", "Weapon Mastery"],	
		description: ["",""],
		constantBonus: {
			derivatives: {
				[DerivativeType.Attack]: {
					value: 10,
					bonus: 10,

				},

			},
		},
		specificBonus: {},
		specificOverwriteBonus: {
			
			1: {
				equipment: {
					mask: {
						1: ItemMaskID.EquipWeapon,
						
					}
				}

			},

		},
		baseXP: 100,
		XPExponent: __SECRET_XP_EXPONENT,

	},
}

export function secretXPForRank(secret: SecretID, rank: number) : number{
	
	let baseXP = SecretCollection[secret].baseXP;
	let exponent = SecretCollection[secret].XPExponent;

	return Math.floor(baseXP * Math.pow(exponent, (rank -1)));
}

export default SecretCollection;
