/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
let scores, roundScore, activePlayer, gamePlaying, goal, numDice;

document.querySelector('.btn-start').addEventListener('click', function() {
    init();
    document.querySelector('.instructions').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
});

document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        // 1. Random number
        let dice = Math.floor(Math.random() * 6) + 1;
        let dice1 = Math.floor(Math.random() * 6) + 1;

        // 2. Display the result
        document.querySelector('.dice-box').style.display = 'block';
        if (numDice === 1) {
            let diceDOM = document.querySelector('.dice');
            diceDOM.style.display = 'block';
            diceDOM.style.border = 'none';
            diceDOM.src = 'dice-' + dice + '.png'; 
            diceDOM.style.opacity = '1';
        } else {
            
            document.querySelector('.dice-1').style.opacity = '1';
            let diceDOM1 = document.querySelector('.dice-0');
            diceDOM1.style.display = 'block';
            diceDOM1.style.border = 'none';
            diceDOM1.src = 'dice-' + dice + '.png'; 
            diceDOM1.style.opacity = '1';
            let diceDOM2 = document.querySelector('.dice-1');
            diceDOM2.style.display = 'block';
            diceDOM2.style.border = 'none';
            diceDOM2.src = 'dice-' + dice1 + '.png';
            diceDOM2.style.opacity = '1';
        }

        // 3. Update the round score IF the rolled number was NOT a 1
        if ((numDice === 1 && dice > 1) || (numDice === 2 && dice > 1 && dice1 > 1)) {
            let diceSound = new sound("dice-roll.mp3");
            diceSound.play();
            // Add score
            numDice === 1 ? roundScore += dice : roundScore += dice + dice1;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            let failSound = new sound("fail.wav");
            failSound.play();
            if (numDice === 1) {
                document.querySelector('.dice').style.opacity = '0.75';
                document.querySelector('.dice').style.border = '5px solid red';
            } else {
                document.querySelector('.dice-0').style.opacity = '0.75';
                document.querySelector('.dice-1').style.opacity = '0.75';
                if (dice === 1) {
                    document.querySelector('.dice-0').style.border = '5px solid red';
                }

                if (dice1 === 1) {
                    document.querySelector('.dice-1').style.border = '5px solid red';
                }
            }
            nextPlayer();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        // Add CURRENT score to Global score
        scores[activePlayer] += roundScore;

        // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        // Check if player won the game
        if (scores[activePlayer] >= goal) {
            let successSound = new sound("success.wav");
            successSound.play();
            document.getElementById('name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
            if (numDice === 1) {
                document.querySelector('.dice').style.opacity = '0.75';
            } else {
                document.querySelector('.dice-0').style.opacity = '0.75';
                document.querySelector('.dice-1').style.opacity = '0.75';
            }
            let failSound = new sound("confirmation.wav");
            failSound.play();
            nextPlayer();
        }
    }
});

function nextPlayer() {
    // Next player's turn
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

document.querySelector('.btn-new').addEventListener('click', function(){
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.instructions').style.display = 'block';
});

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    numDice = parseInt(document.getElementById('num-dice').value);
    goal = parseInt(document.getElementById('goal').value);
    document.querySelector('.goal-display').textContent = 'Goal: ' + goal;
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice-0').style.display = 'none';
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.dice-box').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    let startupSound = new sound("startup.wav");
    startupSound.play();
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }