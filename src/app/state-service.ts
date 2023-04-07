import {JatiID} from './reincarnation';
import {Body, genBody} from './body';
import EventSuite, {FlagCollection} from './events';
import { ActivityID, ActivityRecord} from './activities';
import {Zone} from './world-service';
import LocationCollection, {LocationID} from './locations';

export interface OptionObject{

	autosaveMS: number;
	

}

export interface StateObject{
	
	name: string;
	options: OptionObject;
	dayTotal: number;
	lifeTotal: number;
	trueYear: number;
	activityRecord: ActivityRecord;

	inEvent: boolean;
	currentEvent: [string,number];
	eFlags: FlagCollection;

	currentZone : number;
	currentLocation: number;
	currentActivityID : ActivityID;

	body: Body;
	ZoneCollection: Zone[];
}

export function saveStateToLocal(inState : StateObject): void{
	
	localStorage.setItem('state', JSON.stringify(inState));	

}

export function loadStateFromLocal(): StateObject{
	

	//TODO make this more robust
	let temp = localStorage.getItem('state');
	return JSON.parse(temp);
	

}

export function autoLoadState(): StateObject{
	

	//TODO add version handling
	let temp = JSON.parse(localStorage.getItem('state'));
	//TODO check if save is valid	
	//this only checks if the save data is present
	if (temp){ 
		return temp as StateObject;
		// eslint-disable-next-line no-unreachable
		console.log("Loaded save data");
	}
	else return defaultState();

}

export function defaultOptions() : OptionObject{

	let tempOpt : OptionObject = {
		
		autosaveMS : 60000,
	};

	return tempOpt;
}

export function defaultState() : StateObject{

	//create default values for activity recording
	
	let tmpRecord : ActivityRecord = {};
	let IDCollection = Object.keys(ActivityID);
	let IDTotal = IDCollection.length;
	//This is some weird cludge
	for (let i = 0; i < IDTotal; ++i){
		
		let currID = IDCollection[i];
		currID = ActivityID[currID];

		tmpRecord[currID] = {
			
			aID: currID as ActivityID,
			discovered : false,
			meetsReqs: false,
		}

	}
	
	console.log(tmpRecord);

	let aRecord = tmpRecord as ActivityRecord;
	
	//create default values for event flags
	let tmp = {};
	for (let key in EventSuite) {
		
		tmp[key] = {}

	}

	let defFlags = (tmp as FlagCollection);

	defFlags.script.named = false;


	return {
		
		name: "Nameless",
		options: defaultOptions(),
		dayTotal : 0,
		lifeTotal: 0,
		trueYear : 4294967296,
		activityRecord: aRecord,	

		inEvent: false,
		currentEvent : ["system",1000],
		eFlags : defFlags,
		
		currentZone : 0,
		currentLocation : 0,
		currentActivityID : ActivityID.Oddjobs,
		
		body: genBody(JatiID.Wretch),
		ZoneCollection : [
			{
				name: "Lateri",
				stinger: "Marsh and Salt",
				parentService: this,
				locations: [
					LocationCollection[LocationID.CommonGrounds],
					LocationCollection[LocationID.Plantation],

				],
					
				

			},
		],
	};

}
