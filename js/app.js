/*
 * Create a list that holds all of your cards
 */
const deck = ['paper-plane-o', 'paper-plane-o',
			  'bicycle', 'bicycle',
			  'leaf', 'leaf',
			  'anchor', 'anchor',
			  'bomb', 'bomb',
			  'bolt', 'bolt', 
			  'diamond', 'diamond',
			  'cube', 'cube']

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deckOfCards = $('.deck');
const allStars = $('.stars li');
const matchedPairs = deck.length/2;
let allOpenedCards = [];
let moveCount = 0;
let matchCount = 0;
let timeStart = true;
let time;
let countUp;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//shuffle cards in deck array to create new deck
function shuffledDeck() {
	let shuffledDeck = shuffle(deck);
	$('.deck').empty();
	for(let card = 0; card < shuffledDeck.length; card++) {
		$('.deck').append($('<li class="card"><i class="fa fa-' + shuffledDeck[card] + '"></i></li>'))
	}
}

//event handler for clicked card
function clickedCard() {
$('li.card').on('click', function() {
	let openCard = $(this);
	toggleOpenShow(openCard);
	if(openCard.hasClass('open show')
		&& allOpenedCards.length < 2) {
		allOpenedCards.push(openCard);		
	}		
	matchedCard();
	});
}

// toggling open and show class on clicked card
function toggleOpenShow(card) {
	card.addClass('open show');
}

//flip cards back over after modal display
function resetCards() {
	let cardsInDeck = $('.deck li')
	for(card of cardsInDeck) {
		card.className = 'card';
	}
}

//match first card clicked to second card clicked
function matchedCard() {
	let firstCard = allOpenedCards[0];
	let secondCard = allOpenedCards[1];
	if(allOpenedCards.length === 2) {
		moveCounter();
		scoreCheck();
		if(firstCard.children().attr('class') === secondCard.children().attr('class')) {
			firstCard.addClass('match');
			secondCard.addClass('match');
			allOpenedCards.length = 0;
			matchCount++;
			if(matchCount === matchedPairs) {
				gameOver();
			}
		} else {
			setTimeout(function() {
				firstCard.removeClass('open show');
				secondCard.removeClass('open show');
				allOpenedCards.length = 0;
		}, 200);	
		}
	}
}

//count moves user make and update to screen
function moveCounter() {
    moveCount++;
	$('.moves').text(moveCount);
}

//remove stars based on how many moves user make
function scoreCheck() {
    if(moveCount === 8 || moveCount === 16 || moveCount === 24) {
        removeStar();
    }
}

//reset move count back to zero
function resetMoveCount() {
	moveCount = 0;
	$('.moves').text(moveCount);
}

//remove star based on how many moves user make
function removeStar() {
    for(star of allStars) {
        if(star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

//count how many stars left to display based on
//how many moves user make
function updateStar() {
	let starCount = 0;
	for(star of allStars) {
		if(star.hidden === false) {
			starCount++;
		}
	}
	return starCount;
}

//restore stars count to default
function resetStar() {
	for(star of allStars) {
		star.style.display = 'inline';
	}
}

//start a timer once the game loads
function startTimer() {
    time = 0;
    countUp = setInterval(function () {
        time++;
		displayTimer();
    }, 1000);
}

//stop timer when user win
function stopTimer() {
	clearInterval(countUp);
}

//displaying timer with live update
function displayTimer() {
    let clock = $('.timer').text(time);
	let mins = Math.floor(time / 60);
	let secs = time % 60;
	if(secs < 10) {
		clock.text(`${mins}:0${secs}`);
		} else {
			clock.text(`${mins}:${secs}`);
		}
}

//reset the timer to start counting
//time from the beginning
function resetTimer() {
	stopTimer();
	timeStart = true;
	time = 0;
	displayTimer();
}

//toggle modal on or off
function toggleModal() {
	$('.modal-results').toggleClass('show-modal');
}

//update modal with results
function updateModal() {
	let newTime = $('.timer').text();
	let newStars = updateStar();
	$('.modal-time').text(`Time: ${newTime}`);
	$('.modal-moves').text(`Moves: ${moveCount}`);
	$('.modal-stars').text(`Stars: ${newStars}`);
}

//modal event listener
//when modal is open, click button will close modal
$('.modal-button-close').on('click', toggleModal);

//when modal is open, click button will restart game
$('.modal-button-replay').on('click', restartGame);

//restart event listener
$('.restart').on('click', function() {
	restartGame();
	toggleModal();
});

//initialize the game
function init() {
	shuffledDeck();
	startTimer();
	timeStart = false;
	clickedCard();
}

//function to reset game
function restartGame() {
	allOpenedCards.length = 0;
	resetTimer();
	resetMoveCount();
	resetStar();
	resetCards();
	toggleModal();
	init();
}

//function to stop the game once the user win
//and toggle the modal to show result
function gameOver() {
	stopTimer();
	updateModal();
	resetCards();
	toggleModal();
}

init();