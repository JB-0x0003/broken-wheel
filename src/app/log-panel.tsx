import React from 'react';
import {Serv} from './global-service-provider';
import {LogMessage} from './game-state/log-service';
import ErrorPanel from './error-panel';

export default function LogPanel(){
	
	let [log, setLog] = React.useState<LogMessage[]>([]);

	let sv = Serv();

	if (sv === undefined) return <ErrorPanel/>; 
	
	function handleLogPush(msg: LogMessage){
		console.log(log);		
		let newLog = [...log];
		newLog.push(msg);
		setLog(newLog);

	}

	sv.Log.subscribeToLogPush(handleLogPush.bind(this));
	
	let logHTML = [];
	for (let i = 0; i < log.length; i++){
		logHTML.push(<div key = {i} className="logMessage">{log[i].text}</div>);
	}

	return (
	<div className= 'panelWrapper spanning'>
		<div className = 'logPanel panel spanning'>
			<div className="flexColumn">
				<div className = 'panelHeader'>
					Logging
				</div>
				<div className="logDisplayWrapper">
					<div className="logDisplay ">
						{logHTML}
					</div>
				</div>
			</div>
		</div>
	</div>

	)

}
