/*test_script.js created:28/03/22*/

document.getElementById("start_SRT_button").addEventListener("click", srt_test);

/*this function take a time in milliseconds and will output the date time when that time has passed*/
function get_time_from_now(milliseconds){
	let currTime = Date.now();
	const endTime = currTime + testLength;
	return endTime;
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
	srtSymbol.src = "./images/SRT_symbol.png";
	srtSymbol.style.display = "none";
	testWindow.appendChild(srtSymbol);

	await sleep(symbolWaitTimes[0]);
	//for each symbol in symbolWaitTimes 
	for (let i = 0; i < symbolWaitTimes.length; i++){
		srtSymbol.style.display = "block";
		setTimeout(function(){srtSymbol.style.display = "none";}, symbolHoldTime);	//asyncronously wait for symbolHoldTime then stop displaying test symbol
		const symbolDisplayTime = Date.now();
		var clickTime = 0										//clicktime is defined as var so it does not go out of scope
		//start listening for user clicks, after encountering a click remove event listener
		testWindow.addEventListener("click", function(){
			if (clickTime === 0){
				clickTime = Date.now();
			}
		});
		//wait till next symbol or test end
		if ((i + 1) < symbolWaitTimes.length){
			await sleep(symbolWaitTimes[i+1]);
		}
		else{
			await sleep(testEnd - symbolDisplayTime);
		}
		//check to see if user clicked
		if (clickTime > 0){
			reactionTimes.push(clickTime -symbolDisplayTime);
		}
	}
	return reactionTimes ;
}


//this function calculates the mean average of the array of numbers input
function calc_average(num_array){
	const numCount = num_array.length;
	let total = 0;
	for (number of num_array){
		total += number;
	}
	const average = Math.round(total / numCount);
	return average;
}

//this function adds the users SRT test result to local storage
function save_srt_result(meanSrtTime){
	const srtResultsKey = "srtResults";
	const storedResultsString = localStorage[srtResultsKey];
	let storedResults = []
	//if results are already stored store them in StoredResults else continue
	try{
		storedResults = JSON.parse(storedResultsString);
	}
	//log syntax error and continue
	catch(syntaxError){console.log(syntaxError.message)}
	//add current results to stored results and then save to localStorage
	const updatedResults = storedResults.concat(meanSrtTime);
	const updatedResultsJson = JSON.stringify(updatedResults);
	localStorage.setItem(srtResultsKey, updatedResultsJson);

}

async function srt_test(){
	const resultUrl = "srt_result.html"
	const testLength = 10000;
	const symbolHoldTime = 500;
	const endTime = get_time_from_now(testLength);
	const symbolWaitTimes = get_symbol_wait_times(symbolHoldTime,testLength);
	remove_start_button("start_SRT_button");
	const reactionTimes =await display_symbols_record_clicks(symbolWaitTimes,symbolHoldTime,endTime);
	const meanReactionTime = calc_average(reactionTimes);
	save_srt_result(meanReactionTime);
	//redirect to result page 
	location.href = resultUrl;
}