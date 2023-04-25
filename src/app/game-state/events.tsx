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
	bodyText: ()=>{
		return "This is an idle time management game. At any given time, your character will be doing one action that you've selected. Generally, this will increase your stats, over time, increasing your proficiency at the options you have available to you, and often unlocking new ones.\tOn the left-hand side you'll see Stamina, Health, and Lifespan. Stamina is reduced in combat, and regenerates over time based on how high your health is. Health is your longer term health. It's one of the primary factors determining how long you live. The lower it is, the more quickly your lifespan will decrease. Eat better food to increase it up to its current cap. Lifespan is how much of your lifespan is left. When it reaches 0 you die. If an effect would cause your Stamina to go below 0, your Health is decreased instead. If an effect would cause your Health to go below 0, your lifespan will be decreased instead. This means starvation will quickly kill you."
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
		return( ""

	)},
	choices:[
		{
			text: ()=>{return "It's done."},
			consequence: (sv : ServiceObject, formData)=>{
				sv.Character.setName(pipeName(formData.name));
				sv.Character.st.eFlags.script.named = true;
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
