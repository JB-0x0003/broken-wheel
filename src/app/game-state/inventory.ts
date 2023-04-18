import {ServiceObject} from '../global-service-provider';
import ItemCollection, {ItemID, ItemType} from './items';

export enum BagID{
	
	Inventory = "inventory",
	Equipment = "equipment",

}

export enum ItemMaskID{

	True = "true",
	False = "false",
	EquipGeneric = "equipgeneric",
	EquipWeapon = "equipweapon",
	EquipWeaponNoble = "equipweaponnoble",
}


export type ItemMask = {
	
	(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack): boolean;

}

type ItemMaskSuite = {

	[key in ItemMaskID] : ItemMask
	
}

export type ItemMaskObject = {

	[key in number]: ItemMaskID

}

export function maskTrue():boolean{
	
	return true;
	
}

export function maskFalse():boolean{
	
	console.log("!!ERROR: maskFalse() Activated!!");
	return false;

}

export function maskEquipGeneric(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack) : boolean{

	return false;

}
export function maskEquipWeapon(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack) : boolean{
	
	console.log("WeaponSlot Mask Tested");
	
	if (maskEquipWeaponNoble(sv, selfBag, originInventoryStack)){
		if (originInventoryStack === undefined) return true;
		let ID = originInventoryStack.ID;		
		if (ItemCollection[ID].noble === true){
			sv.Log.pushLog("You cannot bring yourself to abuse something so noble.");
			return false;
		}
		return true;
	}else return false;
	


}

export function maskEquipWeaponNoble(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack) : boolean{
	
	if (!originInventoryStack) return true;

	let ID = originInventoryStack.ID;
	
	console.log(ItemCollection[ID]);

	if (ItemCollection[ID].type === ItemType.Weapon){
		
		return true;
		
	} else return maskEquipGeneric(sv, selfBag, originInventoryStack)

}

export type BagContents = {

	[key: number] : InventoryStack;

}

export type Bag = {
	
	size : number;
	defaultMask : ItemMaskID;
	mask : ItemMaskObject;	
	contents : BagContents;	

}

export type InventoryStack = {
	
	ID: ItemID;
	amount: number;

}

export type ItemSort = (inBag: Bag, index: number) => number;

export enum ItemSortID{
	
	HighestValue = "highestvalue",
	LowestValue = "lowestvalue",
	First = "first",
	Last = "last",
}

type ItemSortSuite = {
	
	[key in ItemSortID] : ItemSort

}

let ItemSortCollection : ItemSortSuite = {
	
	[ItemSortID.HighestValue] : (inBag: Bag, index: number) => {
		
		let itemID = inBag.contents[index].ID;
		let item = ItemCollection[itemID];
		return item.value;
		
	},
	
	[ItemSortID.LowestValue] : (inBag: Bag, index: number) => {
		
		let itemID = inBag.contents[index].ID;
		let item = ItemCollection[itemID];
		return -item.value;
		
	},

	[ItemSortID.First] : (inBag: Bag, index: number) => {
		
		return -index;

	},

	[ItemSortID.Last] : (inBag: Bag, index: number) => {

		return index;
	}

}

let ItemMaskCollection : ItemMaskSuite = {

	[ItemMaskID.True] : maskTrue,
	[ItemMaskID.False]: maskFalse,
	[ItemMaskID.EquipGeneric]: maskEquipGeneric,
	[ItemMaskID.EquipWeapon]: maskEquipWeapon,
	[ItemMaskID.EquipWeaponNoble]: maskEquipWeaponNoble,

};

export {ItemSortCollection};
export default ItemMaskCollection;

