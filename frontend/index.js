var easyStartList = document.querySelector('#start-selection-easy');
var easyStartListElement = [].slice.call(document.querySelectorAll('#start-selection-easy p'));
var easyFinishList = document.querySelector('#finish-selection-easy');
var easyFinishListElement = [].slice.call(document.querySelectorAll('#finish-selection-easy p'));
var easyModeArrow = document.querySelector('.continue-arrow');

/* List Element Highlighting */
var index = 0;
easyStartListElement.map(function(element) {
    element.onmouseenter = function() {
        easyStartListElement.map(function(element) {
            element.classList.remove('active');
        });
        element.className += ' active';
    }
    index++;
    element.onmousedown = function() {
        easyStartListElement.map(function(element) {
            element.classList.remove('clicked');
        });
        element.className += ' clicked';
        easyModeArrow.style.color = 'tomato';
    }
    index++
});
index = 0;
easyFinishListElement.map(function(element) {
    element.onmouseenter = function() {
        easyFinishListElement.map(function(element) {
            element.classList.remove('active');
        });
        element.className += ' active';
    }
    index++;
    element.onmousedown = function() {
        easyFinishListElement.map(function(element) {
            element.classList.remove('clicked');
        });
        element.className += ' clicked';
    }
    index++;
});

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
var triangleLeft = document.querySelector('#difficulty-selection-mode .triangle-left');
var triangleRight = document.querySelector('#difficulty-selection-mode .triangle-right');
var triangleUp = document.querySelector('#difficulty-selection-mode .triangle-up');
beginnerButton.onmouseenter = function() {
    beginnerDescription.className += ' active';
    triangleLeft.className += ' beginner-triangle';
};
beginnerButton.onmouseleave = function() {
    beginnerDescription.classList.remove('active');
    triangleLeft.classList.remove('beginner-triangle');
};
expertButton.onmouseenter = function() {
    expertDescription.className += ' active';
    triangleRight.className += ' expert-triangle';
};
expertButton.onmouseleave = function() {
    expertDescription.classList.remove('active');
    triangleRight.classList.remove('expert-triangle');
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
	console.log(currentRuleIndex);
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
