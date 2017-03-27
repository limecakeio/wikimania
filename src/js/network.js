wikimania.factory('wikipediaAPI', $http => {
  let self = this;
  const wikipediaAPI = {};

  wikipediaAPI.getArticle = (identifier, callback) => {
    if (typeof identifier === 'number') {
      getArticleFromID(identifier, true).then(response => {
          try  {
            let article = parseArticle(response);
            callback(article, null);
          } catch (error) {
            callback(null, error);
          }
      });
    } else if (typeof identifier === 'string') {
      getArticleFromTitle(identifier, true).then(response => {
        try  {
          let article = parseArticle(response);
          callback(article, null);
        } catch (error) {
          callback(null, error);
        }
      });
    } else {
      callback(null, 'identifier must be a number or a string');
    }
  };

  const getArticleFromTitle = (title, redirect) => {
    return $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text|images&format=json&&page=' + title + (redirect ? '&redirects=true': '')
    }).then(response => {
      if (typeof response.data.error !== 'undefined') {
        return getArticleFromTitle(title, false);
      } else {
        return response.data;
      }
    }, error => {
      console.log('get request failed ' + error);
      return error;
    });
  };

  const getArticleFromID = (id, redirect) => {
    return $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text|images&format=json&pageid=' + id + (redirect ? '&redirects=true': '')
    }).then(response => {
      if (typeof response.data.error !== 'undefined') {
        return getArticleFromID(id, false);
      } else {
        return response.data;
      }
    }, error => {
      console.log('get request failed ' + error);
      return error;
    });
  };

  const parseArticle = data => {
    if (typeof data.warning !== 'undefined') {
      throw new Error('unknown title or id');
    }
    data = data.parse;
    if (typeof data.pageid === 'undefined' || typeof data.title === 'undefined' || typeof data.text['*'] === 'undefined') {
      throw new Error('malformed json data');
    }
    let article = {
      id: data.pageid,
      html: '',
      title: data.title
    };
    let wikiContainer = document.createElement('div');
    wikiContainer.innerHTML = data.text['*'];

    removeImagesFromElement(wikiContainer);
    removeUnwantedElementsWithClasses(wikiContainer);
    removeUnwantedClassesFromElement(wikiContainer);
    removeUnwantedListsFromElement(wikiContainer);
    removeUnwantedSpansFromElement(wikiContainer);
    removeUnwantedElementsFromElement(wikiContainer);

    article.html = wikiContainer.innerHTML;

    return article;
  };

  const removeUnwantedElementsWithClasses = node => {
    const unwantedElements = [/*'a',*/ 'ul', 'div', 'img'];
    unwantedElements.forEach(element => {
      const elementContainer = node.querySelectorAll(element);
      elementContainer.forEach(ele => {
        if (ele.classList.length > 0) {
          ele.outerHTML = '';
        }
      });
    });
  };

  const removeUnwantedSpansFromElement = element => {
    let spans = element.querySelectorAll('span');
    spans.forEach(span => {
        if (span.className !== 'mw-headline') {
          span.outerHTML = '';
        }
    });
  };

  const removeUnwantedElementsFromElement = node => {
    let elements = ['#Vorlage_Begriffsklaerung', '#Vorlage_Gesprochene_Version', '#Vorlage_Lueckenhaft'];
    elements.forEach(element => {
      let ele = node.querySelector(element);
      if (ele !== null) {
        ele.outerHTML = '';
      }
    });
  };

  const removeImagesFromElement = element => {
    let images = element.querySelectorAll('img');
    images.forEach(image => {
      image.src = '';
      image.srcset = '';
      image.outerHTML = '';
    });
  };

  const removeUnwantedClassesFromElement = node => {
    let classNames = ['.reference', '.sisterproject'];
    classNames.forEach(className => {
      let elements = node.querySelectorAll(className);
      elements.forEach(element => {
        element.outerHTML = '';
      });
    });
  };

  const removeUnwantedListsFromElement = element => {
    let listNames = ['#Siehe_auch', '#Literatur', '#Weblinks', '#Einzelnachweise', '#Einzelnachweise_und_Anmerkungen', '#Einzelhinweise'];
    listNames.forEach(listname => {
      let list = element.querySelector(listname);
      if (list !== null) {
        let parent = list.parentElement;
        let sibling = parent.nextSibling;
        while (sibling.nodeName === '#text') {
          sibling = sibling.nextSibling;
        }
        sibling.outerHTML = '';
        parent.outerHTML = '';
      }
    });
  };

  wikipediaAPI.titleToID = (title, callback) => {
    $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&format=json&page=' + title
    }).then(function successCallback(response) {
      if (typeof response.data.warnings !== 'undefined') {
        callback(null, response.data.warnings);
      } else {
        callback(response.data.parse.pageid, null);
      }
    }, function errorCallback(response) {
      callback(null, error);
    });
  };

  wikipediaAPI.IDToTitle = (id, callback) => {
    $http({
	      method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&action=query&format=json&pageids=' + id
    }).then(response => {
      if (typeof response.data.warnings !== 'undefined') {
        callback(null, response.data.warnings);
      } else {
        callback(response.data.query.pages['' + id].title, null);
      }
    }, error => {
      callback(null, error);
    });
  };

  wikipediaAPI.getRandomArticle = callback => {
    getRandomArticleTitle().then(title => {
      wikipediaAPI.getArticle(title, callback);
    });
  };

  const getRandomArticleTitle = () => {
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

  wikipediaAPI.getPreview = (id, callback) => {
    $http({
        method: 'GET',
        url: 'https://de.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=pageterms|extracts&exintro=&explaintext=&pageids=' + id
    }).then(response => {
      if (typeof response.data.warnings !== 'undefined') {
        callback(null, response.data.warnings);
      } else {
        callback(response.data.query.pages['' + id].extract, null);
      }
    }, err => {
      callback(null, err);
    });
  };

    wikipediaAPI.getRandomArticleTitle = callback => {
      wikipediaAPI.getRandomArticle((article, error) => {
        if (error !== null) {
          callback(null, error);
        } else {
          callback(article.title, null);
        }
      }
      );
    };

  return wikipediaAPI;
});
