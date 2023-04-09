import {BonusObject, DerivativeType} from './common-types';

export enum SecretID{

	Swords = 'swords',
	Weapons = 'weapons',

}

export type Secret = {
	
	name: string[];
	thresholds: number[];	

}

export type SecretRecord = {
	
	ID: SecretID;
	rank: number;
	progress: number;
	constantBonus: BonusObject;
	specificBonus: BonusObject[];
}

export type SecretObject = {

	[key in SecretID]: SecretRecord;	

}

/*let SecretCollection : SecretObject = {
	
	[SecretID.Swords]: {
	}
}*/
