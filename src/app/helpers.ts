
export function weightedAverage(inNums : number[], inWeights : number[]) : number{
	
	//check for trivial case
	if (inNums.length === 1) return inNums[0];

	let totalWeight = 0;
	let weightedSum = 0;
	let currentWeight = 0;

	for (let i = 0; i < inNums.length; i++){
		currentWeight = inWeights[i];
		if (currentWeight === undefined) currentWeight = 1;
		totalWeight += currentWeight;
		weightedSum += inNums[i] * currentWeight;
	}

	return weightedSum / totalWeight;

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


//merges objects, summing shared keys
export function sumObject(inObj : Object, targetObj : Object): void{
	
	for (let key in inObj){
		
		if (typeof inObj[key] === 'undefined'){
			console.log("!!ERROR: template object has undefined value for key: " + key + "!!");
			continue;
		}

		if (typeof targetObj[key] === 'undefined'){
			targetObj[key] = inObj[key];	

		} else if (typeof inObj[key] !== 'object' && typeof targetObj[key] !== 'object'){
			
			targetObj[key] = targetObj[key] + inObj[key];

		} else {
			
			sumObject(inObj[key], targetObj[key]);

		}

	}

}
//subtracts number values from keys in target object
//has no effect on undefined keys
export function subtractObject(inObj : Object, targetObj : Object): void{
	
	for (let key in inObj){

		if (typeof inObj[key] === 'undefined' || typeof targetObj[key] === 'undefined'){
			console.log("!!ERROR: template object has undefined value for key: " + key + "!!");
			continue;
		}

		if (typeof inObj[key] === 'number' && typeof targetObj[key] ==='number'){
			
			targetObj[key] = targetObj[key] - inObj[key];

		} else if (typeof inObj[key] === 'object' && typeof targetObj[key] === 'object' && targetObj[key] !== null){
			
			subtractObject(inObj[key], targetObj[key]);

		}
		

	}

}


//merges objects without overwriting values in target object
export function mergeObjects(templateObj: Object, targetObj: Object): void{
	
	for (let key in templateObj){
		//console.log(key);
		if (typeof targetObj[key] === 'undefined'){
			targetObj[key] = templateObj[key];	
		
		//null check is here because typeof null === 'object'
		//and many things give null instead of undefined for esoteric reasons
		} else if (typeof targetObj[key] === 'object' && typeof templateObj[key] === 'object' && targetObj[key] !== null){
			//console.log("continuing merge with key: " + key);
			//console.log(targetObj[key]);
			mergeObjects(templateObj[key], targetObj[key]);

		} 

	}

}

export function overwriteObject(templateObj: Object, targetObj: Object): void{
	
	for (let key in templateObj){
		//console.log(key);
		if (typeof targetObj[key] === 'undefined'){
			targetObj[key] = templateObj[key];	
		
		//null check is here because typeof null === 'object'
		//and many things give null instead of undefined for esoteric reasons
		} else if (typeof targetObj[key] === 'object' && typeof templateObj[key] === 'object' && targetObj[key] !== null){
			//console.log("continuing merge with key: " + key);
			//console.log(targetObj[key]);
			overwriteObject(templateObj[key], targetObj[key]);

		} else {
			targetObj[key] = templateObj[key];
		}

	}

}
