wikimania.controller('wikimania-player-controller', function ($scope, wikipediaAPI) {
  const userFilePath = "src/assets/user.json";
  const fs = require('fs');

  //Check if player name is set before game starts
  $scope.enterNewGame = function() {
    if(playerIsSet()) {
      openSection('difficulty-selection');
    } else {
      openSection('naming-screen');
    }
  };

  //Sets the player in the user.json file
  $scope.setPlayer = function(){
    let playerName = document.querySelector("#name-field").value;
    console.log(playerName);
    if(playerName.length > 0) {
      let player = getPlayer();
      player["user"] = playerName;
      fs.writeFileSync(userFilePath, JSON.stringify(player));
      openSection('game-rules-popup');
    }
  };

  //Returns the player object in JSON notation
  function getPlayer() {
    return JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
  };

  //Returns true if a player has been set and false if not
  function playerIsSet() {
    let player = getPlayer();
    let playerValue = player["user"];
    return (typeof playerValue !== 'undefined');
  };
});
