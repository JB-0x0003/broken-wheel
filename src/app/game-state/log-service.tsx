import {Subject} from 'rxjs';

export enum LogType{
	
	Normal = 'normal',
	Warning = 'warning',
	Danger = 'danger',

}

export interface LogMessage{
	
	text: string;
	type: LogType;

}

export default class LogService{

	textLog : LogMessage[] = [];
	logSubject = new Subject<LogMessage>();
	
	subscribeToLogPush(callback: Function){

		this.logSubject.subscribe((v)=>callback(v));
		
	}
	
	pushLog(text: string, type: LogType = LogType.Normal){
		
		console.log("LOG ACTIVATED");
		let msg : LogMessage = {
			text: text,
			type: type,
		}
		this.textLog.push(msg);
		this.logSubject.next(msg);
	}

}
