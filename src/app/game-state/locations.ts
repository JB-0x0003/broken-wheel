import {ActivityID} from './activities';

export enum LocationID {

	CommonGrounds = "commongrounds",
	Plantation = "plantation",
	ForestOutskirts = "forestoutskirts",
	TownAcademy = "townacademy",
}



export interface Location {
	
	name : string;
	activities : ActivityID[];

}

interface LocationSuite {

	[key: string]: Location;

}

let LocationCollection : LocationSuite = {};


LocationCollection[LocationID.CommonGrounds] = {
	
	name: "Common Grounds",
	activities: [
		
		ActivityID.Oddjobs,
		ActivityID.Begging,
		ActivityID.Poetry,
		ActivityID.Stealing,

	],

};

LocationCollection[LocationID.Plantation] = {
	
	name: "Plantation",
	activities: [

		ActivityID.FieldLabor,

	],

};

LocationCollection[LocationID.ForestOutskirts] = {
	
	name: "Forest Outskirts",
	activities: [
		ActivityID.Hunting,
	],

}

LocationCollection[LocationID.TownAcademy] = {
	
	name: "Academy",
	activities: [
		ActivityID.Tutoring,
	]

}

export default LocationCollection;
