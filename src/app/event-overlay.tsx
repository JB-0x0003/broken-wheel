import React,{useState} from 'react';
import {EventType} from './game-state/events';
import {Serv} from './global-service-provider'
import OptionsForm from './options-form';

export default function EventOverlay(){

	let sv = Serv();
	let [overlayVisible, setOverlayVisible] = useState(sv.Character.st.inEvent);
	let [formValues, setFormValues] = useState({});	

	if (sv === undefined) return;


	let currentEvent = sv.MainLoop.getCurrentEvent();
	let dismissable;
	let eType;
	
	// more complicated variable declarations

	if (currentEvent.dismissable === undefined || currentEvent.dismissable === true){
		
		dismissable = true;

	} else dismissable = false;

	if (currentEvent.eType !== undefined){

		eType = currentEvent.eType;

	} else eType = EventType.Default; 

	//Push component state to global state

	sv.MainLoop.setEventState(overlayVisible);

	// force component refreshes

	function refresh(){
		
		setFormValues({});
		setOverlayVisible(true);

	}


	function close() : void{
		
		setOverlayVisible(false);

	}

	function attemptCancel() : void{

		if (dismissable === true) close();

	}

	function eventChoiceWrapper(callback : Function){

		close();

		if (currentEvent.form === undefined) callback(sv);
		else {

			let length = Object.keys(currentEvent.form).length;
			if (length > 0){
				callback(sv,formValues);
			} else
				callback(sv);

		}
		
		

	}
	
	function updateFormValues(key: string, value) : void{
		
		let temp = formValues;
		temp[key] = value;

		setFormValues(temp);
		//console.log("New Form Values = " + JSON.stringify(formValues));


	}

	function clearFormValues() : void{

		setFormValues({});	

	}
	
	function formChangeEventHandler(key: string,event : React.ChangeEvent<HTMLInputElement>) : void{

		let value = event.target.value;		
		updateFormValues(key, value);

	}

	//Default handling for body text

	function defaultBodyHTML() : React.ReactNode{

		return ( 
			<div className="eventBodyText">
				{currentEvent.bodyText(sv)}
			</div>
					

		);

	}

	//Actual work begins
	//subscribe to main loop
	sv.MainLoop.subscribeToEvent(refresh);
	
	//Create body of event

	let bodyHTML : React.ReactNode[] = [];

	switch (eType) {

		case EventType.Beherit:
			
			bodyHTML.push(defaultBodyHTML());
			bodyHTML.push(<span className="signInput">X</span>)
			bodyHTML.push(
				<input className="eventInput mat-sig signInput" onChange={(event)=>{formChangeEventHandler("name",event);}}></input>
			);
			break;
		case EventType.Options:
			bodyHTML.push(<OptionsForm/>);
			console.log(bodyHTML);
			break;
		default:
			
			bodyHTML.push(defaultBodyHTML());

		break;


	}
		
	//Create HTML for defining choices

	let choiceHTML : React.ReactNode[] = [];
	
	for (let i=0; i< currentEvent.choices.length; ++i){

		choiceHTML.push(

		<div className="eventChoice" onClick={()=>{
			
			eventChoiceWrapper(currentEvent.choices[i].consequence);
		}}>
				{currentEvent.choices[i].text()}
		</div>

		);

	}

	

	return (

	<div className="overlayContainer" style = {{visibility: (overlayVisible?"visible":"hidden" ) }} >
		<div className="overlayBackdrop" onClick={attemptCancel}></div>
		<div className="panel eventPanel">
			<div style={{display:"flex", flexDirection: "column", height:"100%"}}>
				<div className="panelHeader">
					{currentEvent.title()}
				</div>
				<div className="eventBody">
					<div className="scrollVertical">
						{bodyHTML}
					</div>
				</div>
				{choiceHTML}
			</div>	
		</div>
	</div>


	);

}
