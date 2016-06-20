var $page = $('#page'),
	currentScreen = 'main';
showMainScreen();

function showScoreboardScreen() {
	hideMainScreen();
	$page.html(scoreboardTmpl()); // Render template

}
function hideScoreboardScreen() {
}

function showGameScreen() {
	hideMainScreen();
	$page.html(gameTmpl()); // Render template
}
function hideGameScreen() {
}

function showLoginScreen() {
	hideMainScreen();
	$page.html(loginTmpl()); // Render template	
}
function hideLoginScreen() {
}

function showMainScreen() {
	// Call prev screen's destructor
    if (currentScreen === 'scoreboard') {
        hideScoreboardScreen();
    } else if (currentScreen === 'game') {
        hideGameScreen();
    } else if (currentScreen === 'login') {
        hideLoginScreen();
    }

	$page.html(mainTmpl()); // Render template

	// Initialize event handlers
	$('.js-scoreboard').on('click', showScoreboardScreen);
	$('.js-start-game').on('click', showGameScreen);
	$('.js-login').on('click', showLoginScreen);
}

function hideMainScreen() {
	// Remove event handlers from current screen from memory
	// $('.js-scoreboard').off('click', showScoreboardScreen);
	// $('.js-start-game').off('click', showScoreboardScreen);
	// $('.js-login').off('click', showScoreboardScreen);
}