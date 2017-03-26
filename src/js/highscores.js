angular.module('wikimania',[]).controller('wikimania-hs-controller', function ($scope, $timeout, $window, $http) {
  const highscoreFilePath = "src/assets/highscores.json";
  const userFilePath = "src/assets/user.json";
  const fs = require('fs');

  //TODO ONLY FOR TESTING PURPOSES SHOULD INTEGRATE HIGHSCORES INTO THE MAIN CONTROLLER!
  const IDToTitle = function(id) {
    return $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=query&format=json&pageids=' + id
    }).then(function successCallback(response) {
      return response.data.query.pages['' + id].title;
    }, function errorCallback(response) {
      console.log('something went wrong');
      return 'err';
    });
  };

  $scope.getAllHighscores = function() {
    //Load the current highscores
    let highscores = JSON.parse(fs.readFileSync(highscoreFilePath, 'utf8'));

    //Set up the highscore container for display in the front-end
    let highscoresContainer = document.createElement("div");
    highscoresContainer.classList.add("hs-container");

    let games = Object.keys(highscores["games"]);
    //Every game is to be displayed in its own table.
    games.forEach((game) => {
      //Get the IDS for the start site and target site of the current came
      let gameList = game.split("_");
      let start;
      let finish;
      IDToTitle(gameList[0]).then((startSite) => {
        start = startSite;
        IDToTitle(gameList[1]).then((targetSite) => {
          finish = targetSite;

          //Create the game's title
          let tableTitle = document.createElement("h3");
          tableTitle.textContent = start + " => " + finish;
          highscoresContainer.append(tableTitle);

          //Display the hall-of-fame in a table
          let gameTable = document.createElement("table");
          gameTable.classList.add("game-container");

          //Set up the table's headings
          let positionCell = document.createElement("th");
          positionCell.innerHTML="Position";
          gameTable.append(positionCell);

          let dateCell = document.createElement("th");
          dateCell.innerHTML="Date";
          gameTable.append(dateCell);

          let playerCell = document.createElement("th");
          playerCell.innerHTML="Player";
          gameTable.append(playerCell);

          let stepsCell = document.createElement("th");
          stepsCell.innerHTML="Steps";
          gameTable.append(stepsCell);

          //Load the highscores for this game
          let scores = highscores["games"][game]["highscores"];

          //Create a table row for each highscore data element and populate it
          let i = 0;
          scores.forEach((score) => {
            let tableRow = document.createElement("tr");

            let positionData = document.createElement("td");
            positionData.innerHTML= i+1;
            tableRow.append(positionData);

            let dateData = document.createElement("td");
            let date = new Date(score[0]);
            let formattedDate = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
            dateData.innerHTML=formattedDate;
            tableRow.append(dateData);

            let playerData = document.createElement("td");
            playerData.innerHTML=score[1];
            tableRow.append(playerData);

            let stepsData = document.createElement("td");
            stepsData.innerHTML=score[2];
            tableRow.append(stepsData);

            gameTable.append(tableRow);
            ++i;
          });
          highscoresContainer.append(gameTable);

          //Inject the highscores into the view
          let highscoreView = document.querySelector("#finish-selection-easy");
          //Reset the view prior to injecting new data
          highscoreView.innerHTML = "";
          highscoreView.append(highscoresContainer);
        });
      });
    });
  };

  //Saves the game's end score to the highscores.json file
  const saveHighscore = function() {
    let startID = 287816;
    let endID = 2166425;
    //Create the highscore for the current game
    let newHighscore = [];

    //Set the date of the game
    newHighscore[0] = Date.now();

    //Set the player
    let player = getPlayer();
    if(typeof player["user"] !== 'undefined') {
      newHighscore[1] = player["user"];
    } else {
      //TODO What if no name was ever set?
    }

    //Set the steps taken from start to finish
    newHighscore[2] = 5; //TODO has to reflect the actual steps!

    //Grab the highscore file to add the new score to it
    let highscores = JSON.parse(fs.readFileSync(highscoreFilePath, 'utf8'));
    if(typeof highscores["games"]['' + startID + '_' + endID] === 'undefined') {
        highscores["games"]['' + startID + '_' + endID] = {};
        highscores["games"]['' + startID + '_' + endID]["highscores"] = []
    }
    //Add the new highscore
    highscores["games"]['' + startID + '_' + endID]["highscores"].push(newHighscore);
    //Make sure the scores are sorted
    highscores["games"]['' + startID + '_' + endID]["highscores"].sort(sortHighscores);
    //Only keep the top ten results
    highscores["games"]['' + startID + '_' + endID]["highscores"] = highscores["games"]['' + startID + '_' + endID]["highscores"].slice(0, 10);

    //Save the highscore file
    fs.writeFileSync(highscoreFilePath, JSON.stringify(highscores));
  }
  saveHighscore();

  //Sorts array of arrays smallest to largest dependent on the amount of steps
  //a player used, which are stored in the third position of the score-array
  function sortHighscores(scoreA, scoreB) {
    if(scoreA[2] < scoreB[2]) {
       return -1;
    }
    if(scoreA[2] > scoreB[2]) {
      return 1;
    }
    return 0;
  }

  //Sets the user in the user.json file
  function setPlayer(name){
    let player = getPlayer();
    console.log(player);
    player["user"] = name;
    fs.writeFileSync(userFilePath, JSON.stringify(player));
  }

  //Returns the player object in JSON notation
  function getPlayer() {
    return JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
  }
});
