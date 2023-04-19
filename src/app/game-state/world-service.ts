import {StateObject} from './state';
import CharacterService from './character-service';
import ActivityCollection, {Activity, ActivityID, ActivityIndex} from './activities';
import {Location} from './locations';
import {ServiceObject} from '../global-service-provider';

export interface Zone {
	
	name: string;
	stinger: string;
	prosperity: number;
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
	
	getCurrentGerund() : string{
		
		let index = this.getCurrentActivityID();
		let rank = 0;

		return ActivityCollection[index].gerund[rank];

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

	discoverActivity(inAct : ActivityID) : void{

		this.st.activityRecord[inAct].discovered = true;
		this.st.activityRecord[inAct].meetsReqs = true;
		this.sv.Log.pushLog("You've discovered a new activity!");

	}

	unlockActivity(inAct : ActivityID) : void{
		if (this.st.activityRecord[inAct].discovered === false){
			this.discoverActivity(inAct);

		}else{
			this.st.activityRecord[inAct].meetsReqs = true;
		}
	}

	lockActivity(inAct : ActivityID) : void{
		
		this.st.activityRecord[inAct].meetsReqs = false;

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
					
					this.unlockActivity(currAct);
				}else {

					this.lockActivity(currAct);
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

	getCurrentLocationIndex():number{

		return this.st.currentLocation;
	}
	
	getCurrentLocation(): Location{

		let locIndex = this.getCurrentLocationIndex();
		let Zone = this.getCurrentZone();
		
		return Zone.locations[locIndex];

	}

	reputationNobilityBonus(inNob: number) : number{

		return inNob * 0.1;	

	}

	getCurrentZone() : Zone{

		let ZoneIndex = this.st.currentZone;

		return this.st.ZoneCollection[ZoneIndex]

	}
	
	getCurrentZoneProsperity() : number{
	
		return this.getCurrentZone().prosperity;
	
	}
	
	increaseProsperity(bonus : number) : void{
		this.getCurrentZone().prosperity[this.st.currentZone] += bonus;

	}
	
	decreaseProsperity(malus : number) : void{
		
		this.getCurrentZone().prosperity -= malus;

	}
	
	getCurrentZoneReputation() : number{
		
		return this.st.body.reputation[this.st.currentZone];
	}
	
	getCurrentZoneEffectiveReputation() : number{

		let baseRep = this.getCurrentZoneReputation();
		let nobBonus = this.reputationNobilityBonus(this.st.body.attributes.nobility.value);
		return baseRep + nobBonus;

	}

	increaseReputation(bonus : number) : void{

		this.st.body.reputation[this.st.currentZone] += bonus;

	}

	decreaseReputation(malus: number) : void{

		this.st.body.reputation[this.st.currentZone] -= malus;

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
