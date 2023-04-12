import {StateObject} from './state';
import CharacterService from './character-service';
import ActivityCollection, {Activity, ActivityID, ActivityIndex} from './activities';
import {Location} from './locations';
import {ServiceObject} from '../global-service-provider';

export interface Zone {
	
	name: string;
	stinger: string;
	locations: Location[];

}



export default class WorldService{
	
	st: StateObject;
	sv: ServiceObject = undefined!;
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
	
	
	getActivityIndex(index : ActivityID):ActivityIndex{

		return (this.st.activityRecord[index]);

	}
	
	getActivityReqState(id: ActivityID):boolean{

		return this.st.activityRecord[id].meetsReqs;	

	}

	getActivityDiscoverState(id: ActivityID) : boolean{
		
		return this.st.activityRecord[id].discovered;

	}

	setCurrentLocation(inLoc : number) : void{
		
		this.st.currentLocation = inLoc;

	}	
	//This also controls activity discovery
	//Only checks activities in current Zone
	calcActivityReqs(): void{
		
		let currZone = this.st.ZoneCollection[this.st.currentZone];
		let currLoc;
		let currAct;

		for (let i = 0; i < currZone.locations.length; ++i){
			
			currLoc = currZone.locations[i];

			for (let j = 0; j < currLoc.activities.length; ++j){

				currAct = currLoc.activities[j];
				
				if (ActivityCollection[currAct].requirements(this.sv) === true){
					
					this.st.activityRecord[currAct].discovered = true;
					this.st.activityRecord[currAct].meetsReqs = true;

				}else {

					this.st.activityRecord[currAct].meetsReqs = false;

				}
				

			}
		}
	

	}

	//only changes the 'meetsReqs' property. Doesn't undiscover activities
	resetActivityReqs():void{

		let rec = this.st.activityRecord;
		let recLen = Object.keys(rec).length;

		for (let i = 0; i < recLen; ++i){
			
			rec[i].meetsReqs = false;

		}
		
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

	injectDep(inSV: ServiceObject): void{
		
		this.sv = inSV;

		//dependency related start up
		this.sv.MainLoop.subscribeToLongTick(this.calcActivityReqs.bind(this));
	}

	constructor(inSt : StateObject, inChar : CharacterService){
		
		this.st = inSt;
		this.character = inChar;

	}




}
