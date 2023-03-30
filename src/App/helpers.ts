
export function genericPowerFunction(inNum : number): number{

		
	return inNum;
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
