/*test_script.js created:28/03/22*/

try{
	document.getElementById("start_SRT_button").addEventListener("click", srt_test);
}
catch(TypeError){
	document.getElementById("start_CRT_button").addEventListener("click", crt_test);
}


/*this function take a time in milliseconds and will output the date time when that time has passed*/
function get_time_from_now(milliseconds){
	let currTime = Date.now();
	const endTime = currTime + milliseconds;
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
async function display_srt_symbols_record_clicks(symbolWaitTimes, symbolHoldTime, testEnd){
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
	const reactionTimes =await display_srt_symbols_record_clicks(symbolWaitTimes,symbolHoldTime,endTime);
	const meanReactionTime = calc_average(reactionTimes);
	save_srt_result(meanReactionTime);
	//redirect to result page 
	location.href = resultUrl;
}

/*this function will create the crt symbols used in the crt test and display them as hidden elements
takes two arrays of letters and colours to be used in the test and gives them each a numbered id e.g symbol1,symbol2
outputs an array of the symbols ids, gives each symbol class crt_symbol for styling in css*/
function create_crt_symbols(testWindowId,letters, colours){
	const testWindow = document.getElementById(testWindowId);
	var symbolNum = 0;
	const symbolIds = [];
	for (let letter of letters){
		for (let colour of colours){
			let symbolElement = document.createElement("p");
			let symbolLetter = document.createTextNode(letter);
			let symbolId = "sym" + symbolNum;
			symbolIds.push(symbolId);
			symbolElement.appendChild(symbolLetter);
			symbolElement.id = symbolId;
			symbolElement.className = "crt_symbol";
			symbolElement.style.color = colour;
			symbolElement.style.display = "none";
			testWindow.appendChild(symbolElement);
			symbolNum += 1;
		}
	}
	return symbolIds;
}
/*this function creates an array made of the symbol ids in the order that they will appear
the symbols will appear in a random order but the target symbol (the one the user must left click) will appear approx 40% of the time
the target symbol is the symbol with the first id in symbolIds e.g. symbolIds[0]*/
function create_crt_symbol_order(symbolIds,numAppearances){
	const appearanceOrder = [];
	const targetSymbolIndexes = [];
	const numTargetSymbols = Math.round(numAppearances * 0.4);
	//loop for 40% number of appearances and create the indexes for the target symbol
	for (let i = 0; i < numTargetSymbols; i++){
		//calculate a unique target index
		do{
			var targetIndex = calc_rand_int(0, numAppearances);
		} while (targetSymbolIndexes.includes(targetIndex))
		
		targetSymbolIndexes.push(targetIndex);
	}
	for (let i = 0; i < numAppearances; i++){
		//if current index is in target indexes add target to appearenceOrder
		if (targetSymbolIndexes.includes(i)){
			appearanceOrder.push(symbolIds[0]);
		}
		else {
			//add a random non-target symbol to appearenceOrder
			let randNum = calc_rand_int(1, symbolIds.length);
			appearanceOrder.push(symbolIds[randNum]);
		}
	}
	return appearanceOrder;
}

/*displays crt test symbols according to their wait times and records the users reaction times to clicking them
and the number of clicks the user got correct symbols with id "sym0" should be left clicked and others should be right clicked returns an object of
an array of reaction times and an integer of correctClicks*/
async function display_crt_symbols_record_clicks(symbolWaitTimes,symbolsOrder, symbolHoldTime, testEnd){
	const reactionTimes = [];
	var correctClicks = 0;
	const testWindow = document.getElementById("test_window");
	//wait for first symbol
	await sleep(symbolWaitTimes[0]);
	
	//disable right clicks from showing context menu
	testWindow.addEventListener("contextmenu", function(event){event.preventDefault();});

	//loop for each symbol in symbolsOrder
	for (let i = 0; i < symbolsOrder.length; i++){
		//display current symbol
		let currSymbol = document.getElementById(symbolsOrder[i]);
		currSymbol.style.display = "block";
		//hide symbol after hold time 
		setTimeout(function(){currSymbol.style.display = "none";}, symbolHoldTime);
		let displayTime = Date.now();
		var clickTime = 0;
		var reactionTime = 0;

		let listenerController = new AbortController();
		//create event listener to record click data
		testWindow.addEventListener("mousedown",function(event){
			//ensure event only fires on first click
			if (clickTime == 0){
				//record click time data
				clickTime = Date.now()
				reactionTime = clickTime - displayTime;
				reactionTimes.push(reactionTime);
				
				//record click accuraccy
				if (currSymbol.id == "sym0" && event.button == 0){
					correctClicks += 1;
				}
				else if (currSymbol.id != "sym0" && event.button == 2){
					correctClicks +=1;
				}
			}
		//add abort signal to listener
		}, {signal:listenerController.signal});

		//wait for next symbol or end of test
		if((i + 1) < symbolWaitTimes.length){
			await sleep(symbolWaitTimes[i + 1]);
		}
		else {
			await sleep(testEnd - displayTime);
		}
		//abort listener for current symbol
		listenerController.abort();
	}
	return {reactionTimes, correctClicks};
}

//returns the percentage that targetNum takes up from the total. returns as int
function calc_percentage(targetNum, total){
	let percentage = (targetNum / total) * 100;
	percentage = Math.round(percentage);
	return percentage;
}


//this function adds the users CRT test result to local storage
function save_crt_result(meanCrtTime, accuracyPercentage){
	//creates object resultObj to hold users current crt results
	const resultObj = {reactionTime: meanCrtTime, accuracy: accuracyPercentage};
	const crtResultsKey = "crtResults";
	const storedResultsString = localStorage[crtResultsKey];
	let storedResults = []
	//if results are already stored store them in StoredResults else continue
	try{
		storedResults = JSON.parse(storedResultsString);
	}
	//log syntax error and continue
	catch(syntaxError){console.log(syntaxError.message)}
	//add current results to stored results and then save to localStorage
	const updatedResults = storedResults.concat(resultObj);
	const updatedResultsJson = JSON.stringify(updatedResults);
	localStorage.setItem(crtResultsKey, updatedResultsJson);
}

//runs the crt test
async function crt_test(){
	const resultUrl = "crt_result.html";
	const testLength = 30000;
	const symbolHoldTime = 500;
	const testLetters = ["F","P","B"];  
	const testColours = ["red","green","blue"];
	const symbolWaitTimes = get_symbol_wait_times(symbolHoldTime, testLength);
	const symbolIds = create_crt_symbols("test_window",testLetters,testColours);
	const symbolDisplayOrder = create_crt_symbol_order(symbolIds, symbolWaitTimes.length);
	remove_start_button("start_CRT_button");
	const testEnd = get_time_from_now(testLength);
	const { reactionTimes, correctClicks } = await display_crt_symbols_record_clicks(symbolWaitTimes, symbolDisplayOrder, symbolHoldTime, testEnd);
	const meanReactionTime = calc_average(reactionTimes);
	const accuracyPercent = calc_percentage(correctClicks, reactionTimes.length);
	save_crt_result(meanReactionTime, accuracyPercent);
	location.href = resultUrl;
}