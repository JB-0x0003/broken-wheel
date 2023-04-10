import {Body, initialBody} from './body';
import {SecretID, SecretObject, SecretRecord} from './secrets';
import EventSuite, {FlagCollection} from './events';
import { ActivityID, ActivityRecord} from './activities';
import {Zone} from './world-service';
import LocationCollection, {LocationID} from './locations';
import {mergeObjects} from '../helpers';

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
	currentSecretID: SecretID;

	body: Body;
	secrets: SecretObject;
	ZoneCollection: Zone[];
}

export function saveStateToLocal(inState : StateObject): void{
	
	localStorage.setItem('state', JSON.stringify(inState));	

}

export function loadStateFromLocal(): StateObject{
	

	//TODO make this more robust
	let temp = localStorage.getItem('state');
	let loadedSave =  JSON.parse(temp);
	
	console.log("Loaded Save Data");
	console.log(loadedSave);
	if (loadedSave === null || loadedSave === undefined) loadedSave = {};
	//Ensures that the loaded save has all the required fields
	//Completely overwrites if there is no save data
	mergeObjects(defaultState(), loadedSave);
	
	console.log("Save Data after validation");
	console.log(loadedSave);

	return loadedSave as StateObject;
}

export function defaultOptions() : OptionObject{

	let tempOpt : OptionObject = {
		
		autosaveMS : 60000,
	};

	return tempOpt;
}

export function defaultActivityRecord() : ActivityRecord{

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
	
	console.log("Default Activity Record Generated");
	console.log(tmpRecord);
	return tmpRecord;

}

export function defaultEventFlags(): FlagCollection{

	let tmp = {};
	for (let key in EventSuite) {
		
		tmp[key] = {}

	}

	let defFlags = (tmp as FlagCollection);

	defFlags.script.named = false;

	return defFlags;

}

export function defaultSecretRecord(): SecretObject{

	let tmpRecord = {};
	let IDCollection = Object.keys(SecretID);
	let IDTotal = IDCollection.length;
	

	for (let i = 0; i < IDTotal; ++i){
		
		let currID = IDCollection[i];
		currID = SecretID[currID];

		tmpRecord[currID] = {
			
			ID: currID,
			rank: 0,
			XP: 0,
		} as SecretRecord

	}

	return tmpRecord as SecretObject;

}

export function defaultState() : StateObject{

	//create default values for event flags
	

	return {
		
		name: "Nameless",
		options: defaultOptions(),
		dayTotal : 0,
		lifeTotal: 0,
		trueYear : 4294967296,
		activityRecord: defaultActivityRecord(),	

		inEvent: false,
		currentEvent : ["system",1000],
		eFlags : defaultEventFlags(),
		
		currentZone : 0,
		currentLocation : 0,
		currentActivityID : ActivityID.Oddjobs,
		currentSecretID : SecretID.Swords,
		
		body: initialBody(),
		secrets: {
			[SecretID.Swords]: {
				ID: SecretID.Swords,
				rank: 0,
				XP: 0,
			},
			[SecretID.Weapons]: {
				ID: SecretID.Weapons,
				rank: 0,
				XP: 0,
			}
		},
		ZoneCollection : [
			{
				name: "Lateri",
				stinger: "Marsh and Salt",
				locations: [
					LocationCollection[LocationID.CommonGrounds],
					LocationCollection[LocationID.Plantation],

				],
					
				

			},
		],
	};

}
