import React from 'react';
import {Serv} from './global-service-provider';
import ErrorPanel from './error-panel';

export default function LogPanel(){
	
	let [log, setLog] = React.useState<string[]>([]);

	let sv = Serv();

	if (sv === undefined) return <ErrorPanel/>; 

	return (
		<div className = 'panel'>
			<div className = 'panelHeader'>
				Logging
			</div>
		</div>

	)

}
