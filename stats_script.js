//stats_script.js created 29/04/22

/*this function outputs the test results stored in localStorage, if results not 
in storage returns undefined*/
function get_test_results(resultKey){
	const resultString = localStorage[resultKey];
	//if there is a result in local storage parse and return it
	if (resultString){
		const result = JSON.parse(resultString);
		return result
	}
	//if no result return undefined
	else{
		return undefined;
	}

}
//returns an array of only crt reaction times in the correct order
function get_crt_times(crtResults){
	//define function for map
	function get_time(result){
		return result.reactionTime;
	}
	//if there are crt results return reaction times
	if (crtResults){
		reactionTimes = crtResults.map(get_time);
		return reactionTimes;
	}
}
/*finds the lowest number from an array of numbers and returns number and its index as an object
works with undefined entries*/
function find_min(numArray){
	function find_first_num(num,index){
		if(num != undefined){
			return true;
		}
	}
	//finds first defined entry
	const firstMinIndex = numArray.findIndex(find_first_num); 
	//checks if current num is less then current minimum and if it is replaces min with new num and index
	const minValue = {minNum:numArray[firstMinIndex],index:firstMinIndex};
	const arrayLength = numArray.length;
	for (let i = firstMinIndex+1; i < arrayLength;i++){
		if (numArray[i] < minValue.minNum){
			minValue.minNum = numArray[i];
			minValue.index = i;
		}
	}
	return minValue;
}

/*returns an array of length numResults containing objects holding the lowest times and the attempt number of those times
this array is ordered from shortest time to longest*/
function get_top_results(numResults, results){
	//make clone of results array so function will not effect orginal array
	const resultsClone = results.slice();
	const resultsCloneLen = resultsClone.length;
	const lowestResults = []
	for(let i = 0; i < numResults && i < resultsCloneLen; i++){
		//find current min time and add to lowest results
		const {minNum, index} = find_min(resultsClone);
		const currAttemptNum = index + 1;
		lowestResults.push({reactionTime: minNum, attemptNum: currAttemptNum});
		//remove current min from results
		delete resultsClone[index];
	}
	return lowestResults;
}
//returns two arrays of reaction times for both the srt and crt test
function get_result_times(){
	const crtResults = get_test_results("crtResults");
	const srtTimes = get_test_results("srtResults");
	const crtTimes = get_crt_times(crtResults);
	return {srtTimes, crtTimes}
}



//defining function for creating lists of top results for tests
function display_top_results(asideId,noResultMessageId, resultTimes){
	if (resultTimes!= undefined){
		const topResults = get_top_results(3,resultTimes)
		const topResultsLen = topResults.length;
		const topResultsList = document.createElement("ol");
		document.getElementById(noResultMessageId).remove();
		document.getElementById(asideId).appendChild(topResultsList)
		for(let i = 0; i < topResultsLen; i++){
			let result = document.createElement("li");
			result.innerHTML="Attempt #"+topResults[i].attemptNum+" - "+topResults[i].reactionTime+"ms";
			topResultsList.appendChild(result);
		}
	}
}


function main(){
	const {srtTimes, crtTimes} = get_result_times()
	display_top_results("top_crt_times","no_crt_message",crtTimes);
	display_top_results("top_srt_times","no_srt_message",srtTimes);
}

main();

