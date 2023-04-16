import React from 'react';
import ErrorPanel from './error-panel';
import SecretElement from './secret-element';
import {SecretID} from './game-state/secrets';
import {Serv} from './global-service-provider';

export default function PersonalPanel(){
	
	let sv = Serv();
	if (sv === undefined) return <ErrorPanel/>;

	return (
		<div className="panel spanning">
			<div className="panelHeader">
				Personal Information
			</div>
			<div className="secretFlexbox">
				<SecretElement ID={SecretID.Weapons}/>
				<SecretElement ID={SecretID.Swords}/>
			</div>
		</div>

	);
}
