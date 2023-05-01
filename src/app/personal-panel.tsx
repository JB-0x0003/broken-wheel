import React from 'react';
import ErrorPanel from './error-panel';
import SecretElement from './secret-element';
import {SecretID} from './game-state/secrets';
import {Serv} from './global-service-provider';

export default function PersonalPanel(){
	
	let sv = Serv();
	if (sv === undefined) return <ErrorPanel/>;
	
	let secretHTML = [];

	for (let key in SecretID){
	
		secretHTML.push(<SecretElement key={"secret-" + key} ID={SecretID[key]}/>);
	}

	return (
		<div className="panel spanning">
			<div className="panelHeader">
				Secrets
			</div>
			<div className="secretFlexbox">
				{secretHTML}
			</div>
		</div>

	);
}
