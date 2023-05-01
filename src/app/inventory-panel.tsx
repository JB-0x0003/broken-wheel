import React from 'react';
import ErrorPanel from './error-panel';
import BagSlot from './bag-slot';
import StoreSlot from './store-slot';
import {Serv} from './global-service-provider';
import {BagID} from './game-state/inventory';
import {ItemID} from './game-state/items';

export default function InventoryPanel(){

	const [,dummyState] = React.useState({});
	const [subbed, setSubbed] = React.useState(false);

	let sv = Serv();
	
	//If state isn't done being created, abort
	if (sv === undefined) return <ErrorPanel/>;

	//TODO make alert system to only update when needed
	function refresh():void{
		
		dummyState({});

	}

	if (!subbed){
		sv.MainLoop.subscribeToLongTick(refresh);
		setSubbed(true);

	}
	

	let stackHTML = [[],[]];

	for (let i = 0; i < 30; ++i){
		
		stackHTML[i % 2].push(
			<BagSlot key = {"inv" + i} sv={sv} bagID={BagID.Inventory} index={i}/>			
		);

		
	}

	let storeHTML = [];
	let storeItems = sv.World.getCurrentZoneStoreItems();
	let i = 0;

	for (let key in storeItems){
		
		storeHTML.push(
			<StoreSlot key = {"store" + i} ID={key as ItemID}/>

		);
		++i;

	}

	return(

	<div className="panel spanning">
		<div className="flexColumn">
			<div className="panelHeader">
				Inventory
			</div>
			<div className="scrollableWrapper">
				<div className="scrollable">
					<div className="inventoryFlexRow">
						<span className="inventoryFlexColumn">
							{stackHTML[0]}
						</span>
						<span className="inventoryFlexColumn">
							{stackHTML[1]}
						</span>
						<span className="inventoryFlexColumn">
							{storeHTML}
						</span>
					</div>
				</div>
			</div>
		</div>

	</div>


	);


}
