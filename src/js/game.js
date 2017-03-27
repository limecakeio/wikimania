wikimania.factory('wikipediaAPI', wikipediaAPI => {

  const fs = require('fs');

  let game = {};

  let articles = [];

  let goalArticle = null;

  let difficultiy = 0;

  let activeArticle = null;

  let gameEnd = false;

  game.setStartArticle = identifier => {
    wikipediaAPI.getArticle(identifier, (article, error) => {
      if (error !== null) {

      }
    });
  };

  game.setEndArticle = identifier => {

  };

  game.startGame = (startID, endID) => {

  };

  game.getPreviewForLink = title => {

  };

  game.end = () => {
    return gameEnd;
  };

  const loadAssests = () => {

  };

  loadAssests();

  return game;
});
