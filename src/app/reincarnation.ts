import { AttributeObject} from './common-types';

export enum JatiID {
	Laborer="laborer",
	Shepherd="shepherd",
	ForestPerson="forestperson",
	Wretch="wretch",
	

}

export type Jati = {

	name: string,
	description: string,
	karma: number,
	initialAttributes: AttributeObject,


};

type JC = {

	[key in JatiID] : Jati	

};

export const JatiCollection : JC = {
		
	[JatiID.Laborer]:  {
		
		name: "Laborer",
		description: "Your pater familias was the second youngest of his father's sons, on a plot too small to support a family for each of them. He conspired with his brothers to kill the youngest, but he, out of all of them, was the one to show mercy at the last. He drugged the boy instead, and let him float down the river. When water left the land, the remaining brothers went to town for work. The rest of the brothers starved. The one of them who showed mercy was saved, fed by the mayor at his palace for half a year. You are true, as were your ancestors.",
		karma: 50,
		initialAttributes: {	
	
			body: {
				value: 15,
				base: 15,
				bonus: 0,
				mult: 1,
				aptitude: 1.3,
				aptitudeBase: 1.3,
				aptitudeBonus: 0,
					
			},
			cunning: {
				value: 1,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			learning: {
				value: 1,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			charisma: {
				value: 1,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			nobility: {
				value: -10,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 0.8,
				aptitudeBase: 0.8,
				aptitudeBonus: 0,
			},
			summer: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			shine: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			

		},



	},

	[JatiID.Shepherd]:  {
		
		name: "Shepherd",
		description: "Your people are the most devout of all. When the king's priests sent word to colonize the then-empty lands of southern continent, your ancestors were the first to come. You know the holy verses by haert. They live between your tongues after the sun falls. They say that Arima was meant to be born among you, but was stolen away by the jealous Bull-Priests.",
		karma: 100,
		initialAttributes: {	
	
			body: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			cunning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			learning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			charisma: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			nobility: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			summer: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			shine: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},


		},



	},

	[JatiID.ForestPerson]:  {
		
		name: "Forest Person",
		description: "TODO",
		karma: -300,
		initialAttributes: {	
	
			body: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			cunning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			learning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			charisma: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			nobility: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			summer: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			shine: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},


		},



	},

	[JatiID.Wretch]:  {
		
		name: "Wretch",
		description: "TODO",
		karma: -1000000,
		initialAttributes: {	
	
			body: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			cunning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			learning: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			charisma: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			nobility: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			summer: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},
			shine: {
				value: 0,
				base: 1,
				bonus: 0,
				mult: 1,
				aptitude: 1,
				aptitudeBase: 1,
				aptitudeBonus: 0,
			},


		},



	},

};

export function DefaultJati(): Jati{
		
	return JatiCollection.laborer;

}

export function generateJati(inKarma: number): JatiID{

	let k: JatiID;
	let bestJati: JatiID = JatiID.Laborer;
	let bestKarma: number = 100000000;
	let tmp: number = 0;

	for (k in JatiCollection){
		
		tmp = Math.abs(JatiCollection[k].karma - inKarma);

		if (tmp < bestKarma){
			bestJati = k;
			bestKarma = tmp;

		}
		
	}

	return bestJati;

}


