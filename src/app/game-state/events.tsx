import {ServiceObject} from "../global-service-provider";
import {pipeAge, pipeName} from '../helpers';

export enum EventType {

	Default	= "default",
	List = "list",
	Beherit = "beherit",
	Options = "options",
	Save = "save",

}

export interface EventChoice{
	
	text: (sv?: ServiceObject)=>string;
	tooltip?: (sv?: ServiceObject)=>string;
	consequence: (sv: ServiceObject, formData?: any)=>void;

}

export interface EventForm{

	[key: string] : "text";

}

export interface Event{

	eType?: EventType;
	dismissable?: boolean;
	form?: EventForm;
	title: Function;
	bodyText: Function;
	choices: EventChoice[];
	
}


export interface SuiteNamespace{
	
	[key : number] : Event;

}

export interface SuiteFlags{
	
	[key : string] : string | number | boolean;

}

//BOTH OF THESE SHOULD HAVE THE SAME KEYS
export interface Suite{

	system: SuiteNamespace;
	script: SuiteNamespace;
	death: SuiteNamespace;


}

//SHOULD HAVE SAME KEYS AS ONE ABOVE
//Flags cannot be guaranteed to be defined
export interface FlagCollection{
	
	system: SuiteFlags,
	script: SuiteFlags,
	death: SuiteFlags,

}

let EventSuite : Suite = {


	system : {},
	script: {},
	death : {},



};

/////////SYSTEM EVENTS//////////

EventSuite.system[1000] = {
	title : ()=>{return "Error Event"},
	bodyText : ()=>{return "Please send a bug report :("},
	choices : [
		{
			text: ()=>{return "Uh-Oh!"},
			consequence: (sv: ServiceObject)=>{}
		}
	],
};

EventSuite.system[1001] = {

	title: ()=>{return "Options"},
	eType: EventType.Options,
	bodyText: ()=>{},
	choices : [
	],

};

EventSuite.system[1002] = {

	title: ()=>{return "Basic Information"},
	bodyText: (sv : ServiceObject)=>{
		return (
`This is an idle time management game. At any given time, your character will be doing one action that you've selected. Generally, this will increase your stats, over time, increasing your proficiency at the options you have available to you, and often unlocking new ones.
	
On the left-hand side you'll see Stamina, Health, and Lifespan. Stamina is reduced in combat, and regenerates over time based on how high your health is. Health is your longer term health. It's one of the primary factors determining how long you live. The lower it is, the more quickly your lifespan will decrease. Eat better food to increase it up to its current cap. Lifespan is how much of your lifespan is left. When it reaches 0 you die.

If an effect would cause your Stamina to go below 0, your Health is decreased instead. If an effect would cause your Health to go below 0, your lifespan will be decreased instead. This means starvation will quickly kill you.

At the end of every day, you will automatically buy food if you don't have any in your inventory. If this is happening, a red food icon will appear in the top right of the equipment panel, on the right side of the screen.${(sv.ST.eFlags.script.named === true)? `\n\n${sv.ST.name} is your name. You can't change it anymore.` :``}`)
	},
	choices : [
	],

};


EventSuite.system[1003] = {

	title: ()=>{return "Saves"},
	eType: EventType.Save,
	bodyText:()=>{return ""},
	choices: [],

}

/////////SCRIPTED EVENTS/////////

EventSuite.script[1001] = {
	title: ()=>{return "A Naming"},
	eType: EventType.Beherit,
	form: {"name" : "text"},
	dismissable: false,
	bodyText : ()=>{
		return( 
`You were crippled from birth, scrounging for scraps between wheezes of your fluid filled chest. Your limbs are heavier every day. You don't know why this is the case and no one has ever told you. You cough up blood occasionally. Other figures sometimes approach you, but quickly recoil when you get close to them. \n\tYou live in a dank hole, away from others. It's safer this way. The bruises from when you dared to be near them never healed properly. Scraps litter the ground. Inedible gristle you weren't able to swallow. It's been like this for as long as you can remember: Alone and Hurting. Something is wrong with your body. You don't know what you did in a past life to deserve this. There's almost certainly a way to fix your situation, but you don't know what it is, and no one is interested in helping you know what it is.\n\tThat doesn't matter right now, though. There's a pain in your chest and standing up makes you dizzy and light-headed. It's going to end soon. You cover yourself in tattered cloth to fight off the chills and shivers. You clutch one of your few possessions in your hand: a small red amulet covered in eyes. It's unnaturally warm. A small ferret-like creature with a human face slinks towards you on all fours, its arms pulling itself forwards as its body glides across the ground like it's a liquid. It drops a contract and quill next to you. You can't read it, but you know what it offers. The thoughts are pushed into your head. The bargain on offer is to make a sacrifice what you have to gain power. You don't think you have anything worth taking, but the deal is still there, waiting for you to sign.`
	)},
	choices:[
		{
			text: ()=>{return "Sign. You have nothing to lose."},
			consequence: (sv : ServiceObject, formData)=>{
				sv.Character.setName(pipeName(formData.name));
				sv.Character.st.eFlags.script.named = true;
			},
		},
		{
			text: ()=>{return "Don't Sign. Let the pain end."},
			consequence: (sv : ServiceObject)=>{
				window.close();

			},

		}
	],

};

/////////DEATH EVENTS////////

EventSuite.death[1001] = {
	title : ()=>{return "You Died!"},
	eType: EventType.Default,
	dismissable: true,
	bodyText : (sv : ServiceObject)=>{return (
		"You died at the age of " + pipeAge(sv.MainLoop.previousAge)
	)},
	choices : [
	],
};
export default EventSuite;
