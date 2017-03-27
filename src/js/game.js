/**
Handles all pre-defined games logic, which are the start/target sites availble
within the easy-mode of the game.
*/
wikimania.controller('wikimania-game-gui-controller', function ($scope, wikipediaAPI, game) {
    const gamesFilePath = "src/assets/games.json";
    const fs = require('fs');

    //Initiate a new game
    $scope.initiateSimpleGame = function() {
      //Retrieve the clicked list elements
      let startPoint = document.querySelector("#easy-starts .clicked");
      let targetPoint = document.querySelector("#easy-ends .clicked");
      let startID = startPoint.getAttribute("data-id");
      let targetID = targetPoint.getAttribute("data-id");
      console.log(startID);
      console.log(targetID);

      if(typeof startID !== 'undefined' && typeof targetID !== 'undefined') {
        //Get controller to start a new game
        game.startGame(parseInt(startID), parseInt(targetID));
        //Load the new section
        openSection("wikipedia-content");
      }
    }

    //Injects the game list into a specified container.
    //Excpects the id of the container as a string for instance "#container-id"
    $scope.generateGameList = function(container){
      let presavedGames = JSON.parse(fs.readFileSync(gamesFilePath, 'utf8'));
      let presavedGamesKeys = Object.keys(presavedGames["games"]);

      //Populate the containers with the games list
      presavedGamesKeys.forEach((key) => {
        let id = getArticleID(key);
        wikipediaAPI.IDToTitle(id, (title, error) => {
          if(error) throw new Error("Failed to convert id: " + id + " to title.");
          let titleContainer = document.createElement("p");

          titleContainer.classList.add("article-container");
          titleContainer.setAttribute('data-id', id);
          titleContainer.setAttribute('onclick', 'highlightElement(this)');
          titleContainer.innerHTML = title;
          let viewportContainer = document.querySelector(container);
          viewportContainer.append(titleContainer);
        });
      });
    };

    //Returns an article ID from the pre-defined games list
    function getArticleID(key){
      let presavedGames = JSON.parse(fs.readFileSync(gamesFilePath, 'utf8'));
      let currentKey = presavedGames["games"][key];
      if(typeof currentKey === 'undefined') throw new Error("No article id for for key: " + key);
      return currentKey;
    };
});
