// --------------------- RPS Object ------------------------
function RPS() {
  this.player1 = null
  this.player2 = null
  this.games = []
}

RPS.prototype.play = function() {
  var playerName = prompt('Please enter your name.');
  var computerPlayers = ["Deep Blue", "Alpha Zero", "Hal 9000"];
  this.player1 = new Player(playerName, true);          // create a human player
  this.player2 = new Player(computerPlayers[Math.floor(Math.random() * computerPlayers.length)], false); // create a non-human player
  this.newGame();
}

RPS.prototype.newGame = function() {
  this.games.push(new Game(this.player1, this.player2, (this.games.length - 1)));
  console.log(`${this.player1.name} vs. ${this.player2.name}`)
  this.games[this.games.length - 1].playRounds();
  if (confirm('Do you want to play again?')) {
    return this.newGame();
  }
  var scores = {
    [this.player1.name]: 0,
    [this.player2.name]: 0,
    tie: 0,
    rounds: 0
  }

  this.games.forEach(game => {
    game.rounds.forEach(round => {
      console.log(round.winner)
      scores[round.winner]++;
      scores.rounds++
    })
  })

  alert(`Player ONE stats\n----------------------
Wins: ${scores[this.player1.name]}
Losses: ${scores.rounds - (scores[this.player1.name] + scores.tie)}
Ties: ${scores.tie}

Player TWO stats\n----------------------
Wins: ${scores[this.player2.name]}
Losses: ${scores.rounds - (scores[this.player1.name] + scores.tie)}
Ties: ${scores.tie}

Number of games played: ${this.games.length}
Number of rounds played: ${scores.rounds}`); 
}

// --------------------- Game Object -----------------------
// Game object that accepts nbr of rounds each game should be
function Game(player1, player2, gameNbr){
  var nbrOfRounds = parseInt(prompt('Please enter number of rounds'));
  while (nbrOfRounds !== nbrOfRounds)   // check for NaN parseint will return NaN if not numeric
    nbrOfRounds = parseInt(prompt(`Invalid Input!  Try Again!
Please enter number of rounds`));
  this.player1 = player1,  // array of Player objects.      // idx 0 is player1 wins, idx 1 is player 2 wins, idx 3 are ties
  this.player2 = player2,
  this.rounds = [];                   // array of Round objects
  this.winner = null;                 // 0 is player1, 1 is player2, -1 is a tie
  this.maxNbrOfRounds = nbrOfRounds;            // maximim number of rounds in the game
  this.gameNbr = 0;
}

// adds Round object to the rounds array
Game.prototype.addRound = function (round){
  var round = new Round(this.player1.draw(), this.player2.draw(), this);
  this.rounds.push(round);
  console.log("Round:", round)
}

// determine who the game's winner is 0 is player1, 1 is player 2, -1 is a tie
Game.prototype.determineGameWinner = function() {
  var playerOneName = this.player1.name;
  var playerTwoName = this.player2.name;
  var playerOneWins = this.rounds.filter(round => round.winner === playerOneName ).length;
  var playerTwoWins = this.rounds.filter(round => round.winner === playerTwoName ).length;
  var ties = this.rounds.length - (playerOneWins + playerTwoWins);
  if (playerOneWins > playerTwoWins){
      this.winner = this.player1.name;
  } else if (playerOneWins < playerTwoWins){
      this.winner = this.player2.name;
  } else this.winner = "tie";

  alert(`
Player ONE: (${this.player1.human ? "human": "computer" } ) ${playerOneWins} wins.
Player TWO: (${this.player2.human ? "human": "computer" }) ${playerTwoWins} wins.
There were ${ties} ties

${(this.winner === "tie")?"It's a tie!":`Player ${playerOneWins > playerTwoWins ? this.player1.name : this.player2.name} is the WINNER!`}`); 
}


Game.prototype.playRounds = function () {
  while (this.rounds.length < this.maxNbrOfRounds) {
    this.addRound();
    this.rounds[this.rounds.length - 1].determineRoundWinner();
  }
  this.determineGameWinner();
  alert("Game Over")
}

// --------------------- Player Object -----------------------
// Player object that accepts player's name and a flag to tell whether the player is human or not
function Player(name, humanFlag){
    this.name = name;
    this.human = humanFlag;
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
function Round(playerOneDraw, playerTwoDraw, game) {
    this.game = game;
    this.playerOneDraw = playerOneDraw;
    this.playerTwoDraw = playerTwoDraw; // array of player's draws
    this.winner;                        // a player's name
}

// this determines who the winner is for each round
Round.prototype.determineRoundWinner = function (){
  var rules = [['R', 'S'], ['S', 'P'], ['P', 'R']];      // Game rules. 1st element beats 2nd element..
  
  if (this.playerOneDraw === this.playerTwoDraw){  // its a tie
      this.winner = "tie";                                 // value of -1 is a tie
  } else {
      // search the rule array to find the rule that contains player1's draw and player2's draw
      var rule = rules.find(element => element[0] === this.playerOneDraw &&
                                        element[1] === this.playerTwoDraw);
      (rule) ? this.winner = this.game.player1.name : this.winner = this.game.player2.name;   // if rule is found then player 1 wins, else player 2 wins
  }
  alert(`
Player ONE (${this.game.player1.human ? "human": "computer" }) had: ${this.playerOneDraw}
Player TWO (${this.game.player2.human ? "human": "computer"}) had: ${this.playerTwoDraw}
    
${(this.winner === "tie")?"It's a tie!":`Player ${this.winner} is the WINNER!`}`); 
}

var rps = new RPS();
rps.play();

// safely handles circular references
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};


console.log(JSON.safeStringify(rps, 2));