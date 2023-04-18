import {Subject} from 'rxjs';	
import {Body, genBody, refreshBody} from './body';
import {AttributeType, AttributeObject, DerivativeType, DerivativeObject,ResourceType, ResourceObject} from '../common-types';
import ItemMaskCollection, {ItemMaskID, Bag,BagContents, BagID, ItemSortID, ItemSortCollection} from './inventory';
import ItemCollection, {Item, ItemID} from './items';
import {generateJati} from './reincarnation';
import SecretCollection, {SecretID, secretXPForRank} from './secrets';
import {StateObject} from './state';
import {ServiceObject} from '../global-service-provider';
import {pipeAge, sumObject, overwriteObject, weightedAverage} from '../helpers';
import {LogType} from './log-service';


export const __DAILY_LIFE_DRAIN = 0.076;
export const __DAILY_HEALTH_DRAIN_BASE = 0.5;
export const __DAILY_HEALTH_DRAIN_PERCENT = 0.0454545;

export enum FoodSourceStatus{
	Inventory = "inventory",
	Store = "store",
	Starvation = "starvation",
	
}

export default class CharacterService{
	
	st : StateObject;
	sv : ServiceObject = undefined!;
	secretSubject = new Subject();
	starveSubject = new Subject();

	foodSource : FoodSourceStatus = FoodSourceStatus.Inventory;


	getBody() : Body{

		return this.st.body;

	}

	getAttributes(): AttributeObject{


		return this.st.body.attributes;

	}

	trainAttribute(targetAttribute: AttributeType, gain: number) : void{

		gain *= this.st.body.attributes[targetAttribute].aptitude;
		this.st.body.attributes[targetAttribute].base += gain;
		this.st.body.attributes[targetAttribute].value += gain;
		this.sumPlayerDerivatives();

	}
	
	secretRankUp(targetSecret: SecretID): void{

		this.st.secrets[targetSecret].rank++;
		this.st.secrets[targetSecret].XP = 0;
		
		let rank = this.st.secrets[targetSecret].rank;
		let secret = SecretCollection[targetSecret];
		
		//apply specific bonuses
		if (secret.specificOverwriteBonus !== undefined 
					&& secret.specificOverwriteBonus[rank] !== undefined){
			overwriteObject(secret.specificOverwriteBonus[rank], this.st.body)	
		}
		if (secret.specificBonus !== undefined 
					&& secret.specificBonus[rank] !== undefined){
			sumObject(secret.specificBonus[rank], this.st.body)	
		}
		//apply constant bonuses
		sumObject(secret.constantBonus, this.st.body);

	}

	trainSecret(targetSecret: SecretID, gain: number) : void{
		
		let sRecord = this.st.secrets[targetSecret];
		let maxXP = secretXPForRank(targetSecret, sRecord.rank + 1);

		let overflow = sRecord.XP + gain - maxXP;	
		if (overflow >= 0){
			this.secretRankUp(targetSecret);
			this.trainSecret(targetSecret, overflow);
			return;
		} else {
			sRecord.XP += gain;
			this.secretChange();
		}
		

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

	getInventoryContents() : BagContents{

		return this.st.body.inventory.contents;

	}
	//returns index that item is added to or -1 if bag is full
	addItemToBag(bagID: BagID, itemID: ItemID, amount: number): number{


		let itemMax = ItemCollection[itemID].maxStack;
		let bag = this.getBag(bagID);
		let firstEmpty = -1;
		
		for (let i = 0; i < bag.size; i++){
			
			if (firstEmpty === -1 && bag.contents[i] === undefined){
				firstEmpty = i;
			}

			if (bag.contents[i] !== undefined && bag.contents[i].ID === itemID){
				
				let overflow = bag.contents[i].amount + amount - itemMax;
				if (overflow > 0){
					bag.contents[i].amount = itemMax;
					amount = overflow;

				} else {
					bag.contents[i].amount += amount;
					return i;
				}

			}
		}

		//if amount is still >0, create and add new stack to first non-empty slot
		if (amount > 0) {

			if (firstEmpty === -1){
				console.log("ERROR: Bag " + bagID + " full!");
				return -1;
			}

				bag.contents[firstEmpty] = {
					ID: itemID,
					amount: amount,
				};
				return firstEmpty;

		}

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
		
		let mask1Result = ItemMaskCollection[mask1](this.sv, bag1, itemStack2);
		let mask2Result = ItemMaskCollection[mask2](this.sv, bag2, itemStack1);

		if(mask1Result === true 
			&& mask2Result === true){
							
				let tmp = JSON.parse(JSON.stringify(bag1.contents[index1]));
				bag1.contents[index1] = bag2.contents[index2];
				bag2.contents[index2] = tmp;
				//If changed equipment, recalculate stats
				//TODO calculate only changed stats
				//Needs subtraction function for objects	
				if (id1 === BagID.Equipment || id2 === BagID.Equipment){
					this.calcPlayerStats();
				}

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
		let bestIndex = -1;
		let bestValue = -1000000;

		for (let i = 0; i < inv.size; ++i){
			
			if (inv.contents[i] === undefined || inv.contents[i].ID ===undefined) continue;
			let item = ItemCollection[inv.contents[i].ID];
			if (item.consumable !== true) continue;
			
			//TODO add option to use different sorting methods
			let value = ItemSortCollection[ItemSortID.HighestValue](inv, i);
			if (value >= bestValue){
			
				bestIndex = i;
				bestValue = value;

			}
		}
		console.log(bestIndex);	
		return bestIndex;

	}
	
	//returns -1 if item was not consumed
	consumeItem(id: BagID, index: number): number{
		
		let stack = this.getBag(id).contents[index];
		if (stack === undefined) {
			console.log("Invalid stack selected for consumption");
			return;
		}

		let itemID = stack.ID;
		let item = ItemCollection[itemID];

		if (item.consumable === true){
			
			this.removeItemConsumed(id, index, 1);

			if (item.consumeBonus !== undefined){
			
				sumObject(item.consumeBonus, this.st.body);		

			}
			if (item.consumeConsequence !== undefined){

				item.consumeConsequence(this.sv);

			}


		}

	}
	
	setFoodSource(value: FoodSourceStatus): void{
		this.foodSource = value;
	}

	getFoodSource(): FoodSourceStatus{
		return this.foodSource;
	}

	onStarve(): void{
		if (this.foodSource !== FoodSourceStatus.Starvation){
		
			this.setFoodSource(FoodSourceStatus.Starvation);
			this.sv.MainLoop.pause();
			this.sv.Log.pushLog("You are starving", LogType.Danger);
		}
		this.starveSubject.next(0);
	}

	subscribeToStarve(callback: Function): void{
			
		this.starveSubject.subscribe((v)=>{callback(v)});	

	}
	//returns index of item if item is bought
	//otherwise returns -1
	autoBuyFood(): number{
		
		let price = ItemCollection[ItemID.Rice].value;
		
		if (this.st.body.money >= price){
			let index = this.addItemToBag(BagID.Inventory, ItemID.Rice, 1);
			if (index !== -1){
				this.st.body.money -= price;
			}	
			return index;
			
		} else return -1;
	}

	dailyEat(): void{
		
		console.log(this.foodSource);
		let bestIndex = this.selectInvItemToEat();
		
		if (bestIndex === -1) {
			let newIndex = this.autoBuyFood();
			if (newIndex !== -1){
				newIndex = this.consumeItem(BagID.Inventory, newIndex);	
			}
			if (newIndex === -1){
				this.onStarve();
			} else {
				this.setFoodSource(FoodSourceStatus.Store);
			}
		}
		else {
			this.setFoodSource(FoodSourceStatus.Inventory);
			this.consumeItem(BagID.Inventory, bestIndex);	
		}
	}


	attackFormula(inBody: number, inCunning: number):number{
		
		let power = weightedAverage([inBody, inCunning], [1, 1]);

		return power / 20 + 1;

	}

	nobleAttackFormula(inNob: number) : number{
		

		return this.attackFormula(inNob, inNob);
	}

	defenseFormula(inBody: number, inCunning: number): number{
		
		let power = weightedAverage([inBody, inCunning], [2, 1]);
		
		return power / 20 + 1;

	}
	
	//appies all bonuses
	//Note that this doesn't push them into affecting the actual value
	//TODO Apply to non-constant bonuses
	calcSecretBonuses(): void{
	
		let sRecord = this.st.secrets;
		console.log(sRecord);
		for (let id in sRecord){
			let currentSecret = SecretCollection[id];
			let rank = sRecord[id].rank;

			for (let i = 0; i < rank; ++i){
				//console.log("Applying secret bonus");
				//console.log(currentSecret.constantBonus);
				sumObject(currentSecret.constantBonus, this.st.body);
				if (currentSecret.specificOverwriteBonus !== undefined
							&& currentSecret.specificOverwriteBonus[i] !== undefined){
					overwriteObject(currentSecret.specificOverwriteBonus[i], this.st.body);
				}
				if (currentSecret.specificBonus !== undefined
							&& currentSecret.specificBonus[i] !== undefined){
					sumObject(currentSecret.specificBonus[i], this.st.body);
				}
				//console.log("After bonus");
				//console.log(this.st.body);
			}
		}
	}

	calcItemBonuses(): void{
		
		let equipment = this.getBag(BagID.Equipment);
		let contents = equipment.contents;

		for (let key in contents){
			console.log(key);
			console.log(contents[key]);
			if (contents[key] === undefined) continue;
			let item : Item = ItemCollection[contents[key].ID];

			if (item.equipBonus !== undefined){
				sumObject(item.equipBonus, this.st.body);
			}
		}
		
	}
	
	sumPlayerAttributes(): void{
		
		let attr : AttributeObject = this.st.body.attributes;

		for (let key in attr) {
			
			attr[key].value = attr[key].base + attr[key].bonus;
			attr[key].value *= attr[key].mult;
			attr[key].aptitude = attr[key].aptitudeBase + attr[key].aptitudeBonus;

		}
	}

	sumPlayerResources(): void{
		
		let res : ResourceObject = this.st.body.resources;
		
		for (let key in res) {

			res[key].maxValue = res[key].maxBase + res[key].maxBonus;
			res[key].maxValue *= res[key].maxMult;
		}
	}

	sumPlayerDerivatives(): void{
		

		let attr : AttributeObject = this.st.body.attributes;
		let deriv : DerivativeObject = this.st.body.derivatives;

		let tempAttack;	
		let firstWeaponSlot = this.getBag(BagID.Equipment).contents[0];
		
		//this is hardcoded because it's a universal axiom
		if (firstWeaponSlot !== undefined 
			&& firstWeaponSlot.ID !== undefined
			&& ItemCollection[firstWeaponSlot.ID].noble === true){
				tempAttack = this.nobleAttackFormula(attr.nobility.value);	

		} else tempAttack = this.attackFormula(attr.body.value, attr.cunning.value);
		let tempDefense = this.defenseFormula(attr.body.value, attr.cunning.value);
		
		deriv[DerivativeType.Attack].attrBonus = tempAttack;
		deriv[DerivativeType.Defense].attrBonus = tempDefense;

		for (let key in deriv) {
			
			deriv[key].value = deriv[key].base + deriv[key].attrBonus + deriv[key].bonus;
			deriv[key].value *= deriv[key].mult;

		}

	}

	calcPlayerStats() : void{

		console.log("Calculating Player Stats");
		//reset all bonuses
		//Does not affect base values
		refreshBody(this.st.body);
		//push in all bonuses from secrets
		//Note that this doesn't add them to the actual values
		this.calcSecretBonuses();
		//push in all bonuses from items
		this.calcItemBonuses();
		
		//Push bonuses into actual values
		//Order matters here, as derivs/resources are downstream
		this.sumPlayerAttributes();
		this.sumPlayerResources();
		this.sumPlayerDerivatives();
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
		this.calcPlayerStats();
	}
	


	

	setCurrentSecret(inSecret: SecretID): void{
		
		this.st.currentSecretID = inSecret;
		this.secretChange();

	}
	
	secretChange(): void{
		
		this.secretSubject.next(this.st.currentSecretID);

	}

	subscribeToSecretChange(callback: Function): void{
		
		this.secretSubject.subscribe((v)=>{callback(v)});

	}
	
	//This is called by MainLoopService
	injectDep(inSV : ServiceObject) : void{
		
		this.sv = inSV;
		this.calcPlayerStats();
		//Dependency related startup
		
		this.sv.MainLoop.subscribeToPulse(this.calcPlayerStats.bind(this));

	}

	constructor(inState : StateObject){

		this.st = inState;

	}
}
