import {ServiceObject} from '../global-service-provider';
import {meatGenItems, generateItems} from './items';
import {BagID} from './inventory';
import {AttributeType} from '../common-types';

export const __SKILL_XP_EXPONENT = 1.5;
export const __SKILL_BASE_XP = 100;

export enum ActivityID {
	
	None = "none",
	Oddjobs = "oddjobs",
	Meditation = "meditation",
	Begging = "begging",
	FieldLabor = "fieldlabor",
	Poetry = "poetry",
	Stargazing = "stargazing",
	Theft = "theft",
	Hunting = "hunting",
	Tutoring = "tutoring",
	Academia = "academia",
};

export enum SkillID {
		
	None = "none",
	Farming = "farming",
	Begging = "begging",
	Academia = "academia",
	Theft = "theft",
	
};


export interface Activity{

	name: string[],
	ID: ActivityID,
	skill: SkillID,
	description: string[],
	gerund: string[],
	rankThreshold: number[],
	requirements: (sv : ServiceObject)=>boolean,
	consequence: ((sv : ServiceObject) => void)[],
};

export interface Skill{
	
	name: string,
	ID: SkillID,
	baseXP: number,
	XPExponent: number,


}

export type ActivityIndex = {

	ID: ActivityID;
	discovered: boolean;
	meetsReqs: boolean;

};

export type ActivityRecord = {
	
	[key: string] : ActivityIndex;

}

export type SkillIndex = {
	
	ID: SkillID;
	discovered: boolean;
	rank: number;
	xp: number;

}

export type SkillObject = {
	
	[key in SkillID] : SkillIndex;

}

let ActivityCollection : {[key in ActivityID]? : Activity} = {};

ActivityCollection[ActivityID.None] = {
	//Activity that should never activate and should prevent player from advancing time
	name: ['None'],
	ID: ActivityID.None,
	skill: SkillID.None,
	description: ['!!ERROR: PLAYER SHOULD NOT SEE THIS!!'],
	gerund: [''],
	rankThreshold: [],
	requirements: ()=>{return false},
	consequence: [()=>{}],


};

ActivityCollection[ActivityID.Oddjobs] = {
	//default activity, probably important to make give this no side-effects
	name: ['Odd Jobs'],
	ID: ActivityID.Oddjobs,
	skill: SkillID.None,
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
	ID: ActivityID.Meditation,
	skill: SkillID.None,
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
	ID: ActivityID.Begging,
	skill: SkillID.Begging,
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
	ID: ActivityID.FieldLabor,
	skill: SkillID.Farming,
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
	ID: ActivityID.Poetry,
	skill: SkillID.Academia,
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
	ID: ActivityID.Poetry,
	skill: SkillID.None,
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

ActivityCollection[ActivityID.Theft] = {

	name: ['Pickpocket'],
	ID: ActivityID.Theft,
	skill: SkillID.Theft,
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
	ID: ActivityID.Hunting,
	skill: SkillID.None,
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
			workpower = workpower * 0.22;			


			workpower = Math.min(workpower, 100);

			//console.log("Workpower: " + workpower);

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
	ID: ActivityID.Academia,
	skill: SkillID.Academia,
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

let SkillCollection : {[key in SkillID]? :Skill} = {};

SkillCollection[SkillID.None] = {
	
	name: "Error",
	ID: SkillID.None,
	baseXP: 99999,
	XPExponent: 99,


}

SkillCollection[SkillID.Farming] = {

	name: 'Farming',
	ID: SkillID.Farming,
	baseXP: __SKILL_BASE_XP,
	XPExponent: __SKILL_XP_EXPONENT,

}

SkillCollection[SkillID.Begging] = {
	
	name: 'Begging',
	ID: SkillID.Begging,
	baseXP: __SKILL_BASE_XP,
	XPExponent: __SKILL_XP_EXPONENT,

}

SkillCollection[SkillID.Academia] = {
	
	name: 'Academia',
	ID: SkillID.Academia,
	baseXP: __SKILL_BASE_XP,
	XPExponent: __SKILL_XP_EXPONENT,

}

SkillCollection[SkillID.Theft] = {

	name: 'Theft',
	ID: SkillID.Theft,
	baseXP: __SKILL_BASE_XP,
	XPExponent: __SKILL_XP_EXPONENT,

}



export {SkillCollection};
export default ActivityCollection;
