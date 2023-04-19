import {ActivityID} from './activities';

export enum LocationID {

	CommonGrounds = "commongrounds",
	Plantation = "plantation",	
	
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

export default LocationCollection;
