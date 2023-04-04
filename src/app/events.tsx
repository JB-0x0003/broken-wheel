import {ServiceObject} from "./global-service-provider";
import {pipeAge} from './helpers';

export enum EventType {

	Default,
	List,
	Beherit,
	Options,
	UploadSave,

}

export interface EventChoice{
	
	text: Function;
	tooltip?: Function;
	consequence: Function;

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
	return "This game is 2"
	},
	choices : [
	],

};

/////////SCRIPTED EVENTS/////////

EventSuite.script[1001] = {
	title: ()=>{return "A Naming"},
	eType: EventType.Beherit,
	form: {"name" : "text"},
	dismissable: false,
	bodyText : ()=>{return ""},
	choices:[
		{
			text: ()=>{return "It's done."},
			consequence: (sv : ServiceObject, formData)=>{
				sv.Character.setName(formData.name);
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
