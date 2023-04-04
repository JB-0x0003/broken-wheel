import {Subject} from 'rxjs';
import {ServiceObject} from './global-service-provider';
import {saveStateToLocal,StateObject} from './state-service';
import LogService from './log-service';
import CharacterService from './character-service';
import WorldService from './world-service';
import EventSuite, {Event} from './events';
import {ActivityID} from './activities';

	const __TICK_MS: number = 50;
	const __LONG_TICK_MS : number = 140;
	const __BASE_ADVANCE_MS : number = 250;
	export const __SPEED_MULT_ARRAY : number[] = [1, 2, 4, 8, 12, 16, 24, 32];	
	export const __SEASON_NOUNS : string[] = ["Rain","Joy", "Silence","Work","Preparation","Stars"];
	export const __STARTING_YEAR : number = 4294967296;

export default class MainLoopService {

	st: StateObject;
	sv: ServiceObject;
	log: LogService;
	character : CharacterService;
	world : WorldService;

	tickSubject = new Subject();
	longTickSubject = new Subject<number>();
	eventSubject = new Subject();
	autosaveTimer;
	prevTime : number = new Date().getTime();
	paused : boolean = true;
	frozen : boolean = false;
	died : boolean = false;
	speedMult : number = 1;
	speedMultIndex : number = 0;

	previousAge : number = 0;



	increaseSpeed() : void {

		if (this.speedMultIndex < __SPEED_MULT_ARRAY.length - 1){

			++this.speedMultIndex;
			this.speedMult = __SPEED_MULT_ARRAY[this.speedMultIndex];
		}

	}

	decreaseSpeed() : void {

		if (this.speedMultIndex > 0){

			--this.speedMultIndex;
			this.speedMult = __SPEED_MULT_ARRAY[this.speedMultIndex];

		}


	}

	togglePause() : void{
		if (this.frozen !== true) this.paused = !this.paused;

	}
	
	setFrozen(inBool : boolean){
		
		this.frozen = inBool;

	}

	die(): void{
		
		this.paused = true;
		this.previousAge = this.st.body.age;
		this.character.newBody();
		this.died = false;
		
		this.world.setCurrentActivity(ActivityID.Oddjobs);

		if (this.st.eFlags.script.named === false) {
			this.pushEvent(['script',1001]);
		}else{

			this.pushEvent(['death',1001]);
		}
	}

	advanceDay() : void{
	

		if (this.st.body.resources.Lifespan.value <= 0){
				
			this.died = true;

		}
		
		if (this.died === false){

			this.character.causeAge(1);
			this.st.dayTotal += 1;
		}

	}

	pushEvent(inEvent :[string,number]){
		
		this.st.inEvent = true;
		this.setFrozen(true);
		this.paused = true;
		this.st.currentEvent = inEvent;
		this.eventHappen();

	}

	setEventState(inBool: boolean){
		
		this.st.inEvent = inBool;
		this.setFrozen(inBool);
	}

	setCurrentEvent(inEvent : [string,number]){

		this.st.currentEvent = inEvent;
		this.eventHappen();

	}
	
	getCurrentEvent(): Event{
		
		let temp = this.st.currentEvent;
		

		let event = EventSuite[temp[0]][temp[1]];
		
		if (event === undefined) event = EventSuite['system'][1000];

		return event;
	}

	act() : void{
		//TODO make rank work
		this.world.getCurrentActivity().consequence[0](this.sv);

	}

	advance() : void{

		this.act();
		this.advanceDay();
		

	}

	tick() : void{
		
		let currentTime = new Date().getTime();
		let timeDiff = currentTime - this.prevTime;
		let owedAdvances = Math.floor(timeDiff / (__BASE_ADVANCE_MS / this.speedMult));
		
		//console.log("Previous time = " + this.prevTime + "\nNew Time = " + currentTime + "\nTime Diff = " + timeDiff + "\nOwed Advances = " + owedAdvances);
		
		//check if died since start of last tick
		if (this.died === true){
			this.die();

		}

		if (this.paused === false ){
			for(let i = 0; i < owedAdvances; ++i){

				this.advance();

			}
		}	

		this.prevTime = this.prevTime + (owedAdvances * (__BASE_ADVANCE_MS / this.speedMult));
		


		this.tickSubject.next(0);

	}



	longTick() : void{

		this.longTickSubject.next(0)

	}

	eventHappen() : void{

		this.eventSubject.next(0);

	}

	subscribeToTick(callback: Function) : void{

		this.tickSubject.subscribe((v) => {callback(v)});

	}

	subscribeToLongTick(callback: Function): void{

		this.longTickSubject.subscribe((v)=> {callback(v)});

	}

	subscribeToEvent(callback: Function): void{

		this.eventSubject.subscribe((v)=> {callback(v)});

	}

	setAutosaveMS(inMS: number): void{

		this.st.options.autosaveMS = inMS;

		clearInterval(this.autosaveTimer);
		this.autosaveTimer = window.setInterval(()=>{

			saveStateToLocal(this.st);
			console.log("Autosaving...");
		},inMS);
		

	}

	getAutosaveMS():number{

		return this.st.options.autosaveMS;

	}

	save(): void{
		console.log("saving!");	
		saveStateToLocal(this.st);

	}
	
	deleteSave(): void{

		console.log("Deleting Save!");
		localStorage.removeItem('state');

	}

	genSeasonString(): string{

		
		let seasonIndex = Math.floor((this.st.dayTotal / 60) % 6);
		let season = "Season of " + __SEASON_NOUNS[seasonIndex];
		
		return season;

	}
	
	genDayString(): string{

		return "" + this.st.dayTotal % 60;
	}

	genYearString(): string{

		let year = __STARTING_YEAR + Math.floor(this.st.dayTotal / 360);
		return year + " A.A.";
	}

	genDateString(): string{
		let season = this.genSeasonString();
		let day = this.genDayString();
		return( "Day " + day + " of the " + season);
	}

	constructor(inSt: StateObject, inLog: LogService, inChar: CharacterService, inWorld: WorldService){
		
		this.st = inSt;
		this.log = inLog;
		this.character = inChar;
		this.world = inWorld;
		
		this.sv = {

			Log : inLog,
			Character: inChar,
			World: inWorld,
			MainLoop : this,

		};

		if (this.st.inEvent === true) this.setFrozen(true);

		this.character.injectDep(this.sv);
		this.setAutosaveMS(this.st.options.autosaveMS);

		window.setInterval(()=> {
			this.tick();
			}, __TICK_MS
		);
		
		window.setInterval(()=> {
			this.longTick();

		}, __LONG_TICK_MS
		);
		
	}




}
