//srt_script.js created 13/04/22
/*contains the script for executing the simple reaction time test
the script will cause a red circle to appear at random intervals in test window
will record the time difference between the circle appearing and the users click
calculate the users mean srt time and save it to local storage*/

import {get_time_from_now,
		get_symbol_wait_times,
		remove_start_button,
		display_symbols_record_clicks,
		calc_average,
		reinsert_start_button} from "test_functions.js";

document.getElementById("start_SRT_button").addEventListener("click", srt_test);

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
	console.log(meanReactionTime);
	console.log(reactionTimes);
	reinsert_start_button("start_SRT_button");
	save_srt_result(meanReactionTime);
	//redirect to result page 
	location.href = resultUrl;
}