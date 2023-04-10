import {AttributeType,BonusObject, DerivativeType} from './common-types';

export const __SECRET_XP_EXPONENT = 1.3;

export enum SecretID{

	Swords = 'swords',
	Weapons = 'weapons',

}

export type Secret = {
	
	name: string[];
	description: string[];
	rankThresholds: number[];
	constantBonus: BonusObject;
	completionBonus: BonusObject[];
	specificBonus: BonusObject[];
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
		name: ["Swordlore"],
		description: ["TODO"],
		rankThresholds: [],
		constantBonus: {
			attributes: {
				[AttributeType.Nobility]: {
					bonus: 10,

				}

			},
		},
		completionBonus: [],
		specificBonus: [],
		baseXP: 100,
		XPExponent: __SECRET_XP_EXPONENT,
	},
	[SecretID.Weapons]: {
		name: ["Weapon Mastery"],	
		description: [""],
		rankThresholds: [],
		constantBonus: {
			derivatives: {
				[DerivativeType.Attack]: {
					bonus: 10,

				}

			},
		},
		completionBonus: [],
		specificBonus: [],
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
