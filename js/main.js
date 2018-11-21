var teamsSorted = [];
var teams = [];
var teamsSerie = [];
(function(){

    function showStats() {
        var list = document.createElement("ul");
        // Counter for total goals in the season
        var goals = 0;
        // Array with a sum of goals each match
        var goalsEachMatch = [];
        // Array for calculating the standard deviation
        var eachDeviation = [];
        // Counter for total matches in the season
        var matches = 0;
        window.mainContainer = document.createElement("main");
        window.mainContainer.className = "container";
        window.mainContainer.innerHTML = "";
        window.mainContainer.appendChild(list);
        // Open and read JSON-file with season data
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            console.log(data);
            data.rounds.forEach(function(round) {
                round.matches.forEach(function(match) {
                    // Loops into each match in each round
                    matches++;
                    // Sums total goals in each match
                    goals += match.score1 + match.score2;
                    goalsEachMatch.push(match.score1 + match.score2);
                });
            });
            var totalGoals = document.getElementById("totalGoals");
            var totalMatches = document.getElementById("totalMatches");
            var arithmeticMean = document.getElementById("arithmeticMean");
            var standardDeviation = document.getElementById("standardDeviation")
            totalMatches.textContent = "Antal matcher: " + matches;
            totalGoals.textContent = "Antal mål: " + goals;

            var mean = (goals / matches);
            goalsEachMatch.forEach(function(goal) {
                eachDeviation.push(Math.pow((goal - mean), 2));
            });
            //console.log(eachDeviation);
            var meanRounded = Math.round(mean * 100) / 100;
            var sum = eachDeviation.reduce(function(a, b) { return a + b; }, 0);
            var deviation = Math.sqrt(sum / matches);
            var deviationRounded = Math.round(deviation * 100) / 100;
            arithmeticMean.textContent = "Aritmetiska medelvärdet av antalet mål gjorda per match: " + meanRounded;
            standardDeviation.textContent = "Standardavvikelsen för antalet mål gjorda per match: " + deviationRounded;
            encodeURIComponent(totalGoals.textContent);
        });
    }

    function drawTable() {
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            //console.log(data);
            data.rounds.forEach(function(round) {
                round.matches.forEach(function(match) {
                    var teamName = match["team1"]["name"];
                    var teamName2 = match["team2"]["name"];

                    if (teamName in teams) {
                        teams[teamName] += match["score1"];
                    } else {
                        teams[teamName] = match["score1"];
                        //teams.push({name: teamName, goals: match["score1"]});
                    }

                    if (teamName2 in teams) {
                        teams[teamName2] += match["score2"];
                    } else {
                        teams[teamName2] = match["score2"];
                        //teams.push({name: teamName2, goals: match["score2"]});
                    }
                });
            });

            teamsSorted = Object.keys(teams).map(function (key) {
                  return [key, teams[key]];
              });
            teamsSorted.sort(function (a, b) {
              return b[1] - a[1];
            });

            //console.log(teamsSorted);
            var table = document.getElementById("table");
            var count = 0;
            for (var i = 0; i < teamsSorted.length; i++) {
                var row = table.insertRow(count+1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = teamsSorted[i][0];
                cell2.innerHTML = teamsSorted[i][1];
                cell3.innerHTML = "&#9917;";
                cell3.className = "balls";
                for (var j = 1; j < teamsSorted[i][1]; j++) {
                cell3.innerHTML += "&#9917;";
                }
                count++;
            };
            console.log(teams);
        });

    }

    function showTop3() {
        var teams2 = [];
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            //console.log(data);
            data.rounds.forEach(function(round) {
                round.matches.forEach(function(match) {
                    var teamName = match["team1"]["name"];
                    var teamName2 = match["team2"]["name"];

                    if (teamName in teams2) {
                        teams2[teamName] += match["score2"];
                    } else {
                        teams2[teamName] = match["score2"];
                    }

                    if (teamName2 in teams2) {
                        teams2[teamName2] += match["score1"];
                    } else {
                        teams2[teamName2] = match["score1"];
                    }
                });
            });

            var teamsSorted2 = [];

            teamsSorted2 = Object.keys(teams2).map(function (key) {
                  return [key, teams2[key]];
              });
            teamsSorted2.sort(function (a, b) {
              return a[1] - b[1];
            });

            //console.log(teamsSorted);
            var table = document.getElementById("table2");
            var count = 0;
            for (var i = 0; i < 3; i++) {
                var row = table.insertRow(count+1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = teamsSorted2[i][0];
                cell2.innerHTML = teamsSorted2[i][1];
                count++;
            };
        });
    }

    function teamWinOrTied(team) {
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            //console.log(data);
            var countGames = 0;
            var countWinOrTie = 0;
            var countLost = 0;
            data.rounds.forEach(function(round) {
                var teams3 = [];

                round.matches.forEach(function(match) {

                    if (match["team1"]["name"] == team) {
                        countGames++;
                        if (match["score1"] >= match["score2"]) {
                            countWinOrTie++;
                        } else {
                            countLost++;
                        }
                    } else if (match["team2"]["name"] == team) {
                        countGames++;
                        if (match["score2"] >= match["score1"]) {
                            countWinOrTie++;
                        } else {
                            countLost++;
                        }
                    }
                });
            });
            var procentWinOrTied = Math.round(countWinOrTie / countGames * 100) + "%";
            console.log(procentWinOrTied);
            var procentWinOrTiedText = document.getElementById("teamWinOrTied")
            procentWinOrTiedText.textContent = "Sannolikhet att Liverpool vann eller spelade oavgjort baserat på säsongen: " + procentWinOrTied;
        });
    }

    function teamWin2OrMore(team) {
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            //console.log(data);
            var countGames = 0;
            var score2OrMore = 0;
            var countLost = 0;
            data.rounds.forEach(function(round) {
                var teams3 = [];

                round.matches.forEach(function(match) {

                    if (match["team1"]["name"] == team) {
                        countGames++;
                        if (match["score1"] >= 2) {
                            score2OrMore++;
                        } else {
                            countLost++;
                        }
                    } else if (match["team2"]["name"] == team) {
                        countGames++;
                        if (match["score2"] >= 2) {
                            score2OrMore++;
                        } else {
                            countLost++;
                        }
                    }
                });
            });
            var procentScore2OrMoreRes = Math.round(score2OrMore / countGames * 100) + "%";
            var procentScore2OrMore = document.getElementById("procentScore2OrMore")
            procentScore2OrMore.textContent = "Sannolikhet att Liverpool gjorde 2 eller fler mål: " + procentScore2OrMoreRes;
        });
    }
    function drawEndSerie() {
        teams = [];
        fetch("../../material/pl/pl-1415.json").then(function (response) {
            return response.json();
        }).then(function(data) {
            // Console.log for checking that we got all data from JSON-file
            //console.log(data);

            data.rounds.forEach(function(round) {
                round.matches.forEach(function(match) {
                    var teamName = match["team1"]["name"];
                    var teamName2 = match["team2"]["name"];

                    if (teamName in teams) {
                        if (match["score1"] > match["score2"]) {
                            teams[teamName] += 3;
                        } else if (match["score1"] === match["score2"]) {
                            teams[teamName] += 1;
                        }
                    } else {
                        if (match["score1"] > match["score2"]) {
                            teams[teamName] = 3;
                        } else if (match["score1"] === match["score2"]) {
                            teams[teamName] = 1;
                        }
                    }

                    if (teamName2 in teams) {
                        if (match["score2"] > match["score1"]) {
                            teams[teamName2] += 3;
                        } else if (match["score2"] === match["score1"]) {
                            teams[teamName2] += 1;
                        }
                    } else {
                        if (match["score2"] > match["score1"]) {
                            teams[teamName2] = 3;
                        } else if (match["score1"] === match["score2"]) {
                            teams[teamName2] = 1;
                        }
                    }
                });
            });

            teamsSorted = Object.keys(teams).map(function (key) {
                  return [key, teams[key]];
              });
            teamsSorted.sort(function (a, b) {
              return b[1] - a[1];
            });

            //console.log(teamsSorted);
            var table = document.getElementById("table3");
            var count = 0;
            for (var i = 0; i < teamsSorted.length; i++) {
                var row = table.insertRow(count+1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = teamsSorted[i][0];
                cell2.innerHTML = teamsSorted[i][1];
                count++;
            };
            console.log(teamsSorted);
        });
    }

    showStats();
    showTop3();
    drawTable();
    teamWinOrTied("Liverpool");
    teamWin2OrMore("Liverpool");
    drawEndSerie();
})();
