

export enum ItemID{

	Rice,
	Garbage,	

}

export interface Item{

	name: string;
	ID: ItemID;
	description: string;
	value: number;
	maxStack: number;
	consumable: boolean;	
	health?: number;

}

type ItemObject = {
	
	[key in ItemID] : Item

}

let ItemCollection : ItemObject = {

	[ItemID.Rice] : {

		name:"Rice",
		ID: ItemID.Rice,
		description: "Raw calories. It keeps you alive.",
		value: 1,
		maxStack: 1000,
		consumable: true,
		health: 2,	

	},

	[ItemID.Garbage]:{

		name:"Garbage",
		ID: ItemID.Garbage,
		description: "Trash.",
		value: 0,
		maxStack: 1000,
		consumable: true,
		health: 0.8,

	}

};



export default ItemCollection;
