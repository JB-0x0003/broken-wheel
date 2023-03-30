import React from 'react';
import {Serv} from './global-service-provider';
import {OptionObject} from './state-service';


export default function OptionsForm(){

	let [,dummyState] = React.useState({});

	let sv = Serv();
	if (sv === undefined) return;

	let autosaveMS = sv.MainLoop.getAutosaveMS();	

	function setAutosaveMSFromS(inStr : string) : void{

		let inNum = (inStr as unknown) as number * 1000;
		
		sv.MainLoop.setAutosaveMS(inNum);
		dummyState({});

	}

	return(
		<div className="optionsBody">	
			<label className="eventFormLabel">Autosave Time: 
				<input 
					type="number" 
					name="autosaveMS" 
					className="eventInput" 
					value ={autosaveMS / 1000}
					onChange={(event)=>{setAutosaveMSFromS(event.target.value)}}		
				/>
			</label>
			<div 
				className="textButt"
				onClick={sv.MainLoop.save}
			>
				Save Manually
			</div>
		</div>

	);


}
