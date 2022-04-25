//srt_result_script.js created 12/04/22

//returns an SRT results as an array 
function get_results(resultKey){
		const resultString = localStorage[resultKey];
		const results = JSON.parse(resultString);
		return results;
}
//displays the current number of attempts in the attempt header
function display_attempt_number(results){
	const attemptNum = results.length;
	document.getElementById("attempt_header").innerHTML = "Attempt number - "+ attemptNum;
}
//displays the most recent srt time on the page
function display_srt_time(srtResults){
	const reactionTime = srtResults[srtResults.length - 1];
	document.getElementById("srt_time").innerHTML = "SRT Time <br>" + reactionTime + "ms";
}

function display_srt_results(){
	const srtResults = get_results("srtResults");
	display_attempt_number(srtResults);
	display_srt_time(srtResults);
}

//displays the mean reaction time on page
function display_crt_time(currCrtResult){
	const reactionTime = currCrtResult.reactionTime;
	document.getElementById("crt_time").innerHTML = "CRT Time <br>" + reactionTime + "ms";
}
//display percentage of clicks correct on page
function display_crt_accuracy(currCrtResult){
	const accuracy = currCrtResult.accuracy
	document.getElementById("crt_accuracy").innerHTML = "Accuracy <br>%"+ accuracy;
}
function display_crt_results(){
	const crtResults = get_results("crtResults");
	display_attempt_number(crtResults);
	currCrtResult = crtResults[crtResults.length - 1];
	display_crt_time(currCrtResult);
	display_crt_accuracy(currCrtResult);
}

function main() {
	if(window.location.pathname.endsWith("/coursework/srt_result.html")){
		display_srt_results();
	}
	else if(window.location.pathname.endsWith("/coursework/crt_result.html")){
		display_crt_results();
	}
}

main();