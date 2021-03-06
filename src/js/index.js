const wikimania = angular.module('wikimania',[]);
wikimania.factory('game', (wikipediaAPI, $window) => {
  const game = {};

  let contextNode = null;

  let highscoreController = null;

  game.setHighscoreController = (controller) => {
      highscoreController = controller;
  };

  game.setNode = (identifier) => {
    contextNode = document.querySelector('#' + identifier);
    if (contextNode === null) {
      throw new Error('no valid indentifier');
    }
  };

  game.activeArticle = {
    html: '',
    title: '',
    id: ''
  };

  let highscoreCallback = null;

  game.setHighscoreCallback = callback => {
      highscoreCallback = callback;
  };

  game.startArticle = null;

  game.articleCounter = 0;

  game.goalReached = false;

  game.articleArchive = [];

  game.endArticle = {
    title: '',
    html: '',
    preview: '',
    id: -1
  };

  game.setDifficultiy = diff => {
    difficultiy = diff;
  };

  game.startGameExpert = () => {
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.startArticle = article;
        game.activeArticle = article;
        contextNode.innerHTML = article.html;
        game.articleArchive = [];
        game.articleArchive.push(article);
      }
    });
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.endArticle.id = article.id;
        game.endArticle.title = article.title;
        game.endArticle.html = article.html;
      }
    });
  };

  /*
   * sets the activeArticle object with the argument startID
   * endArticle is saved internally
   */
  game.startGame = function(startID, endID) {
    wikipediaAPI.getArticle(startID, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.startArticle = article;
        game.articleArchive = [];
        game.articleArchive.push(article);
        game.activeArticle = article;
        contextNode.innerHTML = article.html;
        window.scrollTo(0, 0);
      }
    });
    wikipediaAPI.getArticle(endID, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.endArticle.id = article.id;
        game.endArticle.title = article.title;
        game.endArticle.html = article.html;
      }
    });
  };

  const checkArticle = function() {
    if (game.articleArchive[game.articleArchive.length - 1].id === game.endArticle.id) {
      game.goalReached = true;
      highscoreCallback(game.startArticle.id, game.endArticle.id);
      highscoreController.getAllHighscores();
      game.addArticleArchive('success-stations');
      openSection("success-screen");
      //game.reset();
    } else {
//      console.log(game.articleArchive[game.articleArchive.length - 1].id);
  //    console.log(game.endArticle.id);
    }
  };

  game.addArticleArchive = () => {
    let node = document.querySelector('#success-stations');
    node.innerHTML = '';
    game.articleArchive.forEach(article => {
      let element = document.createElement('p');
      element.innerHTML = article.title;
      node.append(element);
    });
  };

  const loadNewArticle = function(title) {
    wikipediaAPI.getArticle(title, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.activeArticle = article;
        game.articleCounter++;
        game.articleArchive.push(article);
        contextNode.innerHTML = article.html;
        checkArticle();
      }
    });
  };

  game.getRandomArticle = () => {
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        game.activeArticle = article;
        contextNode.innerHTML = article.html;
      }
    });
  };

  game.getPreview = (identifier) => {
    wikipediaAPI.getPreview(((identifier) ? identifier : game.endArticle.id), (preview, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        console.log(preview);
      }
    })
  };

  let clickEventHandler = event => {
    if (event.target.tagName === 'a' || event.target.tagName === 'A') {
      let href = event.target.href;
      if (href.indexOf('action=') == -1 && href.indexOf('(Seite nicht vorhanden)') == -1){
        let titleArray = event.target.href.split('/');
        loadNewArticle(titleArray[titleArray.length - 1]);
      } else {
         event.target.tagName === 'span';
      }
      event.preventDefault();
    }
  };

  if (document.addEventListener) {
      document.addEventListener('click', clickEventHandler);
  } else if (document.attachEvent) {
      document.attachEvent('onclick', clickEventHandler);
  }

  game.reset = () => {
    game.activeArticle = null;
    game.endArticle = null;
    game.goalReached = false;
    game.articleCounter = 0;
    game.articleArchive = [];
//    contextNode.innerHTML = '';
  };
  return game;
});
