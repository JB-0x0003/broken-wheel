import {Bag} from './game-state/inventory';

export enum ThemeType {

	Dark = "dark",
	Light = "light",

}
	
export enum AttributeType{

	Body = "body",
	Cunning ="cunning",
	Learning = "learning",
	Charisma = "charisma",
	Nobility = "nobility",
	Shine = "shine",
	Summer = "summer",

}

export enum ResourceType{
	Stamina = "stamina",
	Health = "health",
	Life = "lifespan",

}

export enum DerivativeType{

	Attack = "attack",
	Defense = "defense",

}

export type AttributeObject = {
	[key in AttributeType]:{
		value: number;
		base: number;
		bonus: number;
		mult: number;
		aptitude: number;
		aptitudeBase: number;
		aptitudeBonus: number;
	}


}

export type ResourceObject = {

	[key in ResourceType]:{
		value: number;
		maxValue: number;
		maxBase: number;
		maxBonus: number;
		maxMult: number;
	}

}

export type DerivativeObject = {
	
	[key in DerivativeType]: {

		value: number,
		base: number,
		attrBonus: number,
		bonus: number,
		mult: number,

	};

}

export type OptionalType<T> = {

	[key in T as string]?: T[keyof T];

}

export type AttributeBonus = {
	
	[key in AttributeType]? : OptionalType<AttributeObject[AttributeType.Body]>


}

export type DerivativeBonus = {
	
	[key in DerivativeType]? : OptionalType<DerivativeObject[DerivativeType.Attack]>

}

export type ResourceBonus = {

	[key in ResourceType]? : OptionalType<ResourceObject[ResourceType.Stamina]>
}

export type BagBonus = {
	
	[key in keyof Bag]?: OptionalType<Bag[key]>;
	
}

export type BonusObject = {
	
	attributes?: AttributeBonus;
	derivatives?: DerivativeBonus;
	resources?: ResourceBonus;
	inventory?: BagBonus;
	equipment?: BagBonus;
	money?: number

}

export type BonusObjectRanks = {

	[key: number]: BonusObject;
}
