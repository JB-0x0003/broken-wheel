import React from 'react';
import LogService from './game-state/log-service';
import CharacterService from './game-state/character-service';
import WorldService from './game-state/world-service';
import MainLoopService from './game-state/main-loop-service';

const ServiceContext = React.createContext<ServiceObject>(undefined!);

interface fuckyou{

	children?: React.ReactNode;
	serv: ServiceObject;

}

export interface ServiceObject{
	
	Log : LogService;
	Character: CharacterService;
	World : WorldService;
	MainLoop : MainLoopService;

}

export function Serv() : ServiceObject{

	return React.useContext(ServiceContext);
}

export default function GlobalServiceProvider(props: fuckyou){
	


	//I have no idea why this causes the below code to not break
	//props.serv SHOULD be kept in state already
	const [serv,] = React.useState(props.serv);	


	return (
		<ServiceContext.Provider value={props.serv}>
			{props.children}
		</ServiceContext.Provider>
	)


}
