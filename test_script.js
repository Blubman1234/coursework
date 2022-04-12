/*test_script.js created:28/03/22*/

document.getElementById("start_SRT_button").addEventListener("click", SRT_test);

/*this function takes the length of the test in milliseconds and will return 
an object containing test start time and end time*/
function Test_times(testLength){
	let currTime = Date.now();
	this.startTime = currTime;
	this.endTime = currTime + testLength;
}

//this function returns an integer between min and max (not including max)
function calc_rand_int(min, max){
	let randInt = ((max - min) * Math.random()) + min;
	randInt = Math.floor(randInt); // rounds to an integer and keeps randInt below max
	return randInt;
}

/*this function calculates the times that the test symbols wait before appearing during the test.
the wait times will be random but in total will be less than the test length.
takes the amount of time the symbols should stay on screen
and the length of the test in milliseconds as input.*/
function get_symbol_wait_times(symbolHoldTime, testLength){
	let currTestTime = 0;
	const symbolMinWait = 1000; //min time a symbol can wait before appearing
	const symbolMaxWait = 1800;	//max time a symbol can wait before appearing
	const symbolWaitTimes = [];
	let waitTime = calc_rand_int(symbolMinWait, symbolMaxWait);
	currTestTime += waitTime + symbolHoldTime;
	//if the current test time is less than the test length add current wait time and create new one.
	while (currTestTime < testLength){
		symbolWaitTimes.push(waitTime);
		waitTime = calc_rand_int(symbolMinWait, symbolMaxWait);
		currTestTime += waitTime + symbolHoldTime;
	}
	return symbolWaitTimes;
}

//this function removes the start button
function remove_start_button(buttonId){
	document.getElementById(buttonId).style.display = "none";
}

function reinsert_start_button(buttonId){
	document.getElementById(buttonId).style.display = "block";
}

/*this function will make exectution of program stop for number specified milliseconds.
because it is an async function it functions it is used in must also be async.
because it works by resolving promises it must be used along with the await command e.g. await sleep(milliseconds)*/
async function sleep(milliseconds){
	let promise = new Promise(function(output){
		setTimeout(function() {output(null);}, milliseconds);
	});
	let contin = await promise;
}

//this function displays the test symbol/s and records the users clicks when reacting to them
async function display_symbols_record_clicks(symbolWaitTimes, symbolHoldTime, testEnd){
	const reactionTimes = [];
	
	//create srt symbol and insert it hidden into the test window
	const testWindow = document.getElementById("test_window");
	const srtSymbol = document.createElement("img");
	srtSymbol.src = "./images/SRT_symbol.PNG";
	srtSymbol.style.display = "none";
	testWindow.appendChild(srtSymbol);

	await sleep(symbolWaitTimes[0]);
	//for each symbol in symbolWaitTimes 
	for (let i = 0; i < symbolWaitTimes.length; i++){
		srtSymbol.style.display = "block";
		setTimeout(function(){srtSymbol.style.display = "none";}, symbolHoldTime);	//asyncronously wait for symbolHoldTime then stop displaying test symbol
		const symbolDisplayTime = Date.now();
		var clickTime = 0										//clicktime is defined as var so it does not go out of scope
		function get_click_time(){
			clickTime = Date.now;
			testWindow.removeEventListener("click", get_click_time());
			}
		testWindow.addEventListener("click", get_click_time());
		//wait till next symbol or test end
		try{
			await sleep(symbolWaitTimes[i+1]);
		}
		catch(err){
			await sleep(testEnd - symbolDisplayTime);
		}
		//check to see if user clicked
		if (clickTime > 0){
			reactionTimes.push(clickTime -symbolDisplayTime);
		}
	}
	return reactionTimes ;
}

//this function calculates the mean average of the array of numbers put in
function calc_average(num_array){
	const numCount = num_array.length;
	let total = 0;
	for (number of num_array){
		total += number;
	}
	const average = total / numCount;
	return average;
}

async function SRT_test(){
	const testLength = 30000;
	const symbolHoldTime = 500;
	const testTimes = new Test_times(testLength);
	const symbolWaitTimes = get_symbol_wait_times(symbolHoldTime,testLength);
	remove_start_button("start_SRT_button");
	const reactionTimes =await display_symbols_record_clicks(symbolWaitTimes,symbolHoldTime);
	const meanReactionTime = calc_average(reactionTimes);
	console.log(meanReactionTime);
	console.log(reactionTimes);
	reinsert_start_button("start_SRT_button")

}