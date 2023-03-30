

export default class LogService{

	textLog : string[] = [];
	currentEvent : Event

	log(text: string){
		
		this.textLog.push(text);
	
	}

}
