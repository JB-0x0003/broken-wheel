import {ServiceObject} from '../global-service-provider';
import {meatGenItems, generateItems} from './items';
import {BagID} from './inventory';
import {AttributeType} from '../common-types';


export enum ActivityID {

	Oddjobs = "oddjobs",
	Meditation = "meditation",
	Begging = "begging",
	FieldLabor = "fieldlabor",
	Poetry = "poetry",
	Stargazing = "stargazing",
	Stealing = "stealing",
	Hunting = "hunting",
	Tutoring = "tutoring",
	Academia = "academia",
};

export enum ActivityType {
		
	Oddjobs = "oddjobs",
	Farming = "farming",

};


export interface Activity{

	name: string[],
	aID: ActivityID,
	description: string[],
	gerund: string[],
	rankThreshold: number[],
	requirements: (sv : ServiceObject)=>boolean,
	consequence: ((sv : ServiceObject) => void)[],
};

export type ActivityIndex = {

	aID: ActivityID;
	discovered: boolean;
	meetsReqs: boolean;

};

export type ActivityRecord = {
	
	[key: string] : ActivityIndex;

}

let ActivityCollection : {[key: string] : Activity}= {};

ActivityCollection[ActivityID.Oddjobs] = {
	//default activity, probably important to make give this no side-effects
	name: ['Odd Jobs'],
	aID: ActivityID.Oddjobs,
	description: ['Errands, cleaning latrines, last-second grunt work. Anything no-skill that makes a little money. Increases ignoble attributes by a small amount.'],
	gerund: ['Doing odd jobs'],
	rankThreshold: [],
	requirements: ()=>{return true},
	consequence: [
		(sv : ServiceObject) => {
			sv.Character.trainAttribute(AttributeType.Body,0.025);
			sv.Character.trainAttribute(AttributeType.Cunning,0.025);
			sv.Character.trainAttribute(AttributeType.Learning,0.025);
			sv.Character.trainAttribute(AttributeType.Charisma,0.025);

			sv.Character.giveMoney(2);
	}],
};

ActivityCollection[ActivityID.Meditation] = {
	
	name: ['Meditation'],
	aID: ActivityID.Meditation,
	description: ['PLAYER SHOULD NOT SEE THIS'],
	gerund: ['Meditating'],
	rankThreshold: [],
	requirements: ()=>{return true},
	consequence: [
		(sv : ServiceObject) => {
			let targetSecret = sv.ST.currentSecretID;
			
			sv.Character.trainSecret(targetSecret,1.0);

		}
	]
}

ActivityCollection[ActivityID.Begging] = {

	name: ['Begging'],
	aID: ActivityID.Begging,
	description: ['Pitifully beg for pocket change. Increases charisma. Very ignoble.'],
	gerund: ['Begging'],
	rankThreshold: [],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr.charisma.value >= 10) return true
		else return false
	},
	consequence: [
		(sv : ServiceObject) => {
			let workpower = sv.ST.body.attributes.charisma.value;

			sv.Character.giveMoney(workpower * 0.1);

			sv.Character.trainAttribute(AttributeType.Charisma,0.1);
			sv.ST.body.attributes.nobility.value -= 0.1;
	}],
};

ActivityCollection[ActivityID.FieldLabor] = {
	name: ['Field Labor'],
	aID: ActivityID.FieldLabor,
	description: ['Work someone else\'s land. Disabled at low reputation. Makes a little money and makes a little food. Increases body.'],
	gerund: ["Picking"],
	rankThreshold: [0],
	requirements: (sv : ServiceObject)=>{
		let rep = sv.World.getCurrentZoneReputation();
		if (rep < -250) return false;
		else {
		
			let attr = sv.ST.body.attributes;

			if (attr.body.value >= 20) return true
			else return false
		}

	},
	consequence: [
		(sv : ServiceObject) => {
		let attr = sv.ST.body.attributes;
		let workPower = attr.body.value + attr.summer.value * 3.0;
		
		sv.Character.giveMoney(workPower * 0.12);	

		sv.Character.trainAttribute(AttributeType.Summer,0.01);
		sv.Character.trainAttribute(AttributeType.Body,0.12);
	}],
};

ActivityCollection[ActivityID.Poetry] = {
	name: ['Study Poetry'],
	aID: ActivityID.Poetry,
	description: ["Grind yourself against the wheel of literature until you shine as a diamond in the rough"],
	rankThreshold: [0],
	gerund: ["Exploring the classics"],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr.learning.value >= 20) return true
		else return false
	},
	consequence: [
		(sv : ServiceObject) => {
			sv.Character.trainAttribute(AttributeType.Learning, 0.12);
			sv.Character.trainAttribute(AttributeType.Nobility, 0.01);
			sv.Character.trainAttribute(AttributeType.Shine, 0.01);


	}],
};

ActivityCollection[ActivityID.Stargazing] = {
	name: ['Gaze At The Stars'],
	aID: ActivityID.Poetry,
	description: ["TODO"],
	gerund: ["Gazing"],
	rankThreshold: [0],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr.learning.value >= 20) return true
		else return false
	},
	consequence: [
		(sv : ServiceObject) => {
			sv.Character.trainAttribute(AttributeType.Nobility, 0.015);
			sv.Character.trainAttribute(AttributeType.Shine, 0.025);


	}],
};

ActivityCollection[ActivityID.Stealing] = {

	name: ['Pickpocket'],
	aID: ActivityID.Stealing,
	description: ["Makes money and lowers reputation. Potentially decreases the town's prosperity. Trains cunning."],
	gerund: ["Pickpocketing"],
	rankThreshold: [0],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr.cunning.value >= 20) return true
		else return false
	},
	consequence: [
		(sv : ServiceObject) => {
			let workpower = sv.ST.body.attributes.cunning.value;

			sv.Character.giveMoney(workpower * 0.08);
			sv.Character.trainAttribute(AttributeType.Cunning, 0.12);
			sv.World.decreaseReputation(workpower * 0.003);
			sv.World.decreaseProsperity(workpower * 0.001);
	}]

}

ActivityCollection[ActivityID.Hunting] = {

	name: ['Hunt'],
	aID: ActivityID.Hunting,
	description: ["Hunt for food. Trains body and cunning."],
	gerund: ["Stalking Prey"],
	rankThreshold: [0],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr[AttributeType.Body].value >= 50 && attr[AttributeType.Cunning].value >= 75) return true
		else return false

	},
	consequence: [
		(sv : ServiceObject) => {
			let attr = sv.ST.body.attributes;
			let workpower = attr.body.value * 0.3 + attr.cunning.value * 0.6 + attr.summer.value * 1.0;
			workpower = workpower * 0.09;			


			workpower = Math.min(workpower, 50);

			console.log("Workpower: " + workpower);

			let meatDrop = generateItems(meatGenItems, workpower);
			sv.Character.addItemDropToBag(BagID.Inventory, meatDrop);

			sv.Character.trainAttribute(AttributeType.Body, 0.04);
			sv.Character.trainAttribute(AttributeType.Cunning, 0.08);
			sv.Character.trainAttribute(AttributeType.Summer, 0.02);
	}]

}

const studyCost = 5;

ActivityCollection[ActivityID.Tutoring] = {
	
	name: ['Get Tutoring'],
	aID: ActivityID.Academia,
	description: [`Pay ₹${studyCost} to be taught by faculty from the local academy. Trains learning.`],
	gerund: ["Studying"],
	rankThreshold: [0],
	requirements: (sv : ServiceObject)=>{
		let attr = sv.ST.body.attributes;
		
		if (attr.learning.value >= 5 && sv.ST.body.money > studyCost) return true
		else return false

	},
	consequence: [
		
		(sv : ServiceObject)=>{
			sv.Character.trainAttribute(AttributeType.Learning, 0.2);
			sv.Character.payMoney(studyCost);
		}
	],

}


export default ActivityCollection;
