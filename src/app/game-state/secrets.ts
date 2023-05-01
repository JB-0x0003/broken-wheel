import {AttributeType,ResourceType,BonusObject,BonusObjectRanks, DerivativeType} from '../common-types';
import {ItemMaskID} from './inventory';

export const __SECRET_XP_EXPONENT = 1.4;

export enum SecretID{

	Swords = 'swords',
	Weapons = 'weapons',
	Anatomy = 'anatomy',
	
	

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
		description: ["Just like the proper steps to a dance, or a swallow's wing in flight, the tip of a sword is a moment more than an object or a point in space. Everything in its place."],
		constantBonus: {
			attributes: {
				[AttributeType.Nobility]: {
					value: 5,
					bonus: 5,
					aptitude: 0.05,
					aptitudeBase: 0.05,
				}

			},
		},
		specificBonus: {
			4: {
				attributes: {
					[AttributeType.Learning]: {
						value: 20,
						bonus: 20,
						aptitude: 0.15,
						aptitudeBase: 0.15,
					},
				},
			},
		},
		baseXP: 100,
		XPExponent: __SECRET_XP_EXPONENT,
	},
	[SecretID.Weapons]: {
		name: ["Weapon Mastery"],	
		description: ["Know the steps of war like the beat of your heart. Wield an unreasonable number of weapons."],
		constantBonus: {
			derivatives: {
				[DerivativeType.Attack]: {
					value: 3,
					bonus: 3,

				},

			},
		},
		specificBonus: {},
		specificOverwriteBonus: {
			
			7: {
				equipment: {
					mask: {
						1: ItemMaskID.EquipWeapon,
						
					}
				}

			},
			12: {
				equipment: {
					mask: {
						1: ItemMaskID.EquipWeapon,
						2: ItemMaskID.EquipWeapon,
					}
				}
			},
			17: {
				equipment: {
					mask: {
						1: ItemMaskID.EquipWeapon,
						2: ItemMaskID.EquipWeapon,
						3: ItemMaskID.EquipWeapon,
					}
				}
			},

		},
		baseXP: 100,
		XPExponent: __SECRET_XP_EXPONENT,

	},
	[SecretID.Anatomy]: {
		name: ["Bodily Secrets"],
		description: ["With enough cuts, you can know many things."],
		constantBonus: {
			attributes: {
				[AttributeType.Learning]: {
					value: 5,
					bonus: 5,
					aptitude: 0.05,
					aptitudeBase: 0.05,
				},
			},
			resources: {
				[ResourceType.Health] : {
					maxValue: 5,
					maxBonus: 5,
				},
			},
		},
		specificBonus: {
			
			5: {
				derivatives: {
					[DerivativeType.Attack]: {
						value: 10,
						bonus: 10,	
					}
				},
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
