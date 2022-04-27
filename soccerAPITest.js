function soccerAPITest(){ 
    const SOCCER_URL = "https://api-football-v1.p.rapidapi.com/v3/";  
    const options = {
	    method: 'GET',
    	headers: {
	    	'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
		    'X-RapidAPI-Key': '44a15a6015msh8e4a362dcffd431p16f115jsn5aacda723577'
	    }
    };
    //const SEASON = 2022;
    let div = document.getElementById("dropdown_contents");
    div.setAttribute("league_counter", 0)
    searchSoccerCountries()
            .then(function(data){
                console.log(data);
                dropDownCountries(data);
            });

    function dropDownCountries(data){
        let div  = document.getElementById("dropdown_contents");
        let league_counter = div.getAttribute("league_counter")
        let i = 0;
        let countries = data.results;
        while(i  < countries){
            let a = document.createElement('a');
            let name = data.response[i].name;
            a.innerHTML = name;
            a.addEventListener("click", ()=> {
                getCountryLeagues(name, league_counter, 0);
                });
            div.appendChild(a);
            
            i = i + 1;
        }
    }

    function getCountryLeagues(name, i,first){
        searchSoccerLeagues(name)
                .then (function(data){
                    console.log(data);
                    if(first === 0){
                        let div = document.getElementById("dropdown_contents");   
                        div.setAttribute("number_of_leagues", data.results);
                    }
                    console.log("searching League");
                    displayLeagues(data, i);
                    console.log("doneDisplayingLeagues");
                });
    }

    function displayLeagues(data, i){
        console.log("DisplayLeagues");
        let div = document.getElementById("leagues");
        let div2 = document.getElementById("dropdown_contents");
        let results = parseInt(div2.getAttribute("number_of_leagues"));
        console.log("results" , results);
        console.log("i" , i);
        removeAllChildNodes(div);
        i = parseInt(i);
        let end = 0;
        if(results > 20){
            end = 20;
            results =  results - 20;
        }else{
            end = results;
            results =  results - end;
        }
        console.log("after subtraction"+ results)
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        thead.innerHTML = "<tr><th>"+ data.parameters.country +" Leagues</th></tr>"
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        while(end > 0){
            let tr = document.createElement("tr");
            tr.innerHTML = "<td><img alt = 'Leagues Logo' src =" + data.response[i].league.logo + ">" + data.response[i].league.name + "</td>";
            tr.setAttribute("i", i)
            tr.addEventListener("click", ()=>{
                let q = tr.getAttribute("i");
                div2.setAttribute("league_id", data.response[q].league.id);
                let y = -1;
                let current = false;
                while(current != true){
                    y = y + 1;
                    if(data.response[q].seasons[y].current === true){
                        current = true;
                    }
                }
                div2.setAttribute("league_year",data.response[q].seasons[y].year);
                div2.setAttribute("league_name",data.response[q].league.name);
                div2.setAttribute("league_logo",data.response[q].league.logo);
                findTeams();
            });

            tbody.appendChild(tr);
            i = i + 1;
            end = end - 1;
        }
        table.appendChild(tbody);
        div.appendChild(table);
        div2.setAttribute("number_of_leagues", results);
        div2.setAttribute("league_counter", i);
        div.setAttribute("league_country", data.parameters.country);
        //console.log(div2.getAttribute("league_counter"));
        makeButtonLeague(-1, "Last 20", div, div2);
        makeButtonLeague(1, "Next 20", div, div2);
    }
    
    function findTeams(){
        console.log("This is find teams link");
        let div = document.getElementById("dropdown_contents");
        let id = div.getAttribute("league_id");
        let year = div.getAttribute("league_year");
        //let name = div.getAttribute("league_name");
        //let logo = div.getAttribute("league_logo");
        console.log(year);
        console.log(id);
        //console.log(name);
        searchSoccerTeams(id, year)
                .then (function(data){
                    console.log(data);
                    console.log(data.results);
                    displayTeams(data);
                });
    }

    function findTeamInfo(){
        console.log("This is team info");
        let div = document.getElementById("dropdown_contents");
        let league_id = div.getAttribute("league_id");
        let year = div.getAttribute("league_year");
        let team_id = div.getAttribute("team_id");
        searchSoccerTeamsInfo(league_id, team_id, year)
            .then(function(data){
                console.log(data);
                displayTeam_Info(data);
            })
    }

    function findTeamSquad(){
        console.log("This is team squad");
        let div = document.getElementById("dropdown_contents");
        let id = div.getAttribute("team_id");
        searchSoccerTeamSquad(id)
            .then(function(data){
                console.log(data);
                if(data.results > 0){
                    displaySquad(data);
                }else{
                    window.alert("NO SQUAD IN Data");
                }
            })
    }

    function findStandings(id, year){
        console.log("findsStandings");
        searchSoccerStandings(id, year)
            .then(function(data){
                if(data.results ===0){
                    window.alert("No Standings for this League")
                }else{
                    displayStandings(data);
                }
            });
    }

    function displayStandings(data){
        console.log(data);
        let div = document.getElementById("dropdown_contents");
        let div2 =  document.getElementById("leagues");
        let q = 0;
        while(q < data.response[0].league.standings.length){
        let table = document.createElement("table");
        table.className= "standings";
        let thead = document.createElement("thead");
        thead.className= "red";
        let p = document.createElement("p");
        p.innerHTML = data.response[0].league.name + " Standings";
        thead.innerHTML = "<tr><td>Pos.</td><td>Club</td><td>P</td><td>W</td><td>D</td><td>L</td><td>GD</td><td>Points</td></tr>"
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        let i = 0;
        while(i < data.response[0].league.standings[q].length){
            let tr = document.createElement("tr");
            tr.innerHTML = "<td>"+ data.response[0].league.standings[q][i].rank +"</td>" +
                           "<td><img alt = 'Teams Logo' src =" + data.response[0].league.standings[q][i].team.logo + ">" + data.response[0].league.standings[q][i].team.name + "</td>" +
                           "<td>" + data.response[0].league.standings[q][i].all.played + "</td>"+
                           "<td>" + data.response[0].league.standings[q][i].all.win+ "</td>"+
                           "<td>" + data.response[0].league.standings[q][i].all.draw+ "</td>"+
                           "<td>" + data.response[0].league.standings[q][i].all.lose+ "</td>"+
                           "<td>" + data.response[0].league.standings[q][i].goalsDiff+ "</td>"+
                           "<td>" + data.response[0].league.standings[q][i].points+ "</td>";
            if(parseInt(data.response[0].league.standings[q][i].rank) < 4){
                tr.className = "top";
            }else{
                tr.className = "bottom";
            }
            i = i + 1;
            tbody.appendChild(tr);
            
            }
            q = q + 1;
        
        table.appendChild(tbody);
        div2.appendChild(table);
        }
    }

    function displaySquad(data){
        console.log("displaySquad");
        let div = document.getElementById('leagues');
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        thead.innerHTML = "<tr><th>Player Img</th><th>Player Name</th>" 
                        + "<th>Player Number</th><th>Position</th><th>Age</th></tr>"
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        let i = 0;
        while(i < data.response[0].players.length){
            let tr = document.createElement("tr");
            tr.innerHTML = "<td><img alt = 'Players Picture' src =" + data.response[0].players[i].photo + ">" +
                           "<td>" + data.response[0].players[i].name + "</td>"+
                           "<td>" + data.response[0].players[i].number+ "</td>"+
                           "<td>" + data.response[0].players[i].position+ "</td>"+
                           "<td>" + data.response[0].players[i].age+ "</td>"
            i = i + 1;
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        div.appendChild(table);
    }
    function displayTeam_Info(data){
        let div2 =  document.getElementById("leagues");
        //let body = document.getElementById("body");
        removeAllChildNodes(div2);
        console.log("DisplayTeam_Info")
        /*let img = document.createElement("img");
        img.src =  data.response.team.logo
        img.alt = "Team Logo"
        div2.appendChild(img);*/
        let p = document.createElement("p");
        p.className = "center";
        p.innerHTML=  data.response.team.name;
        div2.appendChild(p);
        makeP("Form: " + data.response.form + " Record : " + data.response.fixtures.wins.total + "-" + data.response.fixtures.draws.total + "-" + data.response.fixtures.loses.total , div2);
        makeP("Wins:" + " Home: " + data.response.fixtures.wins.home + " Away: " + data.response.fixtures.wins.away, div2);
        makeP("Draws:" + " Home: " + data.response.fixtures.draws.home + " Away: " + data.response.fixtures.draws.away, div2);
        makeP("Loses:" + " Home: " + data.response.fixtures.loses.home + " Away: " + data.response.fixtures.loses.away, div2);
        makeP("Largest Win: Home:" + data.response.biggest.wins.home + " Away: " + data.response.biggest.wins.away, div2);
        makeP("Largest Loss: Home:" + data.response.biggest.loses.home + " Away: " + data.response.biggest.loses.away, div2);
        findTeamSquad();
    }

    function displayTeams(data){
        let div = document.getElementById("dropdown_contents");
        let id = div.getAttribute("league_id");
        let year = div.getAttribute("league_year");
        let name = div.getAttribute("league_name");
        let logo = div.getAttribute("league_logo");
        let div2 =  document.getElementById("leagues");
        removeAllChildNodes(div2);
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        thead.innerHTML = "<tr><th><img src = " + logo + ">" + name + " " + year + "</th></tr>"
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        let i = data.results -1;
        let number = 0;
        while(i > -1){
            let tr = document.createElement("tr");
            while(number < 6 && i > -1){
                let td = document.createElement("td");
                td.innerHTML = "<img alt = 'Team Logo' src =" + data.response[i].team.logo + ">" + data.response[i].team.name;
                td.setAttribute("i", i)
                td.addEventListener("click", ()=>{
                    let q = td.getAttribute("i");
                    div.setAttribute("team_id", data.response[q].team.id);
                    findTeamInfo();
                });
                tr.appendChild(td);
                number = number + 1
                i = i - 1;
                console.log(i);
            }
            number = 0;
            tbody.appendChild(tr);
            console.log(i);
        }
        console.log("are we here")
        table.appendChild(tbody);
        div2.appendChild(table);
        console.log("end of display teams");
        findStandings(id, year);
        
    }

    function makeButtonLeague(direction, buttonText, parent, league){
        console.log("makeing button");
        let but = document.createElement('button');
        but.innerText = buttonText;
        let i = league.getAttribute("league_counter");
        let name = parent.getAttribute("league_country");
        let results = parseInt(league.getAttribute("number_of_leagues"));
        console.log("in Make button"+ results)
        but.addEventListener("click", ()=> {
            if(direction < 0 && i > 20){
                console.log("hit less results")
                console.log(i);
                //i is 20 here think beening saved up top as that number 
                i = parseInt(i) - 40; 
                results  = results + 40;
                league.setAttribute("number_of_leagues", results); 
                getCountryLeagues(name, i, 1);
            }else if(direction > 0 && results > 0){
                console.log("Hit More Results Button");
                console.log(i)
                getCountryLeagues(name, i, 1)
            }
            else{
                // Alert an error
                console.log("MADE PASSED THE NEXT AND LAST")
                if(direction < 0){
                    // alert an error that this is the start of the results
                    window.alert("Your at the start of results");
                }else{
                    // alert an error that there isn't anymore results
                    window.alert("Your at the end of results");
                }
            }
        });
        parent.appendChild(but);
    }

    function makeP(innerHTML, body){
        let p = document.createElement("p");
        p.innerHTML=  innerHTML;
        body.appendChild(p);
    }
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    /*function getLeaguesByCountry(){
    let country = "world";
    searchSoccerLeagues(country)
                .then(function(data){
                    console.log(data);
                });
    
 
    /*fetch('https://api-football-v1.p.rapidapi.com/v3/leagues', options)
	    .then(response => response.json())
	    .then(response => console.log(response))
	    .catch(err => console.error(err));*/

    
    
    async function searchSoccerLeagues(country){
        let url = SOCCER_URL + "leagues?country=" + country;//input look

        let results = await fetch(url, options);
        return await results.json();
    }
    async function searchSoccerCountries(){
        let results = await fetch('https://api-football-v1.p.rapidapi.com/v3/countries', options);
        return await results.json();
    }
    async function searchSoccerTeams(id, year){
        let url= SOCCER_URL + "teams?league="+ id +"&season="+ year;
        let results = await fetch(url,options);
        return await results.json();
    }

    async function searchSoccerStandings(id, year){
        let url= SOCCER_URL + "standings?season="+ year +"&league="+ id;
        let results = await fetch(url,options);
        return await results.json();
    }

    async function searchSoccerTeamsInfo(league_id, team_id, year){
        let url= SOCCER_URL + "teams/statistics?league="+ league_id + "&season=" + year + "&team=" + team_id;
        let results = await fetch(url,options);
        return await results.json();
    }
    async function searchSoccerTeamSquad(id){
        let url= SOCCER_URL + "players/squads?team="+ id;
        let results = await fetch(url,options);
        return await results.json();
    }
}