import React from 'react';
import {saveStateToLocal,localToText, textToLocal} from './game-state/state';
import {Serv} from './global-service-provider';
import ErrorPanel from './error-panel';

export default function SaveForm() {

	let [saveData, setSaveData] = React.useState("");
	let sv = Serv();
	
	if (sv === undefined) return ErrorPanel();

	

	function exportText(){
		saveStateToLocal(sv.ST);
		setSaveData(localToText());	
	}
	
	function importText(){
		textToLocal(saveData);
		window.location.reload();
	}
	
	function importFile(event){
		
		let file = event.target?.files?.[0];

		if (file){
			let reader = new FileReader();
			reader.readAsText(file);
			
			reader.onload = function(){
				if (typeof reader.result === "string"){
					textToLocal(reader.result);
					window.location.reload();
				}

			}

		}

	}

	function exportFile(){
		saveStateToLocal(sv.ST);
		let text = localToText();
		let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
		let url = window.URL.createObjectURL(blob);
		let a = document.createElement("a");
		a.href = url;
		a.download = "broken-wheel.txt";
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();

	}

	function saveDataChangeHandler(event) {
		setSaveData(event.target.value);
	}

	return(
		<div className="flexColumn">
			<textarea 
				className="saveTextArea"
				rows={10}
				onChange={(event)=>{saveDataChangeHandler(event)}}
				value={saveData}
			>
			</textarea>
			<div className="flexRow">
				<span 
					className="butt"
					onClick={()=>importText()}	
				>
					Import
				</span>
				<span 
					className="butt"
					onClick={()=>exportText()}	
				>
					Export
				</span>
				<input 
					id="eventFileInput" 
					className="hidden" 
					type="file"
					accept=".txt"
					onChange={(event)=>{importFile(event)}}
				/>
				<span
					className="butt"
					onClick={()=>{document.getElementById("eventFileInput").click()}}
				>
					Import File
				</span>
				<span 
					className="butt"
					onClick={()=>exportFile()}
				>
					Export File
				</span>
			</div>
		</div>
	);
	
}
