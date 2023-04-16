import React from 'react';
import {FoodSourceStatus} from './game-state/character-service';
import ErrorPanel from './error-panel';
import BagSlot from './bag-slot';
import {Serv} from './global-service-provider';
import {pipeBigNum, pipeDefined} from './helpers';
import {BagID} from './game-state/inventory';
import {DerivativeType} from './common-types';

export default function EquipmentPanel(){


	let [,dummyState] = React.useState({});
	let sv = Serv()
	
	if (sv === undefined) return <ErrorPanel/>;
	
	let gold = sv.Character.getMoney();

	function refresh(){
		
		dummyState({});

	}
	
	sv.MainLoop.subscribeToTick(refresh);


	let deriv = sv.Character.st.body.derivatives;
	//if body is invalid, return
	if (Object.keys(deriv).length === 0 && deriv.constructor === Object) return null;


	let equipHTML = [];
	
	for (let i = 0; i < 5; ++i){
		
		equipHTML.push(
			<BagSlot key = {"equip" + i} sv={sv} bagID={BagID.Equipment} index={i}/>

		);

	}
	
	let attack = deriv[DerivativeType.Attack].value;
	let defense = deriv[DerivativeType.Defense].value;
	
	let foodSource : FoodSourceStatus = sv.Character.getFoodSource();

	let foodSourceText = "";
	
	switch (foodSource){
		case FoodSourceStatus.Inventory:
		break;
		case FoodSourceStatus.Store:
			foodSourceText = "carrot";
		break;
		case FoodSourceStatus.Starvation:
			foodSourceText = "STARVING";
		break;
		default:
			foodSourceText = "ERROR";
	}

	return(

		<div className="panel">
			<div className="panelHeader">
				<span className="inventoryFlexRow">
					<span>
					{"Equipment - ₪" + pipeBigNum(gold)}
					</span>
					<span className="cornerElement mat-icon mat-red">
						{foodSourceText}
					</span>
				</span>
			</div>
			<div className="inventoryFlexRow">
				<span className="inventoryFlexColumn">
					{equipHTML}
				</span>
				<span className="equipmentStatColumn">
					<div className="equipmentStatsLi">
						Attack: {pipeBigNum(attack)}
					</div>
					<div>
						Defense: {pipeBigNum(defense)}
					</div>
				</span>
			</div>
		</div>


	);



}
