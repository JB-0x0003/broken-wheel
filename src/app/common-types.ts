

export const enum AttributeType{

	Body = "body",
	Cunning ="cunning",
	Learning = "learning",
	Charisma = "charisma",
	Nobility = "nobility",
	Shine = "shine",
	Summer = "summer",

}


export const enum DerivativeType{

	Attack = "attack",
	Defense = "defense",

}

export const enum ResourceType{
	Stamina = "stamina",
	Health = "health",
	Life = "lifespan",

}


export type AttributeObject = {
	[key in AttributeType]:{
		value: number;
		aptitude: number;
	}


}


export type DerivativeObject = {
	
	[key in DerivativeType]: {

		value: number,
		base: number,

	};

}

export type ResourceObject = {

	[key in ResourceType]:{
		value: number;
		max: number;
	}

}
