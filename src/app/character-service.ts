import {Body, genBody} from './body';
import {AttributeType, AttributeObject, DerivativeType,ResourceType, ResourceObject} from './common-types';
import ItemMaskCollection, {ItemMaskID, Bag, InventoryStack, BagID, ItemSortID, ItemSortCollection} from './inventory';
import ItemCollection from './items';
import {generateJati} from './reincarnation';
import ActivityCollection, {ActivityID, ActivityIndex} from './activities';
import {StateObject} from './state';
import {ServiceObject} from './global-service-provider';
import {pipeAge, applyObject} from './helpers';

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

	getResources(): ResourceObject{

		return this.st.body.resources;

	}
	
	giveMoney(amount: number): void{

		this.st.body.money += amount;

	}

	getMoney() : number{

		return this.st.body.money;

	}
	
	getBag(id : BagID): Bag{
		switch (id){
			case BagID.Inventory:
				return this.st.body.inventory;
			case BagID.Equipment:
				return this.st.body.equipment;
			default:
				return {
					size: 0,
					defaultMask: ItemMaskID.True,
					mask: [],
					contents: [],
				};

		}

	}

	getInventoryContents() : InventoryStack[]{

		return this.st.body.inventory.contents;

	}

	removeItemConsumed(id: BagID, index: number, malus: number): void{
		
		let bag = this.getBag(id);

		bag.contents[index].amount -= malus;

		if (bag.contents[index].amount <= 0){
			bag.contents[index] = undefined;

		}

	}

	swapInventoryStacks(id1 : BagID, index1 : number, id2: BagID, index2 : number): void{
		
		console.log("bag1 + index1:" + id1 + index1);
		console.log("bag2 + index2:" + id2 + index2);

		let bag1 = this.getBag(id1);
		let itemStack1 = bag1.contents[index1];
		let mask1 = bag1.mask[index1];
		console.log("bag1 mask");
		console.log(bag1.mask);
		console.log(bag1);
		if (mask1 === undefined) {
			mask1 = bag1.defaultMask;
			
			if (mask1 === undefined){
				
				console.log("ERROR: Mask1 Fallthrough during swap");
				mask1 = ItemMaskID.True;

			}

		}

		let bag2 = this.getBag(id2);
		let itemStack2 = bag2.contents[index2];
		let mask2 = bag2.mask[index2];
		console.log("bag2 mask");
		console.log(bag2.mask);
		console.log(bag2);
		if (!mask2) {
			mask2 = bag2.defaultMask;
			
			if (mask2 === undefined){
				console.log("ERROR: Mask2 Fallthrough during swap");	
				mask2 = ItemMaskID.True;

			}

		}
		
		let mask1Result = ItemMaskCollection[mask1](this.sv, bag2, itemStack2);
		let mask2Result = ItemMaskCollection[mask2](this.sv, bag2, itemStack1);

		if(mask1Result === true 
			&& mask2Result === true){
				
				let tmp = JSON.parse(JSON.stringify(bag1.contents[index1]));
				bag1.contents[index1] = bag2.contents[index2];
				bag2.contents[index2] = tmp;

		} else console.log("Swap doesn't fit!");


	}

	getDailyHealthDrain():number{
		
		let currHealth = this.st.body.resources[ResourceType.Health].value; 
		
		return __DAILY_HEALTH_DRAIN_BASE + currHealth * __DAILY_HEALTH_DRAIN_PERCENT; 



	}

	drainHealthNatural(amount: number): void{

		let currHealthObject = this.st.body.resources[ResourceType.Health];
		let malus = amount;

		if (currHealthObject.value <= malus) {
			let diff = malus - currHealthObject.value
			
			currHealthObject.value = 0;
			this.drainLifeNatural(diff);
		}

		currHealthObject.value -= malus;

	}

	drainHealthDaily(): void{

		let amount = this.getDailyHealthDrain();

		this.drainHealthNatural(amount);

	}

	getLifeMult():number{
		
		let currHealthObject = this.st.body.resources[ResourceType.Health];

		return (12 / (12 +currHealthObject.value));

	}
	
	drainLifeNatural(amount: number): void{
	
		let currLifeObject = this.st.body.resources[ResourceType.Life];

		currLifeObject.value -= amount * this.getLifeMult();

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
	
	

	selectInvItemToEat(): number{

		let inv = this.getBag(BagID.Inventory);
		let bestIndex = 0;
		let bestValue = 0;

		for (let i = 0; i < inv.size; ++i){
			
			if (inv.contents[i] === undefined || inv.contents[i].ID ===undefined) continue;
			let item = ItemCollection[inv.contents[i].ID];
			if (item.consumable !== true) continue;

			let value = ItemSortCollection[ItemSortID.HighestValue](inv.contents[i]);
			if (value > bestValue){
			
				bestIndex = i;
				bestValue = value;

			}
		}
		console.log(bestIndex);	
		return bestIndex;

	}

	consumeItem(id: BagID, index: number): void{
		
		let stack = this.getBag(id).contents[index];
		if (stack === undefined) {
			console.log("Invalid stack selected for consumption");
			return;
		}

		let itemID = stack.ID;
		let item = ItemCollection[itemID];

		if (item.consumable === true){
			
			

			if (item.consumeBonus !== undefined){
			
				applyObject(item.consumeBonus, this.st.body);		

			}
			if (item.consumeConsequence !== undefined){

				item.consumeConsequence(this.sv);

			}

		}

	}

	dailyEat(): void{
		
		let bestIndex = this.selectInvItemToEat();

		this.consumeItem(BagID.Inventory, bestIndex);	

	}


	attackFunction(inBody: number, inCunning: number):number{
		
		return 2;

	}

	defenseFunction(inBody: number, inCunning: number): number{

		return 2;

	}
	
	calcDerivatives() : void{

		let attr = this.st.body.attributes;
		let deriv = this.st.body.derivatives;
		
		console.log(deriv);

		let tempAttack = this.attackFunction(attr.body.value, attr.cunning.value);
		let tempDefense = this.attackFunction(attr.body.value, attr.cunning.value);
		
		deriv[DerivativeType.Attack].value = tempAttack + deriv[DerivativeType.Attack].base;
		deriv[DerivativeType.Defense].value = tempDefense + deriv[DerivativeType.Defense].base;

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
	

	newBody(){
		
		//TODO implement Karma
		this.st.body = genBody(generateJati(0));
		this.calcDerivatives();
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
