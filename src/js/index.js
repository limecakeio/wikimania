angular.module('wikimania',[]).controller('wikimania-controller', function ($scope, $timeout, $window, $http) {

  $scope.activeArticle = {
    articeHTML: '',
    title: '',
    id: -1
  };

  $scope.articleArchive = [];

  let endArticle = {
    title: '',
    html: '',
    id: -1
  };

  $scope.startGame = function(startID, endID) {
    console.log(IDToTitle(startID));
    return;
    activeArticle = getArticle(IDToTitle(startID));
    $scope.articleArchive.push(activeArticle);
    endArticle = getArticle(IDToTitle(endID));
  };

	const getArticle = function(page) {
    const article = {
        title: 'Invalid',
        html: 'Invalid',
        id: -1
    };

    $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&format=json&page=' + page,
    }).then(function successCallback(response) {
      let context = response.data.parse;
      article.title = context.title;
      article.id = context.pageid;
      article.articeHTML = parse(context.text["*"]);
      return article;
    }, function errorCallback(response) {
      console.log('something went wrong');
    });

  };

  const parse = text => {
    let wikiContainer = document.createElement('div');
    wikiContainer.innerHTML = text;

    let images = wikiContainer.querySelectorAll('img');
    images.forEach(image => {
      image.outerHTML = '';
    });

    let thumbImages = wikiContainer.querySelectorAll('.thumbimage');
    thumbImages.forEach(image => {
      console.log(image);
      image.outerHTML = '';
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
		    if (typeof header !== 'undefined') {
          let parent = header.parentElement;
          let sibling = parent.nextSibling;
          while (sibling.nodeName === '#text') {
            sibling = sibling.nextSibling;
          }
          sibling.outerHTML = '';
          parent.outerHTML = '';
      }
    });

    const unwantedElements = ['a', 'ul', 'div', 'img'];
		unwantedElements.forEach(element => {
      const elementContainer = wikiContainer.querySelectorAll(element);
			elementContainer.forEach(ele => {
        if (ele.classList.length > 0) {
          ele.outerHTML = '';
        }
      });
    });

    let audio = wikiContainer.querySelector('#Vorlage_Gesprochene_Version');
    if (typeof audio !== 'undefined') {
      audio.outerHTML = '';
    }

    return wikiContainer.innerHTML;
  };

  const IDToTitle = function(id) {
    console.log('https://de.wikipedia.org/w/api.php?origin=*&action=query&pageids=' + id);
    $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=query&format=json&pageids=' + id
    }).then(function successCallback(response) {
      let context = Object.keys(response.data.query.pages);
      console.log(context);
      return context['title'];
    }, function errorCallback(response) {
      console.log('something went wrong');
    });
  };

  const titleToID = function(title) {
    $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&format=json&page=' + page
    }).then(function successCallback(response) {
      return response.data.parse.pageid;
    }, function errorCallback(response) {
      console.log('something went wrong');
    });
  };

});
