const PLAYER_ONE = 0;
const PLAYER_TWO = 1;
const TIE = -1;

// --------------------- Game Object -----------------------
// Game object that accepts nbr of rounds each game should be
function Game(player1, player2){
    this.players = [player1, player2];  // array of Player objects. idx 0 is player1, idx 1 is player 2
    this.scorecard = [0, 0, 0];         // idx 0 is player1 wins, idx 1 is player 2 wins, idx 3 are ties
    this.rounds = [];                   // array of Round objects
    this.winner = null;                 // 0 is player1, 1 is player2, -1 is a tie
    this.maxNbrOfRounds = 1;            // maximim number of rounds in the game
    this.nbrOfGamesPlayed = 0;
}
// reset the scoreboard, winner, and max nbr of rounds
Game.prototype.reset = function (nbrOfRounds){
    this.scorecard = [0, 0, 0];      
    this.winner = null;    
    this.maxNbrOfRounds = nbrOfRounds;            
}    
// adds Round object to the rounds array
Game.prototype.addRound = function (round){
    this.rounds.push(round);
}
// determine who the game's winner is 0 is player1, 1 is player 2, -1 is a tie
Game.prototype.determineGameWinner = function (){
    if(this.scorecard[PLAYER_ONE] > this.scorecard[PLAYER_TWO]){
        this.winner = PLAYER_ONE;
    } else if (this.scorecard[PLAYER_ONE] < this.scorecard[PLAYER_TWO]){
        this.winner = PLAYER_TWO;
    } else this.winner = TIE;
}

// update Player object stats and the scoreboard array
Game.prototype.updateStats = function (){
    var winner = this.rounds[this.rounds.length-1].winner;   // current round's winner
    
    if (winner === TIE) {                  // winner = -1 means it's a tie
        this.scorecard[2]++;               // increment scorecard's nbr of ties (idx 2 holds ties)
        this.players[PLAYER_ONE].ties++;       // increment player 1 nbr of ties
        this.players[PLAYER_TWO].ties++;       // increment player 2 nbr of ties
    } else {
        this.scorecard[winner]++;          // increment scorecard's nbr of wins (idx 0 or 1 holds wins)           
        this.players[winner].wins++;       // increment player's wins
        this.players[winner ^ 1].losses++; // incr player lossses; XOR will give you opposite nbr. 0 ^ 1 = 1, 1 ^ 0 = 0
    }
    this.nbrOfRoundsPlayed++;              // increment number of rounds         
}


// --------------------- Player Object -----------------------
// Player object that accepts player's name and a flag to tell whether the player is human or not
function Player(name, humanFlag){
    this.name = name;
    this.human = humanFlag;
    this.humanText = (this.human)?'human':'computer';
    this.wins = 0;
    this.losses = 0;
    this.ties = 0;
}
// if human, then prompt for input, if not human, then generate random input.
Player.prototype.draw = function (){
    var userInput = '';
    var validInput = ['R', 'P', 'S']; // array of valid choices

    if(this.human){
        userInput = prompt("Please enter (R)ock, (P)aper, (S)cissors ").toUpperCase();
        while (!validInput.includes(userInput))    // validate input by checking if input is in the array
            userInput = prompt(`Invalid Input.  Try again!\nPlease enter (R)ock, (P)aper, (S)cissors `).toUpperCase();
    } else {
        var i = Math.floor(Math.random() * validInput.length);    // generate random number
        userInput = validInput[i];
    }
    return  userInput;     
}

// --------------------- Round Object -----------------------
// Round object, that accepts player1's and player2's draws, and a Game identifier
function Round(playerOneDraw, playerTwoDraw, gameId){
    this.gameId = gameId;
    this.draw = [playerOneDraw, playerTwoDraw];  // array of player's draws
    this.winner;                                 // 0 = p1, 1 = p2, -1 = tie
}
// this determines who the winner is for each round
Round.prototype.determineRoundWinner = function (){
    var rules = [['R', 'S'], ['S', 'P'], ['P', 'R']];      // Game rules. 1st element beats 2nd element..
    
    if (this.draw[PLAYER_ONE] === this.draw[PLAYER_TWO]){  // its a tie
        this.winner = TIE;                                 // value of -1 is a tie
    } else {
        // search the rule array to find the rule that contains player1's draw and player2's draw
        var rule = rules.find(element => element[0] === this.draw[PLAYER_ONE] &&
                                         element[1] === this.draw[PLAYER_TWO]);
        (rule) ? this.winner = PLAYER_ONE : this.winner = PLAYER_TWO;   // if rule is found then player 1 wins, else player 2 wins
    }
}




// ------- main logic -----------
function playGame(game) {
    var playAgain = true;
    var gameNbr = 0;
    
    while (playAgain) {
        gameNbr++;      
        var nbrOfRounds = parseInt(prompt('Please enter number of rounds'));
        while (nbrOfRounds !== nbrOfRounds)   // check for NaN parseint will return NaN if not numeric
            nbrOfRounds = parseInt(prompt(`Invalid Input!  Try Again!\nPlease enter number of rounds`));
        
        game.reset(nbrOfRounds);     // reset the scoreboard, winner, and number of rounds
        
        // loop for the number of rounds defined for the game
        for (var i = 0; i < game.maxNbrOfRounds; i++){
            var round = new Round(game.players[PLAYER_ONE].draw(), game.players[PLAYER_TWO].draw(), gameNbr);  // create a new Round 
            round.determineRoundWinner();            // determine the winner of the round
            game.addRound(round);                    // add the Round Object to the Game
            game.updateStats();                      // update the Game and Player's stats
            // display the winner of the round and both players draws
            alert(`\nPlayer ONE (${game.players[PLAYER_ONE].humanText}) had: ${round.draw[PLAYER_ONE]}` +
                 `\nPlayer TWO (${game.players[PLAYER_TWO].humanText}) had: ${round.draw[PLAYER_TWO]}` +
                 `\n\n${(round.winner === TIE)?"It's a tie!":`Player ${round.winner + 1} is the WINNER!`}`); 
        }
        
        game.determineGameWinner();  // determine the winner of the game

        // display the winner of the game, both players wins, and total ties
        alert(`\nPlayer ONE: (${game.players[PLAYER_ONE].humanText} ) ${game.scorecard[PLAYER_ONE]} wins.` +
              `\nPlayer TWO: (${game.players[PLAYER_TWO].humanText}) ${game.scorecard[PLAYER_TWO]} wins.` +
              `\nThere were ${game.scorecard[2]} ties` +
              `\n\n${(game.winner === TIE)?"It's a tie!":`Player ${game.winner + 1} is the WINNER!`}`); 

        playAgain = confirm('Do you want to play again?');
    }

    game.nbrOfGamesPlayed = gameNbr;   // set nbr of games played

    alert(`Player ONE stats\n----------------------` +
          `\nWins: ${game.players[PLAYER_ONE].wins}` +
          `\nLosses: ${game.players[PLAYER_ONE].losses}` +
          `\nTies: ${game.players[PLAYER_ONE].ties}` +
          `\n\nPlayer TWO stats\n----------------------` +
          `\nWins: ${game.players[PLAYER_TWO].wins}` +
          `\nLosses: ${game.players[PLAYER_TWO].losses}` +
          `\nTies: ${game.players[PLAYER_TWO].ties}` +
          `\n\nNumber of games played: ${game.nbrOfGamesPlayed}` +
          `\nNumber of rounds played: ${game.rounds.length}`); 
}


var playerName = prompt('Please enter your name.');
var player1 = new Player(playerName, true);          // create a human player
var player2 = new Player('Big Blue', false);         // create a non-human player
var game = new Game(player1, player2);               // create a new Game 

playGame(game);