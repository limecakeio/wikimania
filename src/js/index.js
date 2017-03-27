angular.module('wikimania',[]).controller('wikimania-controller', function ($scope, $timeout, $window, $http, wikipediaAPI) {

  $scope.activeArticle = {
    html: '',
    title: '',
    id: ''
  };

  $scope.articleCounter = 0;

  $scope.goalReached = false;

  $scope.articleArchive = [];

  let endArticle = {
    title: '',
    html: '',
    preview: '',
    id: -1
  };

  let difficultiyLevel = 0;

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
        endArticle.id = article.id;
        endArticle.title = article.title;
        endArticle.html = article.html;
      }
    });
  };

  const checkArticle = function() {
    if ($scope.articleArchive[$scope.articleArchive.length - 1].id === endArticle.id) {
      $scope.goalReached = true;
      console.log('fin');
    }
  };

  const loadNewArticle = function(title) {
    wikipediaAPI.getArticle(title, (article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.activeArticle = article;
        $scope.articleArchive.push(article);
        document.querySelector('#contextNode').innerHTML = article.html;
        checkArticle();
      }
    });
  };

  $scope.getRandomArticle = function() {
    wikipediaAPI.getRandomArticle((article, error) => {
      if (error !== null) {
        console.error(error);
      } else {
        $scope.activeArticle = article;
        document.querySelector('#contextNode').innerHTML = article.html;
      }
    });
  };

  $scope.getPreview = (selector) => {
    if (endArticle.id === -1) {
      throw new Error('no goal!');
    }
    wikipediaAPI.getPreview(endArticle.id, (preview, error) => {
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
      }
      event.preventDefault();
    }
  };

  if (document.addEventListener) {
      document.addEventListener('click', clickEventHandler);
  } else if (document.attachEvent) {
      document.attachEvent('onclick', clickEventHandler);
  }

});
/*
 * startGame(287816, 2166425) -> Kulturapfel -> Hessen
 * startGame(7941746, 8372077)
 * startGame(1526957, 805737)
 * 4492770, 3166949
 */
