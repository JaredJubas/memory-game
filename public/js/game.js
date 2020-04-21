'use strict';

// Everything needed from the HTML
const cards = Array.from(document.getElementsByClassName('card'));
const time = document.getElementById('current');
const total_moves = document.getElementById('num');
const start = document.getElementById('start');
const victory_container = document.getElementById('victory');
const restart_button = document.getElementById('restart');

 // Store cards currently flipped
let flipped = [];

// Keep track of total number of moved made
let num_moves = 0;

// Keep track of number of matches made
let num_matched = 0;

// Delay before cards become unflipped
const delay = 1000;

// No new flips should be made when 2 cards should be checked if they match
let lock = false;

// Variables to keep track of time
let minutes = 0;
let seconds = 0;

// Interval to be used for the time
let interval; 

start.addEventListener('click', play);
restart_button.addEventListener('click', restart);

function shuffle() { // Fisher-Yates shuffle algorithm 
    for (let i = cards.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        const temp = cards[rand].innerHTML;
        cards[rand].innerHTML = cards[i].innerHTML;
        cards[i].innerHTML = temp;
    }
}

function startTime() {
    // Score is recorded in minutes:seconds format
    interval = setInterval(function() {
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        else {seconds++}
        time.innerHTML = minutes.toString() + ":" + seconds.toString();
    }, delay);
}

function flipCard(card) {
    // Do nothing if 2 cards currently flipped or trying to flip a card already flipped
    if (lock || card.classList.length === 2) {return}
    num_moves++;
    total_moves.innerHTML = num_moves
    card.classList.toggle('flip');
    flipped.push(card);
    if (flipped.length == 2) {
        // Lock it so no new cards could be flipped until current cards are checked
        lock = true;
        // Delay the check to give the new card enough time to be flipped
        setTimeout(function() {
            checkMatch();
        }, delay);
    }
}

function checkMatch() {
    if (flipped[0].innerHTML !== flipped[1].innerHTML) {
        unFlipCards();
    } else {
        num_matched++;
        // If 13 matches then all cards have been matched
        if (num_matched === 13) {
            victory();
        }
    }
    // Clear current flipped cards
    flipped = []
    // Allow for new cards to be flipped
    lock = false;
}

function unFlipCards() {
    flipped[0].classList.toggle('flip');
    flipped[1].classList.toggle('flip');
}

function victory() {
    clearInterval(interval);
    // Display victory message
    victory_container.style.display = "block";
    recordScore();
}

function recordScore() {
    // Add the new score to the database
    const request = new XMLHttpRequest()
    const url = '/record'
    request.open('POST', url, true)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    const data = JSON.stringify({"username":username,"moves":num_moves,minutes:"minutes",seconds:"seconds"})
    request.send(data)
}

function restart(e) {
    if (e) {e.preventDefault()}

    // Lock so no flips can be made until game is ready
    lock = true;

    // Unlfip all the cards
    cards.forEach(card => {
        card.classList.toggle('flip');
    })

    // Reset all the variables
    victory_container.style.display = "none";
    num_moves = 0;
    total_moves.innerHTML = num_moves
    minutes = 0;
    seconds = 0;
    time.innerHTML = minutes.toString() + ":" + seconds.toString();

    // Delay the cards being shuffled to allow for them to finish being flipped
    setTimeout(function() {
        shuffle();
        play();
    }, delay);
}

function play(e) {
    if (e) {e.preventDefault()}

    start.style.display = "none";
    shuffle();

    startTime();
    cards.forEach(card => {
        card.addEventListener('click', function(){
            flipCard(card);
        })
    })
    const backs = Array.from(document.getElementsByClassName('back'));
    backs.forEach(back => {
        if (back.classList.length === 2) {
            back.classList.toggle('effect');
        }
    })

    // Game ready
    lock = false;
}
