import {Bag} from './game-state/inventory';

export enum ThemeType {

	Dark = "dark",
	Light = "light",

}


interface StatRecord {
	
	name: string;
	description: string;

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

type AttributeRecord = {
	

} & StatRecord;

type AttributeRecordSuite = {
	[key in AttributeType]: AttributeRecord;
}

export let AttributeData : AttributeRecordSuite = {
	
	[AttributeType.Body] : {
		
		name: "Body",
		description: "Physical strength and endurance. Increases attack and defense.",

	},
	[AttributeType.Cunning] : {
		
		name: "Cunning",
		description: "Agility, reflexes, and street-smarts. Increases attack and defense. Increases defense less than Body does.",

	},
	[AttributeType.Learning] : {
		name: "Learning",
		description: "Understanding of the world's deeper knowledge.",

	},
	[AttributeType.Charisma] : {
		name: "Charisma",
		description: "Ability to influence others.",

	},
	[AttributeType.Nobility] : {
		name: "Nobility",
		description: "To be all man can be. Improves base reputation and attack when using noble weapons. They know what you are just from looking at you.",
	},
	[AttributeType.Shine] : {
		
		name: "Shine",
		description : "Stars, mirrors, and anything that glimmers in the dark. They watch you from between breaths.",

	},
	[AttributeType.Summer] : {
		
		name: "Summer",
		description: "Sweat sticks to your back just thinking about it.",

	}

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

export type DerivativeRecord = {
	

} & StatRecord;

type DerivativeRecordSuite = {

	[key in DerivativeType]: DerivativeRecord;
}

export let DerivativeData : DerivativeRecordSuite = {
	
	[DerivativeType.Attack] : {
		name: "Attack",
		description: "Physical damage dealt via normal attacks.",
	},
	[DerivativeType.Defense] : {
		name: "Defense",
		description: "Physical damage reduction.",

	}
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
