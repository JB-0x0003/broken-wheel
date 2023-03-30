import React from 'react';
import {Serv} from './global-service-provider';
import {pipeBigNum} from './helpers';

export default function EquipmentPanel(){


	let [,dummyState] = React.useState({});
	let sv = Serv()
	
	if (sv === undefined) return;
	
	let gold = sv.Character.getMoney();

	function refresh(){
		
		dummyState({});

	}
	
	sv.MainLoop.subscribeToTick(refresh);


	let deriv = sv.Character.st.body.derivatives;
	
	return(

		<div className="panel">
			<div className="panelHeader">
				{"Equipment - " + "₪" + pipeBigNum(gold)}
			</div>
			<div className="inventoryFlexRow">
				<span className="inventoryFlexColumn">
					<div className="inventoryLi">
						fuck
					</div>
					<div className="inventoryLi">
						fuck
					</div>
					<div className="inventoryLi">
						fuck
					</div>
					<div className="inventoryLi">
						fuck
					</div>
					<div className="inventoryLi">
						Gay
					</div>
				</span>
				<span className="equipmentStatColumn">
					<div className="equipmentStatsLi">Attack: {deriv.attack.value}</div>
					<div>Defense: {deriv.defense.value}</div>
				</span>
			</div>
		</div>


	);



}
