wikimania.controller('wikimania-player-controller', function ($scope, wikipediaAPI) {
  const userFilePath = "src/assets/user.json";
  const fs = require('fs');
  //Sets the player in the user.json file
  function setPlayer(name){
    let player = getPlayer();
    player["user"] = name;
    fs.writeFileSync(userFilePath, JSON.stringify(player));
  };

  //Returns the player object in JSON notation
  function getPlayer() {
    return JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
  };

  //Returns true if a player has been set and false if not
  function playerIsSet() {
    return (typeof getPlayer() !== 'undefined');
  };
  console.log("Player is set: ", playerIsSet());
})
