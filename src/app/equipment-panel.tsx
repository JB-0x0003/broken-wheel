import React from 'react';
import {FoodSourceStatus} from './game-state/character-service';
import ErrorPanel from './error-panel';
import BagSlot from './bag-slot';
import {Serv} from './global-service-provider';
import {pipeBigNum, pipeDefined} from './helpers';
import {BagID} from './game-state/inventory';
import {DerivativeType} from './common-types';
import {StatTooltip} from './tooltips';

export default function EquipmentPanel(){


	let [,dummyState] = React.useState({});
	let [subbed, setSubbed] = React.useState(false);
	let sv = Serv()
	
	if (sv === undefined) return <ErrorPanel/>;
	
	let gold = sv.Character.getMoney();

	function refresh(){
		
		dummyState({});

	}
	
	if (!subbed){
		sv.MainLoop.subscribeToTick(refresh);
		setSubbed(true);
	}


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

	let foodSourceHTML = null;
	
	switch (foodSource){
		case FoodSourceStatus.Inventory:
		break;
		case FoodSourceStatus.Store:
			foodSourceHTML = (
					<div className="cornerElement mat-icon mat-red">carrot</div>
			)
		break;
		case FoodSourceStatus.Starvation:
			foodSourceHTML = (
				<div className="cornerElement mat-red">STARVING!</div>
			)
		break;
		default:
			foodSourceHTML = (
				<div className="cornerElement mat-red">ERROR!</div>
			)
	}

	return(

		<div className="panel">
			<div className="panelHeader">
				<span className="inventoryFlexRow">
					<span className="rowSpreader">
						<span>
						{"Equipment - ₹" + pipeBigNum(gold)}
						</span>
						{foodSourceHTML}
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
						<StatTooltip 
							category="derivative" 
							stat={DerivativeType.Attack}
							direction="left"
						/>
					</div>
					<div className="equipmentStatsLi">
						Defense: {pipeBigNum(defense)}
						<StatTooltip 
							category="derivative" 
							stat={DerivativeType.Defense}
							direction="left"
						/>
					</div>
				</span>
			</div>
		</div>


	);



}
