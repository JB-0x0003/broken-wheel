import React from 'react';
import ErrorPanel from './error-panel';
import {Serv} from './global-service-provider';

export default function PersonalPanel(){
	
	let sv = Serv();
	if (true) return <ErrorPanel/>;

	return (
		<div className="panel">
		</div>

	);
}
