import React from 'react';
import {Serv} from './global-service-provider';
import ErrorPanel from './error-panel';
import ProgressBar from './progress-bar';
import {ActivityID} from './game-state/activities';
import SecretCollection, {SecretID, secretXPForRank} from './game-state/secrets';


interface secretElementProps {
	
	ID: SecretID;

}

export default function SecretElement(props: secretElementProps) {

	let [,dummyState] = React.useState({});
	let [initialized, setInitialized] = React.useState(false);
	let [selected, setSelected] = React.useState(false);

	let sv = Serv();

	if (sv === undefined) return (<ErrorPanel/>);

	if (!initialized){
		setInitialized(true);
		setSelected(props.ID === sv.Character.st.currentSecretID 
					&& sv.Character.st.currentActivityID === ActivityID.Meditation);
	}
	
	let secret = SecretCollection[props.ID];
	let sRecord = sv.Character.st.secrets[props.ID];

	let maxXP = secretXPForRank(props.ID, sRecord.rank + 1);
	
	function meditate(){
		
		sv.Character.setCurrentSecret(props.ID);
		sv.World.setCurrentActivity(ActivityID.Meditation);
		setSelected(true);	

	}

	function handleChange(){
		if (selected === true){	
			if (props.ID !== sv.Character.st.currentSecretID 
					|| sv.Character.st.currentActivityID !== ActivityID.Meditation){
				setSelected(false);
			}
			dummyState({});
		}

	}
	
	sv.Character.subscribeToSecretChange(handleChange.bind(this));

	

	return(
		<span className = "secretElement" onClick={meditate}>
			<div className = {"secretLabel" 
				+ (selected ? " selected" : "")
			}>
				<span className = "secretName">
					{secret.name[0]}
				</span>
				<span className = "secretLevel">
					{"Lv: " + sRecord.rank}
				</span>
			</div>
			<ProgressBar colorType="secret" value={sRecord.XP} max={maxXP} slim={true}/>
		</span>
	);
}
