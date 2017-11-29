/**
 * quick and dirty class for storing enumerable values
 */
function Enum() {
	this.all = [];
	for (let i = 0; i < arguments.length; ++i) {
		//for each specified value in the Enum, allow referencing the value by name or by number
		this[arguments[i]] = i;
		this[i] = arguments[i];
		this.all[i] = arguments[i];
	}
	//store the total number of values in the enum for easy indexing
	this.length = arguments.length;
}