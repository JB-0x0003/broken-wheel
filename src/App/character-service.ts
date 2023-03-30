import {Body,AttributeType, AttributeObject, StatusObject, InventoryStack, genBody, calcDerivatives, BagID} from './body';
import {GenerateJati} from './reincarnation';
import ActivityCollection, {ActivityID, ActivityIndex} from './activities';
import {StateObject} from './state-service';
import {ServiceObject} from './global-service-provider';
import {pipeAge} from './helpers';

export const __DAILY_LIFE_DRAIN = 0.076;
export const __DAILY_HEALTH_DRAIN_BASE = 0.5;
export const __DAILY_HEALTH_DRAIN_PERCENT = 0.0454545;

export default class CharacterService{
	
	st : StateObject;
	sv : ServiceObject = undefined!;

	getBody() : Body{

		return this.st.body;

	}

	getAttributes(): AttributeObject{


		return this.st.body.attributes;

	}

	trainAttribute(targetAttribute: AttributeType, gain: number) : void{

		gain *= this.st.body.attributes[targetAttribute].aptitude;
		this.st.body.attributes[targetAttribute].value += gain;
		

	}

	getStatuses(): StatusObject{

		return this.st.body.statuses;

	}
	
	giveMoney(amount: number): void{

		this.st.body.money += amount;

	}

	getMoney() : number{

		return this.st.body.money;

	}
	
	getBag(id : BagID): InventoryStack[]{
		switch (id){
			case 0:
				return this.st.body.inventory;
			case 1:
				return this.st.body.equipment;
			default:
				return [];

		}

	}

	getInventory() : InventoryStack[]{

		return this.st.body.inventory;

	}

	swapInventoryStacks(id1 : BagID, index1 : number, id2: BagID, index2 : number): void{
		
		console.log("bag1 + index1:" + id1 + index1);
		console.log("bag2 + index2:" + id2 + index2);
		let bag1 = this.getBag(id1);
		let bag2 = this.getBag(id2);

		let tmp = JSON.parse(JSON.stringify(bag1[index1]));
		bag1[index1] = bag2[index2]
		bag2[index2] = tmp;

	}

	getDailyHealthDrain():number{
		
		let currHealth = this.st.body.statuses.Health.value; 
		
		return __DAILY_HEALTH_DRAIN_BASE + currHealth * __DAILY_HEALTH_DRAIN_PERCENT; 



	}

	drainHealthNatural(amount: number): void{

		let currHealth = this.st.body.statuses.Health.value;
		let malus = amount;

		if (currHealth <= malus) {
			let diff = malus - currHealth
			
			this.st.body.statuses.Health.value = 0;
			this.drainLifeNatural(diff);
		}

		this.st.body.statuses.Health.value -= malus;

	}

	drainHealthDaily(): void{

		let amount = this.getDailyHealthDrain();

		this.drainHealthNatural(amount);

	}

	getLifeMult():number{

		return (12 / (12 + this.st.body.statuses.Health.value));

	}
	
	drainLifeNatural(amount: number): void{

		this.st.body.statuses.Lifespan.value -= amount * this.getLifeMult();

	}
	

	causeAge(amount: number): void{
			//0 health = 19.6 years of life	
			//34 health = ~30 years of life
			//100 health = ~50 years
			for (let i = 0; i< amount; ++i){
				this.drainLifeNatural(__DAILY_LIFE_DRAIN);
				this.drainHealthDaily();
			}

			this.st.body.age += amount;
							

	}	

	
	setName(inName : string) : void{

		this.st.name = inName; 

	}

	getName() : string{

		return this.st.name;

	}
	
	
	

	getAgeString() : string{
		
		return pipeAge(this.st.body.age);
		
	}
	
	calcPlayerDerivatives() : void{

		calcDerivatives(this.st.body);		
		

	}

	newBody(){
		
		//TODO implement Karma
		this.st.body = genBody(GenerateJati(0));
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
	
	//This is called by MainLoopService
	injectDep(inSV : ServiceObject) : void{
		
		this.sv = inSV;

		//Dependency related startup
		this.sv.MainLoop.subscribeToLongTick(this.calcActivityReqs.bind(this));

	}

	constructor(inState : StateObject){

		this.st = inState;

	}
}
