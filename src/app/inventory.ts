import {ServiceObject} from './global-service-provider';
import ItemCollection, {ItemID, ItemType} from './items';

export enum BagID{
	
	Inventory,
	Equipment,

}

export enum ItemMaskID{
	
	True,
	EquipGeneric,
	EquipWeapon,

}


export type ItemMask = {
	
	(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack): boolean;

}

type ItemMaskSuite = {

	[key in ItemMaskID] : ItemMask
	
}

export type ItemMaskObject = {

	[key in number] : ItemMaskID

}

export function maskTrue():boolean{
	
	return true;
	
}


export function maskEquipGeneric(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack) : boolean{

	return false;

}
export function maskEquipWeapon(sv : ServiceObject, selfBag: Bag, originInventoryStack: InventoryStack) : boolean{
	
	console.log("WeaponSlot Mask Tested");
	
	if (!originInventoryStack) return true;

	let ID = originInventoryStack.ID;
	
	console.log(ItemCollection[ID]);

	if (ItemCollection[ID].type === ItemType.Weapon){
		
		return true;
		
	} else return maskEquipGeneric(sv, selfBag, originInventoryStack)
	


}


export type Bag = {
	
	size : number;
	mask : ItemMaskObject;	
	contents : InventoryStack[];	

}

export type InventoryStack = {
	
	ID: ItemID;
	amount: number;

}

let ItemMaskCollection : ItemMaskSuite = {

	[ItemMaskID.True] : maskTrue,
	[ItemMaskID.EquipGeneric]: maskEquipGeneric,
	[ItemMaskID.EquipWeapon]: maskEquipWeapon,


};


export default ItemMaskCollection;

