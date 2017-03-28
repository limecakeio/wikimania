let wikimaniaGame = null;

const initiateChallenge = (startID, endID) => {
  if(typeof startID !== 'undefined' && typeof endID !== 'undefined') {
    wikimaniaGame.startGame(parseInt(startID), parseInt(endID));
    openSection('wikipedia-content');
  }
}

/**
Handles all pre-defined games logic, which are the start/target sites availble
within the easy-mode of the game.
*/
wikimania.controller('wikimania-game-gui-controller', function ($scope, wikipediaAPI, game) {
    const gamesFilePath = "src/assets/games.json";
    const fs = require('fs');

    if(wikimaniaGame === null) {
      wikimaniaGame = game;
    }

    const hardMode = {
      from: 0,
      to: 0
    };

    //Initiate a new simple game
    $scope.initiateSimpleGame = function() {
      //Retrieve the clicked list elements
      let startPoint = document.querySelector("#easy-starts .clicked");
      let targetPoint = document.querySelector("#easy-ends .clicked");
      console.log(startPoint);
      console.log(targetPoint);

      //Ensure user has selected both a start and target article
      if(startPoint !== null && targetPoint !== null) {
        //Retrieve the article IDs
        let startID = startPoint.getAttribute("data-id");
        let targetID = targetPoint.getAttribute("data-id");
        //Get controller to start a new game
        game.startGame(parseInt(startID), parseInt(targetID));
        //Load the new section
        openSection("wikipedia-content");
      }
    }

    //Generate new hard random game articles
    $scope.prepareHardGame = function() {      //Arrange start article
      wikipediaAPI.getRandomArticleTitle((title, error) => {
        let startTitle = document.createElement("p");
        startTitle.innerHTML = title;
        wikipediaAPI.titleToID(title, (id, error) => {
          hardMode.from = id;
          startTitle.setAttribute('data-id', id);
          let hardStart = document.querySelector("#hard-start");
          hardStart.innerHTML = '';
          hardStart.append(startTitle);
        });
        //Arrange target article
        wikipediaAPI.getRandomArticleTitle((title, error) => {
          let targetTitle = document.createElement("p");
          targetTitle.innerHTML = title;
          wikipediaAPI.titleToID(title, (id, error) => {
            hardMode.to = id;
            targetTitle.setAttribute('data-id', id);
            let hardFinish = document.querySelector("#hard-finish");
            hardFinish.innerHTML = '';
            hardFinish.append(targetTitle);
          });
        });
    });
  };

  $scope.initiateHardGame = () => {
    //Retrieve the clicked list elements
    let startPoint = document.querySelector("#hard-start");
    let targetPoint = document.querySelector("#hard-finish");
    console.log(startPoint);
    console.log(targetPoint);

    //Ensure user has selected both a start and target article
    if(startPoint !== null && targetPoint !== null) {
      //Retrieve the article IDs
      let startID = hardMode.from;
      let targetID = hardMode.to;
      //Get controller to start a new game
      game.startGame(parseInt(startID), parseInt(targetID));
      //Load the new section
      openSection("wikipedia-content");
    }
  };

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

    $scope.reset = (section) => {
      game.articleCounter = 0;
      if (typeof section !== 'undefined') {
        openSection(section)
      }
    };

    $scope.model = game;
   game.setNode('wikipedia-article');
});
