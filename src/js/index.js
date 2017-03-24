angular.module('wikimania',[]).controller('wikimania-controller', function ($scope, $timeout, $window, $http) {

  var self = this;
	$scope.articeHTML = '';
  $scope.title = '';
	$scope.getArticle = function(page) {
    $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&format=json&page=' + page,
    }).then(function successCallback(response) {
      console.log(JSON.stringify(response.data).indexOf('update'));
      $scope.articeHTML = parse(response.data.parse.text["*"]);
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

//    document.querySelector('#contextNode').append(wikiContainer);
    return wikiContainer.innerHTML;
  };

});