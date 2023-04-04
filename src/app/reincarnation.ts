import { AttributeObject} from './body';

export type Jati = {

	name: string,
	description: string,
	karma: number,
	initialAttributes: AttributeObject,


};

type JC = {

	[key: string] : Jati	

};

export const JatiCollection : JC = {
		
	laborer:  {
		
		name: "Laborer",
		description: "Your pater familias was the second youngest of his father's sons, on a plot too small to support a family for each of them. He conspired with his brothers to kill the youngest, but he, out of all of them, was the one to show mercy at the last. He drugged the boy instead, and let him float down the river. When water left the land, the remaining brothers went to town for work. The rest of the brothers starved. The one of them who showed mercy was saved, fed by the mayor at his palace for half a year. You are true, as were your ancestors.",
		karma: 50,
		initialAttributes: {	
	
			body: {
				value: 15,
				aptitude: 1.3,
			},
			cunning: {
				value: 1,
				aptitude: 1,
			},
			learning: {
				value: 1,
				aptitude: 1,
			},
			charisma: {
				value: 4,
				aptitude: 1,
			},
			nobility: {
				value: -10,
				aptitude: 0.8,
			},
			summer: {
				value: 0,
				aptitude: 1.0,
			},
			shine: {
				value: 0,
				aptitude: 1.0,
			},
			

		},



	},

	shepherd:  {
		
		name: "Shepherd",
		description: "Your people are the most devout of all. When the king's priests sent word to colonize the then-empty lands of southern continent, your ancestors were the first to come. You know the holy verses by haert. They live between your tongues after the sun falls. They say that Arima was meant to be born among you, but was stolen away by the jealous Bull-Priests.",
		karma: 100,
		initialAttributes: {	
	
			body: {
				value: 4,
				aptitude: 1.0,
			},
			cunning: {
				value: 5,
				aptitude: 1.1,
			},
			learning: {
				value: 8,
				aptitude: 1.25,
			},
			charisma: {
				value: 1,
				aptitude: 1,
			},
			nobility: {
				value: 0,
				aptitude: 1.2,
			},
			summer: {
				value: 0,
				aptitude: 1.0,
			},
			shine: {
				value: 0,
				aptitude: 1.0,
			},


		},



	},

	forestPerson:  {
		
		name: "Forest Person",
		description: "TODO",
		karma: -300,
		initialAttributes: {	
	
			body: {
				value: 10,
				aptitude: 2,
			},
			cunning: {
				value: 1,
				aptitude: 1,
			},
			learning: {
				value: 1,
				aptitude: 1,
			},
			charisma: {
				value: 1,
				aptitude: 1,
			},
			nobility: {
				value: -100,
				aptitude: 0.2,
			},
			summer: {
				value: 0,
				aptitude: 1.0,
			},
			shine: {
				value: 0,
				aptitude: 1.0,
			},


		},



	},

	wretch:  {
		
		name: "Wretch",
		description: "TODO",
		karma: -1000000,
		initialAttributes: {	
	
			body: {
				value: 1,
				aptitude: 0.2,
			},
			cunning: {
				value: 1,
				aptitude: 0.2,
			},
			learning: {
				value: 1,
				aptitude: 0.2,
			},
			charisma: {
				value: 1,
				aptitude: 0.2,
			},
			nobility: {
				value: -1000,
				aptitude: 0.0,
			},
			summer: {
				value: 0,
				aptitude: 0.2,
			},
			shine: {
				value: 0,
				aptitude: 0.2,
			},


		},



	},

};

export function DefaultJati(): Jati{
		
	return JatiCollection.laborer;

}

export function GenerateJati(inKarma: number): Jati{

	let k: string;
	let bestJati: string = "laborer";
	let bestKarma: number = 100000;
	let tmp: number = 0;

	for (k in JatiCollection){
		
		tmp = Math.abs(JatiCollection[k].karma - inKarma);

		if (tmp < bestKarma){
			bestJati = k;
			bestKarma = tmp;

		}
		
	}

	return JatiCollection[bestJati];

}


