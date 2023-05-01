import React from 'react';
import {Serv} from './global-service-provider';
import {LogMessage} from './game-state/log-service';
import ErrorPanel from './error-panel';

export default function LogPanel(){
	
	const [log, setLog] = React.useState<LogMessage[]>([]);
	const [subbed, setSubbed] = React.useState(false);
	const scrollRef = React.useRef<HTMLDivElement>(null);

	let sv = Serv();

	if (sv === undefined) return <ErrorPanel/>; 
	
	function handleLogPush(msg: LogMessage){
		//console.log(sv.Log.getLog());		
		setLog([...sv.Log.getLog()]);

		if (scrollRef.current !== null) {
			
			if (scrollRef.current.scrollHeight - scrollRef.current.scrollTop < 200){
				console.log("AAAA");
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			} else {
				//scrollRef.current.scrollTop = scroll;
			}

		}

	}


	if (!subbed){
		sv.Log.subscribeToLogPush(handleLogPush.bind(this));
		setSubbed(true);
	}
	
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
				<div className="logDisplayContainer">
					<div ref={scrollRef} className="logDisplayWrapper">
						
						<div className="logDisplay ">
							{logHTML}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	)

}
