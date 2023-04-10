import React, {useState} from 'react';
import ErrorPanel from './error-panel';
import {Serv} from "./global-service-provider";
import {__SPEED_MULT_ARRAY} from './game-state/main-loop-service';

export default function TimePanel(){

	const [pauseDesire, setPauseDesire] = useState(false);
	const [desiredSpeedChange, setDesiredSpeedChange] = useState(0);
	const [, dummyState] = useState({});
	let sv = Serv();

	//Abort if state isn't done loading
	if (sv === undefined) return <ErrorPanel/>;

	//TODO this doesn't work on internet explorer
	document.onkeypress = (e)=> {

		//console.log(typeof e);

		if (e.keyCode === 32) setPauseDesire(true);
		else if (e.keyCode === 61 || e.keyCode ===  43) setDesiredSpeedChange(1);
		else if (e.keyCode === 45) setDesiredSpeedChange(-1);
	};
	
	function refresh(){

		dummyState({});

	}

	sv.MainLoop.subscribeToLongTick(refresh);


	if (desiredSpeedChange === 1){

		sv.MainLoop.increaseSpeed();
		setDesiredSpeedChange(0);

	} else if (desiredSpeedChange === -1){

		sv.MainLoop.decreaseSpeed();
		setDesiredSpeedChange(0);

	}

	//!!!!!!
	//EXPORT STATE TO MAIN LOOP
	//!!!!!!
	if (pauseDesire === true){

		sv.MainLoop.togglePause();
		setPauseDesire(false);

	}


	return(
		<div className="panel">
			<div className="panelHeader">
				<span className="mat-icon">calendar</span>
				<span>Day </span>
				<span className="dateDay">{sv.MainLoop.genDayString()}</span>
				<span> of the </span>
				<span className="dateSeason">{sv.MainLoop.genSeasonString()}</span>
				{/*<span>{sv.MainLoop.genYearString()}</span>*/ }
			</div>
			<div>
				<span className="mat-icon">
					<span className="iconButt" onClick={()=>{setDesiredSpeedChange(-1)}}>
						backwards
					</span>
					<span className={"iconButt" + (sv.MainLoop.paused ? " invert" : "")} 
							onClick={()=>{setPauseDesire(true)}}>
						{sv.MainLoop.paused? "play":"paused"}
					</span>
					<span className="iconButt" onClick={()=>{setDesiredSpeedChange(1)}}>
							forwards
					</span>
				</span>
				<span>x{__SPEED_MULT_ARRAY[sv.MainLoop.speedMultIndex]}</span>

			</div>
		</div>
	);

}
