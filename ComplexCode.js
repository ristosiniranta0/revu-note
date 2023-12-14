/*
   Filename: ComplexCode.js
   Description: This JavaScript code is a complex implementation of a casino game called "Blackjack". It includes various functions and objects to simulate the game's mechanics, such as managing players, dealing cards, calculating scores, and determining the winner. It also incorporates advanced concepts like closures, object inheritance, random number generation, and event handling.
*/

// Define the Deck object
function Deck() {
   const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
   const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
   const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

   let cards = [];

   // Initialize the deck with 52 cards
   (function createDeck() {
      for (let suit of suits) {
         for (let i = 0; i < ranks.length; i++) {
            cards.push({ suit: suit, rank: ranks[i], value: values[i] });
         }
      }
   })();

   // Shuffle the deck
   this.shuffle = function () {
      for (let i = cards.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [cards[i], cards[j]] = [cards[j], cards[i]];
      }
   };

   // Draw a card from the deck
   this.draw = function () {
      return cards.pop();
   };
}

// Define the Player object
function Player(name) {
   this.name = name;
   this.cards = [];
}

Player.prototype = {
   // Calculate the score of the player's hand
   calculateScore: function () {
      let score = 0;
      let hasAce = false;

      for (let card of this.cards) {
         score += card.value;
         if (card.rank === 'Ace') {
            hasAce = true;
         }
      }

      if (hasAce && score + 10 <= 21) {
         score += 10;
      }

      return score;
   }
};

// Define the Game object
const Game = {
   deck: new Deck(),
   players: [],
   currentPlayerIndex: 0,

   // Initialize the game
   init: function () {
      const numPlayers = this.getNumPlayers();

      for (let i = 0; i < numPlayers; i++) {
         const playerName = prompt(`Enter Player ${i + 1}'s name:`);
         this.players.push(new Player(playerName));
      }

      this.deck.shuffle();
      this.dealInitialCards();
   },

   // Get the number of players from the user
   getNumPlayers: function () {
      let numPlayers;

      do {
         numPlayers = parseInt(prompt('Enter the number of players (1-4):'));
      } while (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 4);

      return numPlayers;
   },

   // Deal initial cards to all players
   dealInitialCards: function () {
      for (let i = 0; i < 2; i++) {
         for (let player of this.players) {
            player.cards.push(this.deck.draw());
         }
      }
   },

   // Handle the player's turn
   handlePlayerTurn: function () {
      const currentPlayer = this.players[this.currentPlayerIndex];
      const choice = prompt(`${currentPlayer.name}'s turn. Do you want to (H)it or (S)tand?`).toLowerCase();

      if (choice === 'h') {
         currentPlayer.cards.push(this.deck.draw());
      } else if (choice === 's') {
         this.currentPlayerIndex++;
         if (this.currentPlayerIndex >= this.players.length) {
            this.endGame();
         } else {
            this.handlePlayerTurn();
         }
      } else {
         this.handlePlayerTurn();
      }
   },

   // End the game and determine the winner
   endGame: function () {
      let maxScore = -1;
      let winners = [];

      for (let player of this.players) {
         const score = player.calculateScore();

         if (score > maxScore && score <= 21) {
            maxScore = score;
            winners = [player.name];
         } else if (score === maxScore) {
            winners.push(player.name);
         }
      }

      if (winners.length > 0) {
         alert(`Congratulations ${winners.join(' and ')}! You won the game with a score of ${maxScore}!`);
      } else {
         alert('No winners! The game ends in a tie.');
      }
   },

   // Start the game
   start: function () {
      this.init();
      this.handlePlayerTurn();
   }
};

// Start the game
Game.start();
