/* List Element Highlighting */
var highlightElement = function(element) {
    var allElements = [].slice.call(document.querySelectorAll('#' + element.parentNode.id +' p'));
	var neighborPart;
	if(element.parentNode.id === 'easy-starts') {
		neighborPart = [].slice.call(document.querySelectorAll('#easy-ends p'));
	}
	else {
		neighborPart = [].slice.call(document.querySelectorAll('#easy-starts p'));
	}
	// Line-though Value that in the Start/Finish table if they have been chosen in the other one
	neighborPart.map(function (neighborElement) {
		neighborElement.classList.remove('line-through');
		if(neighborElement.getAttribute('onclick') === null) {
			neighborElement.setAttribute('onclick', 'highlightElement(this)');
		}
		if(neighborElement.getAttribute('data-id') === element.getAttribute('data-id')) {
			neighborElement.className += ' line-through';
			neighborElement.removeAttribute('onclick');
		}
	});
    allElements.map(function(element) {
        element.classList.remove('clicked');
    });
	// Highlight element
     element.className += ' clicked';
 };

/* Transition Effects for Sections */

var openSection = (function(section) {
    section = document.querySelector('#' + section);
    name = section.id;

    ([].slice.call(document.querySelectorAll('section'))).map(function(row, index) {
  row.className = '';
 });
    ([].slice.call(document.querySelectorAll('section'))).map(function(row, index) {
        row.className = '';
    });
    document.querySelector('#' + name).className = 'active';
});

openSection('title-screen');


/* Difficulty Selection Description Popup */
var beginnerButton = document.querySelector('#difficulty-selection-mode .button.button-green');
var expertButton = document.querySelector('#difficulty-selection-mode .button.button-red');
var challengeButton = document.querySelector('#difficulty-selection-mode .button.button-darkblue');

var beginnerDescription = document.querySelector('#difficulty-selection-mode #beginner-mode-info');
var expertDescription = document.querySelector('#difficulty-selection-mode #expert-mode-info');
var challengeDescription = document.querySelector('#difficulty-selection-mode #challenge-mode-info');

var triangleUp = document.querySelector('#difficulty-selection-mode .triangle-up');

beginnerButton.onmouseenter = function() {
    beginnerDescription.className += ' active';
    triangleUp.className += ' challenge-triangle';
};
beginnerButton.onmouseleave = function() {
    beginnerDescription.classList.remove('active');
    triangleUp.classList.remove('challenge-triangle');
};
expertButton.onmouseenter = function() {
    expertDescription.className += ' active';
    triangleUp.className += ' challenge-triangle';
};
expertButton.onmouseleave = function() {
    expertDescription.classList.remove('active');
    triangleUp.classList.remove('challenge-triangle');
};
challengeButton.onmouseenter = function() {
    challengeDescription.className += ' active';
    triangleUp.className += ' challenge-triangle';
};
challengeButton.onmouseleave = function() {
    challengeDescription.classList.remove('active');
    triangleUp.classList.remove('challenge-triangle');
};

var accordion = document.getElementsByClassName('accordion');
var i;
for (i = 0; i < accordion.length; i++) {
    accordion[i].onclick = function() {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.display) {
            panel.style.display = null;
        } else {
            panel.style.display = 'block';
        }
    }
}

/* Game Rule Slides and Popup*/
var closePopUp = document.querySelector('#game-rules-popup #popup-close');
var popup = document.querySelector('#game-rules-popup');
var rulesButton = document.querySelector('#title-screen-button #game-rules');

closePopUp.onclick = function() {
	popup.classList.remove('active');
	popup.classList.remove('active');
};

rulesButton.onclick = function() {
    popup.className += ' active';
};

var rules = [].slice.call(document.querySelectorAll('.game-rules'));
rules.map(function(rule) {
	rule.style.display = 'none';
});

var sliderButtonLeft = document.querySelector('.slide-left');
var sliderButtonRight = document.querySelector('.slide-right');

var currentRuleIndex = 0;
var ruleSlide = function(direction) {
	currentRuleIndex += direction;
	rules.map(function(rule) {
		rule.style.display = 'none';
	});
	if(currentRuleIndex === 0) {
		sliderButtonLeft.classList.remove('active');
		sliderButtonRight.className += ' active';
	}
	if(currentRuleIndex === 1) {
		sliderButtonRight.classList.remove('active');
		sliderButtonLeft.className += ' active';
	}
	rules[currentRuleIndex].style.display = 'block';
};
ruleSlide(currentRuleIndex);
