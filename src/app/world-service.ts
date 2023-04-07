import {StateObject} from './state-service';
import CharacterService from './character-service';
import ActivityCollection, {Activity, ActivityID} from './activities';
import {Location} from './locations';

export interface Zone {
	
	name: string;
	stinger: string;
	locations: Location[];

}



export default class WorldService{
	
	st: StateObject;
	character: CharacterService;

	reqStartAct(inLoc : number, inAct : ActivityID) : void{
		
		//TODO doesn't check validity
		let rec = this.st.activityRecord[inAct];

		if (rec.discovered === true && rec.meetsReqs === true){
			
			this.setCurrentLocation(inLoc);
			this.setCurrentActivity(inAct);

		}

	}

	setCurrentActivity(inAct : ActivityID) : void{

		this.st.currentActivityID = inAct;

	}

	getCurrentActivityID(): ActivityID{

		return this.st.currentActivityID;

	}
	
	getCurrentActivity() : Activity {

		let index = this.getCurrentActivityID();

		return ActivityCollection[index];

	}
	

	setCurrentLocation(inLoc : number) : void{
		
		this.st.currentLocation = inLoc;

	}	

	getCurrentLocation(): Location{

		let locIndex = this.st.currentLocation;
		let Zone = this.getCurrentZone();
		
		return Zone.locations[locIndex];

	}

	getCurrentLocationIndex():number{

		return this.st.currentLocation;
	}
	
	getCurrentZone() : Zone{

		let ZoneIndex = this.st.currentZone;

		return this.st.ZoneCollection[ZoneIndex]

	}

	constructor(inSt : StateObject, inChar : CharacterService){
		
		this.st = inSt;
		this.character = inChar;

	}




}
