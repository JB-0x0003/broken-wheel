import React from 'react';
import {Serv} from './global-service-provider';
import {pipeBigNum} from './helpers';

export default function EquipmentPanel(){
	let sv = Serv()
	
	let gold = sv.Character.getMoney();
	let [,dummyState] = React.useState({});

	function refresh(){
		
		dummyState({});

	}

	if (sv === undefined) return;
	
	sv.MainLoop.subscribeToTick(refresh);

	/*	
	const [sv, setSV] = React.useState(tmp);
	setSV(Serv());
	*/
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
					<div className="equipmentStatsLi">Gayness: 200</div>
					<div>Faggotry: 93920</div>
				</span>
			</div>
		</div>


	);



}
