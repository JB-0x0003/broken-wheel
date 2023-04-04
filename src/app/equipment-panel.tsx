import React from 'react';
import BagSlot from './bag-slot';
import {Serv} from './global-service-provider';
import {pipeBigNum} from './helpers';
import {BagID} from './inventory';
import {DerivativeType} from './body';

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
	let equipHTML = [];
	
	for (let i = 0; i < 5; ++i){
		
		equipHTML.push(
			<BagSlot sv={sv} bagID={BagID.Equipment} index={i}/>

		);

	}

	return(

		<div className="panel">
			<div className="panelHeader">
				{"Equipment - " + "₪" + pipeBigNum(gold)}
			</div>
			<div className="inventoryFlexRow">
				<span className="inventoryFlexColumn">
					{equipHTML}
				</span>
				<span className="equipmentStatColumn">
					<div className="equipmentStatsLi">
						Attack: {deriv[DerivativeType.Attack].value}
					</div>
					<div>
						Defense: {deriv[DerivativeType.Defense].value}
					</div>
				</span>
			</div>
		</div>


	);



}
