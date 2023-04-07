
export function genericPowerFunction(inNum : number): number{

		
	return inNum;
}

export function pipeDefined(inVal: any): any{

	if (typeof inVal === 'undefined'){
		return undefined;
	} else {
		return inVal;
	}

}

export function pipeAge(inDays: number): string{

	let years = Math.floor(inDays / 360);
	let days = inDays % 360;

	return years + " years, " + days + " days"


}

export function pipeBigNum(num: number) : string{
	
	if (num === 0) return "0";

	const suffixArray = ['', 'k', 'M', 'B', 'T', 'q', 'Q', 's'];

	let numPow = Math.log( Math.abs(num) ) / Math.log(10);
	numPow = Math.floor(numPow);

	if ( numPow <= 1 ) {
			
		return num.toPrecision(3 + numPow);

	} else if (num >= Math.pow(10, suffixArray.length * 3)){
			
		return num.toPrecision(3);
		

	}


	let numString = num / Math.pow(10, numPow - (numPow %3) - 2) / 100;

	return numString.toFixed(3 - (numPow % 3)) + suffixArray[Math.floor(numPow / 3)];
		


}

export function applyObject(inObj : Object, targetObj : Object): void{
	
	for (let key in inObj){
		
		if (typeof targetObj[key] === 'undefined'){
			targetObj[key] = inObj[key];	

		} else if (typeof inObj[key] !== 'object' && typeof targetObj[key] !== 'object'){
			
			targetObj[key] = targetObj[key] + inObj[key];

		} else {
			
			applyObject(inObj[key], targetObj[key]);

		}

	}

}
//merges objects without overwriting values in target object
export function mergeObjects(templateObj: Object, targetObj: Object): void{
	
	for (let key in templateObj){
		
		if (typeof targetObj[key] === 'undefined'){
			targetObj[key] = templateObj[key];	

		} else if (typeof targetObj[key] === 'object' && typeof templateObj[key] === 'object'){
			
			mergeObjects(templateObj[key], targetObj[key]);

		} 

	}



}
