angular.module('wikimania',[]).controller('wikimania-controller', function ($scope, $timeout, $window, $http) {

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
    IDToTitle(startID).then(title => {
      getArticle(title).then(article => {
        $scope.activeArticle = article;
        $scope.articleArchive.push(article);
        document.querySelector('#contextNode').innerHTML = $scope.activeArticle.html;
      });
    });
    IDToTitle(endID).then(title => {
      getArticle(title).then(article => {
        endArticle = article;
      });
    });
  };

	const getArticle = function(page) {
    return $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text|images&format=json&page=' + page,
    }).then(function successCallback(response) {
      let context = response.data.parse;
      return {
        title: context.title,
        id: context.pageid,
        html: parse(context.text['*'])
      };
    }, function errorCallback(response) {
      console.log('something went wrong');
    });
  };

  /*
   *
   */
  const parse = text => {
    let wikiContainer = document.createElement('div');
    wikiContainer.innerHTML = text;

/*    let anchors = wikiContainer.querySelectorAll('a');
    anchors.forEach(anchor => {
  //    console.log(anchor.innerHTML);
      anchor.addEventListener('click', clickHandler);
    });*/

    let images = wikiContainer.querySelectorAll('img');
    images.forEach(image => {
      image.src = '';
      image.srcset = '';
      image.outerHTML = '';
    });

    let thumbImages = wikiContainer.querySelectorAll('.thumbimage');
    thumbImages.forEach(image => {
      image.outerHTML = '';
    });

    let unwantedReferences = wikiContainer.querySelectorAll('.reference');
    unwantedReferences.forEach(reference => {
      reference.outerHTML = '';
    });

    let spans = wikiContainer.querySelectorAll('span');
		spans.forEach(span => {
		    if (span.className !== 'mw-headline') {
          span.outerHTML = '';
        }
    });

    let unwantedSisters = wikiContainer.querySelectorAll('.sisterproject');
    unwantedSisters.forEach(sister => {
      sister.outerHTML = '';
    });

    const unwantedLists = ['#Siehe_auch', '#Literatur', '#Weblinks', '#Einzelnachweise'];
		unwantedLists.forEach(list => {
      let header = wikiContainer.querySelector(list);
		    if (typeof header !== 'undefined' && header !== null) {
          let parent = header.parentElement;
          let sibling = parent.nextSibling;
          while (sibling.nodeName === '#text') {
            sibling = sibling.nextSibling;
          }
          sibling.outerHTML = '';
          parent.outerHTML = '';
      }
    });

    const unwantedElements = [/*'a',*/ 'ul', 'div', 'img'];
		unwantedElements.forEach(element => {
      const elementContainer = wikiContainer.querySelectorAll(element);
			elementContainer.forEach(ele => {
        if (ele.classList.length > 0) {
          ele.outerHTML = '';
        }
      });
    });

    let unwantedDefinitionBox = wikiContainer.querySelector('#Vorlage_Begriffsklaerung');
    if (unwantedDefinitionBox !== null) {
      unwantedDefinitionBox.outerHTML = '';
    }

    let audio = wikiContainer.querySelector('#Vorlage_Gesprochene_Version');
//    if (typeof audio !== 'undefined') {
    if (audio !== null) {
      audio.outerHTML = '';
    }

    let unwantedEmpty = wikiContainer.querySelector('#Vorlage_Lueckenhaft');
    if (unwantedEmpty !== null) {
      unwantedEmpty.outerHTML = '';
    }

    return wikiContainer.innerHTML;
  };

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

  const titleToID = function(title) {
    return $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&format=json&page=' + title
    }).then(function successCallback(response) {
      return response.data.parse.pageid;
    }, function errorCallback(response) {
      console.log('something went wrong');
      return 'something went wrong';
    });
  };

  $scope.setLevel = function(diviculty) {

  };

  const checkArticle = function() {
    if ($scope.articleArchive[$scope.articleArchive.length - 1].id === endArticle.id) {
      $scope.goalReached = true;
      console.log('fin');
    }
  };

  const loadNewArticle = function(page) {
    getArticle(page).then(article => {
      $scope.articleArchive.push(article);
      $scope.activeArticle = article;
      document.querySelector('#contextNode').innerHTML = article.html;
      checkArticle();
    })
//    articleArchive.push(getArticle(page));
//    checkArticle();
  };

  $scope.getRandomArticle = function() {
    getRandomArticleTitle().then(title => {
      getArticle(title).then(article => {
        $scope.articleArchive.push(article);
        $scope.activeArticle = article;
        document.querySelector('#contextNode').innerHTML = article.html;
      });
    });
  };

  const getRandomArticleTitle = function() {
    return $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=query&list=random&rnnamespace=0&format=json'
    }).then(response => {
      return response.data.query.random[0].title;
    }, err => {
      console.log('random article failed');
      return 'something went wrong';
    });
  };

  const clickHandler = event => {
      event.preventDefault();
  };

  $scope.getPreview = (selector) => {
    if (endArticle.id === -1) {
      throw new Error('no goal!');
    }
    $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=pageterms|extracts&exintro=&explaintext=&titles=' + endArticle.title
    }).then(response => {
      endArticle.preview = response.data.query.pages['' + endArticle.id].extract;
      document.querySelector('#' + selector).innerHTML = endArticle.preview;
    }, err => {
      console.log('random article failed');
      return 'something went wrong';
    });
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


// document.addEventListener('contextmenu', event => event.preventDefault());

/*
 * startGame(287816, 2166425) -> Kulturapfel -> Hessen
 */
