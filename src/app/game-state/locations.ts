import {ActivityID} from './activities';
import {ItemID} from './items';

export enum LocationID {

	CommonGrounds = "commongrounds",
	Plantation = "plantation",
	ForestOutskirts = "forestoutskirts",
	TownAcademy = "townacademy",
}

export type SupplyObject = {
	
	[key in ItemID]?: boolean;

}



export interface Location {
	
	name : string;
	ID: LocationID;

}

export interface LocationSchema {
	
	name: string;
	activities: ActivityID[];
	supply : SupplyObject;

}

interface LocationSuite {

	[key: string]: LocationSchema;

}

let LocationCollection : LocationSuite = {};


LocationCollection[LocationID.CommonGrounds] = {
	
	name: "Common Grounds",
	activities: [
		
		ActivityID.Oddjobs,
		ActivityID.Begging,
		ActivityID.Poetry,
		ActivityID.Theft,

	],
	supply: {
		[ItemID.HouseGrain]: true,
	},
};

LocationCollection[LocationID.Plantation] = {
	
	name: "Plantation",
	activities: [

		ActivityID.FieldLabor,

	],
	supply: {
		[ItemID.Soybeans]: true,
		[ItemID.Barley]: true,
		[ItemID.Wheat]: true,
		[ItemID.Millet]: true,
		[ItemID.Rice]: true,
		
	},

};

LocationCollection[LocationID.ForestOutskirts] = {
	
	name: "Forest Outskirts",
	activities: [
		ActivityID.Hunting,
	],
	supply: {


	},

}

LocationCollection[LocationID.TownAcademy] = {
	
	name: "Academy",
	activities: [
		ActivityID.Tutoring,
	],
	supply: {
	
	},
}

export default LocationCollection;

export function genLocation(inID: LocationID) : Location {

	return {
		name: LocationCollection[inID].name,
		ID: inID,
	}

}
