import {ActivityID} from './activities';

export enum LocationID {

	CommonGrounds,
	Plantation,
	
	
}



export interface Location {
	
	name : string;
	activities : ActivityID[];

}

interface LocationSuite {

	[key: number]: Location;

}

let LocationCollection : LocationSuite = {};


LocationCollection[LocationID.CommonGrounds] = {
	
	name: "Common Grounds",
	activities: [
		
		ActivityID.Oddjobs,
		ActivityID.Begging,
		ActivityID.Poetry,

	],

};

LocationCollection[LocationID.Plantation] = {
	
	name: "Plantation",
	activities: [

		ActivityID.FieldLabor,

	],

};

export default LocationCollection;
