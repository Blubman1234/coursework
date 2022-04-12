//srt_result_script.js created 12/04/22

//returns an SRT results as an array 
function get_srt_results(srtResultKey){
		const srtResultString = localStorage[srtResultKey];
		const srtResults = JSON.parse(srtResultString);
		return srtResults;
}
//displays the current number of attempts in the attempt header
function display_attempt_number(srtResults){
	const attemptNum = srtResults.length;
	document.getElementById("attempt_header").innerHTML = "Attempt number - "+ attemptNum;
}
//displays the most recent srt time on the page
function display_srt_time(srtResults){
	const reactionTime = srtResults[srtResults.length - 1];
	document.getElementById("srt_time").innerHTML = "SRT Time " + reactionTime + "ms";
}
function main() {
	const srtResults = get_srt_results("srtResults");
	display_attempt_number(srtResults);
	display_srt_time(srtResults);
}

main();