//Declaration of module
var myApp=angular.module('soccerApp',['ngRoute']);

var strMatchday = "";
var league2015URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
var league2016URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';
var url = "";

//Declaration of MainController
myApp.controller('MainController',['$http',function($http){
	var main=this;
	this.scores = [];

  	main.decideURL = function(year){
  		if(year == 2015){
  			url = league2015URL;
  		}
  		if(year == 2016){
  			url = league2016URL;
  		}
  	}

  	this.baseUrl1 = url;
  	
  	main.loadAllScores = function(){
		$http({
				method: 'GET',
				url: main.baseUrl1
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					main.scores = response.data.rounds;
					}, function errorCallback(response) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						alert("some error occurred. Check the console.");
						console.log(response);
					});
	}// end load all scores

	main.getName = function(name){
		strMatchday = name;
	}
}]); // end MainController

//Declaration of MatchController
myApp.controller('MatchController',['$http',function($http){
	var main=this;
	this.matcheslist = [];
  	this.baseUrl1 = url;

  	this.loadAllMatches = function(){
		$http({
			method: 'GET',
			url: main.baseUrl1
			}).then(function successCallback(response) {
				jQuery.each(response.data.rounds,function(i,val1){
					if(val1.name == strMatchday){
						main.matcheslist = val1.matches;
					}
				});
				}, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					alert("some error occurred. Check the console.");
					console.log(response);
					});
	}// end load all matches

	this.loadAllMatches();
}])//end MatchController

//Declaration of SingleMatchController
myApp.controller('SingleMatchController',['$http','$routeParams',function($http,$routeParams){
	var main = this;
	this.baseUrl1 = url;
	main.key1 = $routeParams.key1;
	main.key2 = $routeParams.key2;
	main.date1 = $routeParams.date;

	this.loadSingleMatch = function(){
		$http({
			method: 'GET',
			url: main.baseUrl1
		}).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          	jQuery.each(response.data.rounds,function(i,val1){
				jQuery.each(response.data.rounds[i].matches,function(j,val2){
					if(val2.team1.key==main.key1 && val2.team2.key==main.key2 && val2.date==main.date1)
					{
						main.singleMatch = val2;
						if(main.singleMatch.score1 == main.singleMatch.score2)
						{
							$('.matchStatus').text(main.singleMatch.team1.name + ' tied the game with ' + main.singleMatch.team2.name);
							$('#lblDetail1').html("DRAWN");
							$('#lblDetail2').html("DRAWN");
							$('#team1Status').addClass('orange');
							$('#team2Status').addClass('orange');

						}
						else if(main.singleMatch.score1 > main.singleMatch.score2)
						{
							$('.matchStatus').text(main.singleMatch.team1.name+' won the game '+main.singleMatch.score1+'-'+main.singleMatch.score2+' against '+main.singleMatch.team2.name);
							$('#lblDetail1').html("WINNER");
							$('#lblDetail2').html("LOSER");
							$('#team1Status').addClass('green');
							$('#team2Status').addClass('red');
						}
						else
						{
							$('.matchStatus').text(main.singleMatch.team2.name+' won the game '+main.singleMatch.score2+'-'+main.singleMatch.score1+' against '+main.singleMatch.team1.name);
							$('#lblDetail2').html("WINNER");
							$('#lblDetail1').html("LOSER");
							$('#team2Status').addClass('green');
							$('#team1Status').addClass('red');
						}
						$('#goalScore').text(main.singleMatch.score1 + ' - ' + main.singleMatch.score2);
					}
				})
			});
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert("some error occurred. Check the console.");
          console.log(response);
        });
	}// end load single match

	this.loadSingleMatch();
}]);//end SingleMatchController

//Declaration of AllMatchController
myApp.controller('AllMatchController',['$http',function($http){

	var main=this;
	this.allMatch = [];

  	main.selectTeam = [];
  	main.selectScore = [];
  	main.selectYear = [];
  	main.filterTeamName;
  	main.filterScore;
  	main.filterYear;
  	main.filterCondition;

  	$('#leagueDropdown').on('change', function() {
  		main.teamSelected('Select a Team');
		main.scoreSelected('Select a Score');
		main.yearSelected('Select a Year');
		if(this.value == 2015){
			main.loadMatchDetails(league2015URL);
		}
		else if(this.value == 2016){
			main.loadMatchDetails(league2016URL);
		}
	})

  	main.loadMatchDetails = function(baseUrl1){
		$http({
				method: 'GET',
				url: baseUrl1
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					main.allMatch = [];
					for(i in response.data.rounds)
					{
						for(j in response.data.rounds[i].matches)
						{
							main.allMatch.push(response.data.rounds[i].matches[j])
						}
					}

					main.tempVar;
					jQuery.each(main.allMatch, function(i, el) {
						if(el.score1 == null && el.score2 == null){
							main.tempVar = i;
						}
					});
					main.allMatch.splice(main.tempVar, 1);

					var dupes = {};

					//Function to get unique team names
					main.selectTeam.length=0;
					jQuery.each(main.allMatch, function(i, el) {

					    if (!dupes[el.team1.name]) {
					        dupes[el.team1.name] = true;
					        main.selectTeam.push(el.team1.name);
					    }
					});
					main.selectTeam.sort();
					main.selectTeam.unshift("Select Team");

					//Function to get unique score values
					main.selectScore.length=0;
					jQuery.each(main.allMatch, function(i, el) {

					    if (!dupes[el.score2]) {
					        dupes[el.score2] = true;
					        main.selectScore.push(el.score2);
					    }
					});
					main.selectScore.sort();
					main.selectScore.unshift("Select Score");

					//Function to get unique year
					main.selectYear.length=0;
					jQuery.each(main.allMatch, function(i, el) {

					    if (!dupes[parseInt(el.date)]) {
					        dupes[parseInt(el.date)] = true;
					        main.selectYear.push(parseInt(el.date));
					    }
					});
					main.selectYear.unshift("Select Year");
					
					//Function to filter data by selected team
					$('#chooseTeam').html(main.selectTeam[0]);
					main.selectedTeamByDropdown = "";
					main.teamSelected = function (item) {
						if(item=="Select a Team")
						{
							main.filterTeamName="";
							$('#chooseTeam').html(main.selectTeam[0]);
						}
						else
						{
				        	main.selectedTeamByDropdown = item;
				        	$('#chooseTeam').html(main.selectedTeamByDropdown);
				        	main.filterTeamName=main.selectedTeamByDropdown;
				    	}
				    }

				    //Function to filter data by selected score
				    $('#chooseScore').html(main.selectScore[0]);
					main.selectedScoreByDropdown = "";
					main.scoreSelected = function (item) {
						if(item=="Select a Score")
						{
							$('#chooseScore').html(main.selectScore[0]);
							main.filterScore="";
							main.filterCondition = false;
						}
						else
				        {
					        main.selectedScoreByDropdown = item;
					        $('#chooseScore').html(main.selectedScoreByDropdown);
					        main.filterScore=main.selectedScoreByDropdown;
					        main.filterCondition = true;
					    }
				    }

					    //Function to filter data by selected year
					    $('#chooseYear').html(main.selectYear[0]);
						main.selectedYearByDropdown = "";
						main.yearSelected = function (item) {
							if(item=="Select a Year")
							{
								main.filterYear="";
								$('#chooseYear').html(main.selectYear[0]);
							}
							else
					        {
						        main.selectedYearByDropdown = item;
						        $('#chooseYear').html(main.selectedYearByDropdown);
						        main.filterYear=main.selectedYearByDropdown;
						    }
					    }
					}, function errorCallback(response) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						alert("some error occurred. Check the console.");
						console.log(response);
					});
	}// end load match details

	this.loadMatchDetails(league2015URL);
	$('#dropdownTeam').hide();
	$('#dropdownScore').hide();
	$('#dropdownYear').hide();

	main.optionSelected = function(num)
	{
		if(num==1){
			$('#dropdownTeam').toggle();
			$('#chooseTeam').html(main.selectTeam[0]);
			main.filterTeamName="";
		}
		else if(num==2){
			$('#dropdownScore').toggle();
			$('#chooseScore').html(main.selectScore[0]);
			main.filterScore="";
			main.filterCondition=false;
		}
		else if(num==3){
			$('#dropdownYear').toggle();
			$('#chooseYear').html(main.selectYear[0]);
			main.filterYear="";
		}
	}
	
}]);

//Declaration of TeamStatsController
myApp.controller('TeamStatsController',['$http', function($http){

	var main=this;

  	main.allMatch = [];
  	main.selectTeamStats = [];
  	main.teamStatsArray = [];
  	main.objTeamStatistics = {};
  	main.teamMatchesHistory = [];
  	main.objTemp = {};
  	
  	$('#dropdownLeague').on('change', function() {
  		$("#divEachTeamStats").removeClass('ng-show');
    	$("#divEachTeamStats").addClass('ng-hide');
    	$("#allTeamStats").removeClass('ng-hide');
    	$("#allTeamStats").addClass('ng-show');

		if(this.value == 2015){
			main.loadTeamStatistics(league2015URL);
		}
		else if(this.value == 2016){
			main.loadTeamStatistics(league2016URL);
		}
	})

  	main.loadTeamStatistics = function(baseurl){
		$http({
				method: 'GET',
				url: baseurl
				}).then(function successCallback(response) {
					main.allMatch = [];
					//Get all matches
					for(i in response.data.rounds)
					{
						for(j in response.data.rounds[i].matches)
						{
							main.allMatch.push(response.data.rounds[i].matches[j])
						}
					}

					main.tempVar;
					jQuery.each(main.allMatch, function(i, el) {
						if(el.score1 == null && el.score2 == null){
							main.tempVar = i;
						}
					});
					main.allMatch.splice(main.tempVar, 1);
					main.totalMatches=main.allMatch.length;

					//Get all team names
					var dupes1 = {};
					main.selectTeamStats.length = 0;
					jQuery.each(main.allMatch, function(i, el) {

					    if (!dupes1[el.team1.name]) {
					        dupes1[el.team1.name] = true;
					        main.selectTeamStats.push(el.team1.name);
					    }
					});
					main.selectTeamStats.sort();
					main.totalTeams = main.selectTeamStats.length;
					main.selectTeamStats.unshift("Select a Team");

					//Function to show team statistics details by selected team
					$('#chooseTeamStats').html(main.selectTeamStats[0]);
					main.ddlTeamStats;
					main.teamSelectedForStats = function (item) {
						if(item=="Select a Team")
						{
							$('#chooseTeamStats').html(main.selectTeamStats[0]);
							$("#divEachTeamStats").removeClass('ng-show');
				        	$("#divEachTeamStats").addClass('ng-hide');
				        	$("#allTeamStats").removeClass('ng-hide');
				        	$("#allTeamStats").addClass('ng-show');
						}
						else
						{
				        	main.ddlTeamStats = item;
				        	$('#chooseTeamStats').html(main.ddlTeamStats);
				        	main.eachTeamStats = main.objTeamStatistics[item];
				        	$("#divEachTeamStats").removeClass('ng-hide');
				        	$("#divEachTeamStats").addClass('ng-show');
				        	$("#allTeamStats").removeClass('ng-show');
				        	$("#allTeamStats").addClass('ng-hide');
				    	}
				    }// end of function teamSelectedforStats

					//Function to get statistics for each team
					main.objTeamStatistics = {};
					jQuery.each(main.selectTeamStats, function(i, team) {
						jQuery.each(main.allMatch, function(j, match) {
							 if(match.team1.name == team || match.team2.name == team)
							{
								main.teamStatsArray.push(match);
							}
						});
						main.objTeamStatistics[team]=main.teamStatsArray;
						main.teamStatsArray=[];
					});

					//Function to get each team matches history
					main.teamScore;
					main.oppTeamScore;
					main.totalMatchCount = 0;
					main.teamMatchesHistory.length = 0;
					 jQuery.each(main.objTeamStatistics, function(i, val1) {
					 	main.totalMatchCount = val1.length;
					 	main.winCount = 0;
					 	main.tieCount = 0;
					 	main.lostCount = 0;
					 	main.totalGoals = 0;
					 	main.goalsAgainst = 0;
					 	main.objTemp = {};
						jQuery.each(val1, function(j, val2) {
							if(val2.team1.name == i){
								main.teamScore = val2.score1;
								main.oppTeamScore = val2.score2;
								main.totalGoals += val2.score1;
								main.goalsAgainst += val2.score2;
							}
							else if(val2.team2.name == i){
								main.teamScore = val2.score2;
								main.oppTeamScore = val2.score1;
								main.totalGoals += val2.score2;
								main.goalsAgainst += val2.score1;
							}
							if(main.teamScore > main.oppTeamScore){
								main.winCount = main.winCount+1;
							}
							if(main.teamScore == main.oppTeamScore){
								main.tieCount = main.tieCount+1;
							}
							if(main.teamScore < main.oppTeamScore){
								main.lostCount = main.lostCount+1;
							}
						});
						main.objTemp["team"] = i;
						main.objTemp["total"] = main.totalMatchCount;
						main.objTemp["win"] = main.winCount;
						main.objTemp["lose"] = main.lostCount;
						main.objTemp["tie"] = main.tieCount;
						main.objTemp["goals"] = main.totalGoals;
						main.objTemp["goalsAgainst"] = main.goalsAgainst;
						main.objTemp["goalsDiff"] = main.totalGoals-main.goalsAgainst;
						main.objTemp["points"] = main.winCount*3 + main.tieCount;
						main.teamMatchesHistory.push(main.objTemp);
					 });
					 main.teamMatchesHistory.shift();

					}, function errorCallback(response) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						alert("some error occurred. Check the console.");
						console.log(response);
					});
	} // end load team statistics

	this.loadTeamStatistics(league2015URL);
}])