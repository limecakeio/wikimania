angular.module('wikimania',[]).controller('wikimania-controller', function ($scope, $timeout, $window, $http, wikipediaAPI) {

  $scope.activeArticle = {
    html: '',
    title: '',
    id: ''
  };

  $scope.articleCounter = 0;

  $scope.goalReached = false;

  $scope.articleArchive = [];

  $scope.endArticle = {
    title: '',
    html: '',
    preview: '',
    id: -1
  };

  $scope.setDifficultiy = diff => {
    difficultiy = diff;
  };

  $scope.startGameExpert = () => {
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.activeArticle = article;
        document.querySelector('#contextNode').innerHTML = article.html;
      }
    });
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.endArticle.id = article.id;
        $scope.endArticle.title = article.title;
        $scope.endArticle.html = article.html;
      }
    });
  };

  /*
   * sets the activeArticle object with the argument startID
   * endArticle is saved internally
   */
  $scope.startGame = function(startID, endID) {
    wikipediaAPI.getArticle(startID, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.activeArticle = article;
        document.querySelector('#contextNode').innerHTML = article.html;
      }
    });
    wikipediaAPI.getArticle(endID, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.endArticle.id = article.id;
        $scope.endArticle.title = article.title;
        $scope.endArticle.html = article.html;
      }
    });
  };

  const checkArticle = function() {
    if ($scope.articleArchive[$scope.articleArchive.length - 1].id === $scope.endArticle.id) {
      $scope.goalReached = true;
      console.log('fin ');
      $scope.addArticleArchive('articles');
    }
  };

  $scope.addArticleArchive = selector => {
    let node = document.querySelector('#' + selector);
    $scope.articleArchive.forEach(article => {
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
        $scope.activeArticle = article;
        $scope.articleCounter++;
        $scope.articleArchive.push(article);
        document.querySelector('#contextNode').innerHTML = article.html;
        checkArticle();
      }
    });
  };

  $scope.getRandomArticle = () => {
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.activeArticle = article;
        document.querySelector('#contextNode').innerHTML = article.html;
      }
    });
  };

  $scope.getPreview = (identifier) => {
    wikipediaAPI.getPreview(((identifier) ? identifier : $scope.endArticle.id), (preview, error) => {
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

  $scope.reset = () => {
    $scope.activeArticle = null;
    $scope.endArticle = null;
    $scope.goalReached = false;
    $scope.articleCounter = 0;
    $scope.articleArchive = [];
    document.querySelector('#contextNode').innerHTML = '';
  };

});
/*
 * startGame(287816, 2166425) -> Kulturapfel -> Hessen
 * startGame(7941746, 8372077)
 * startGame(1526957, 805737)
 * 4492770, 3166949
 */
