
//Card

//values held by cards
let suits = ['H', 'S', 'D', 'C'];
let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'J', 'Q', 'K'];
//let values = ['J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J']; // just for jack testing






//Deck

//hold cards, order cards, give and take cards

let Deck = {};
Deck.cards = [];

//creates array of card objects with values
Deck.makeCards = function() {
    suits.forEach((suit, index) => {
        values.forEach( value => {
            Deck.cards.push({suit, value})
        })
    });
};

//  Deck.getSuit = function(card){
//      return card.suit;
// };
//
// Deck.getValue = function(card){
//     return card.value;
// };


//randomizes the order of the cards passed in to create deck
Deck.shuffle = function() {
    if (!Deck.isDeck(Deck.cards)) {
        console.log(Deck.isDeck);
        return;
    }
    let currentIndex = Deck.cards.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = Deck.cards[currentIndex];
        Deck.cards[currentIndex] = Deck.cards[randomIndex];
        Deck.cards[randomIndex] = temporaryValue;
    }
    return Deck.cards;
};

//removes card from top of the deck
Deck.draw = function() {
    if( Deck.isDeck() ) {
        return (Deck.cards.shift());
    }
};

Deck.isDeck = function() {
    let validDeck = true;
    if(!Array.isArray(Deck.cards)) {
        console.error("Received something that wasn't a deck", Deck.cards);
        validDeck = false;
    }
    return validDeck;
};






//Discard

//know it's contents, order of cards

let discardPile = {};

discardPile.cards = [];

discardPile.addCard = function(card){
    discardPile.cards.unshift(card);
};

// displays the last card played
discardPile.topCard = function(){
    return discardPile.cards[0];
};







//Player

//exist, have hand, play card, draw card

class Player {
    constructor (hand, index, name) {
        this._hand = hand;
        this._playerIndex = index;
        this._playerName = name;
        this._turn = false;
    }

    get hand() {
        return this._hand;
    }

    get name() {
        return this._playerName;
    }

    get turn() {
        return this._turn;
    }

    get playerIndex() {
        return this._playerIndex;
    }

    set playerIndex(i) {
        this._playerIndex = i;
    }

    receiveCard(card) {
        this._hand.push(card);
    }

    playCard(cardIndex) {
        let card = this._hand[cardIndex];
        game.playedCardCheckRules(this, card);
        if(this._turn) {
            if(game.cardMatch(card)) {
                game.discardCard(this._hand.splice(cardIndex,1));
            }
            game.findWin(this);
            game.updateTurn(this._playerIndex);
        }
    }
    
    

    set turn(turn) {
        this._turn = turn;
    }

    passTurn() {
        game.passTurnCheckRules(this._playerIndex);
        if(this._turn){
            game.updateTurn(this._playerIndex);
            game.updateTurn(this._playerIndex + 1);
        }
    }
}







//Game

//have players, have deck, give cards to players, take cards from players, establish turn order and active players, track rules

let game = {};
game.playDeck = Deck.shuffle(Deck.makeCards());
game.playerList = [];

// deals cards to all players
game.startGame = function(numPlayers){
    for (let i = 0; i < numPlayers; i++){
        game.playerList.push(new Player(game.dealHand(), i, ('player' + i)));
    }
    game.playerList[0].turn = true;
    discardPile.cards.push(Deck.draw());
};

// creates an array of seven cards to give to a player
game.dealHand = function(){
    let hand = [];
    for (let i = 0; i < 7; i++){
        hand.unshift(Deck.draw(game.playDeck));
    }
    return hand;
};

game.drawCard = function(player) {
    player.receiveCard(Deck.draw(game.playDeck));
};

game.updateTurn = function(currentPlayerIndex) {
    let nextPlayerIndex = currentPlayerIndex + 1 >= game.playerList.length ? 0 : currentPlayerIndex + 1;
    game.disableTurn(currentPlayerIndex);
    game.enableTurn(nextPlayerIndex);
};

game.disableTurn = function(playerIndex) {
    game.playerList[playerIndex].turn = false;
};

game.enableTurn = function() {
    game.playerList[playerIndex] = true;
};

game.findWhoseTurn = function(){
    let playerIndex;
    for(let i = 0; i < game.playerList.length; i++) {
        if(game.playerList[i].turn){
            playerIndex = i;
        }
    }
    return playerIndex;
};

game.eightPlayed = function(){
    game.playerList.reverse();
    for(let i = 0; i < game.playerList.length; i++){
        game.playerList[i].playerIndex = i;
    }
};

game.acePlayed = function(){
    let playerIndex = game.findWhoseTurn();
    game.updateTurn(this.playerIndex);

}

game.discardCard = function(card){
    let value = card[0].value;
    switch(value) { //currently undefined -- why?
        case 'A':
            //game.acePlayed();
            break;
        case '8':
            game.eightPlayed();
            break;
        default:
            break;
        case 'J':
            game.jackPlayed(card);  //suit determination TBA
            break;
    }
    discardPile.addCard(card);
   //checkRules();
};

game.cardMatch = function(card){
    return ( (card[0].suit === discardPile.topCard()[0].suit) || (card[0].value === discardPile.topCard()[0].value))
};

game.passTurnCheckRules = function(i){
    let player = game.playerList[i];
    if(!player.turn) {
        game.drawCard(player);
        return;
    } else {
        return;
    }
};

game.playedCardCheckRules = function(player, card){
    if(!player.turn) {
        game.drawCard(player);
        return;
    } else if (!game.cardMatch(card)){
        game.drawCard(player);
        return;
    } else {
        return;
    }
};

game.jackPlayed = function(card, /*suit*/){  //suit declaration TBA
    console.log(card);
    let newSuit = (Math.floor(Math.random * 4));
    switch (newSuit){
        case 0:
            card[0].suit = 'Heart';
            break;
        case 1:
            card[0].suit = 'Club';
            break;
        case 2:
            card[0].suit = 'Diamond';
            break;
        default:
            card[0].suit = 'Spade';
            break
    }
    console.log(card);
    return card
};

game.findWin = function(player){
    if (player.hand.length === 0){
        console.log('Congratulations, Player ' + (player.playerIndex + 1) + ' - you have won this round of Mao');
        //end game
    }
};










//Testing Code

//jacks test code
// console.log('');
// console.log(discardPile.cards);
// console.log('');
// game.startGame(2);
// console.log(game.playerList[0].hand);
// console.log('');
// console.log(game.playerList[0].hand[0]);
// console.log('');
// console.log(JSON.stringify(discardPile.cards));
// game.playerList[0].playCard(0);
// console.log('');
// console.log(JSON.stringify(discardPile.cards));
// console.log('');
// console.log(game.playerList[0].hand);
// //console.log(discardPile.cards);

//8 is played testing code (keep running until it plays an 8)
game.startGame(3);
console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
console.log(`Player Name List: ${game.playerList[0].name} + ${game.playerList[1].name} + ${game.playerList[2].name}`);
console.log(`Player Index List: ${game.playerList[0].playerIndex} + ${game.playerList[1].playerIndex} + ${game.playerList[2].playerIndex}`);
let cardToDiscard = game.playerList[0].hand.splice(0,1);
console.log(cardToDiscard);
game.discardCard(cardToDiscard);
console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
console.log(`Player Name List: ${game.playerList[0].name} + ${game.playerList[1].name} + ${game.playerList[2].name}`);
console.log(`Player Index List: ${game.playerList[0].playerIndex} + ${game.playerList[1].playerIndex} + ${game.playerList[2].playerIndex}`);

//turn order testing code
// game.startGame(3);
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
// game.playerList[0].passTurn();
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
// game.playerList[1].passTurn();
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
// game.playerList[2].passTurn();
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);


//receiving a penalty for playing out of turn test
// game.startGame(3);
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
// console.log("Player's Original Hand:");
// console.log(game.playerList[1].hand);
// game.playerList[1].playCard(0);
// console.log("Player's New Hand:");
// console.log(game.playerList[1].hand);
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);


//playing a card (either will work or will receive a penalty)
// game.startGame(3);
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);
// console.log("Top Card in Discard:");
// console.log("Card Selected for Play:");
// console.log(game.playerList[0].hand[0]);
// console.log(discardPile.topCard());
// console.log("Player's Hand Before Turn:");
// console.log(game.playerList[0].hand);
// game.playerList[0].playCard(0);
// console.log("Player's Hand After Turn:");
// console.log(game.playerList[0].hand);
// console.log("Top Card in Discard:");
// console.log(discardPile.topCard());
// console.log("Second Card in Discard:");
// console.log(discardPile.cards[1]);
// console.log(`Player Turn List: ${game.playerList[0].turn} + ${game.playerList[1].turn} + ${game.playerList[2].turn}`);


//card match test code
// game.startGame(3);
// console.log("Top Card in Discard:");
// console.log(discardPile.topCard());
// console.log('Card Chosen to Play:');
// console.log(game.playerList[0].hand[0]);
// console.log("Player's Hand Before Turn:");
// console.log(game.playerList[0].hand);
// console.log(`Card Match: ${game.cardMatch(game.playerList[0].hand[0])}`);
// game.playerList[0].playCard(0);
// console.log("Player's Hand After Turn:");
// console.log(game.playerList[0].hand);
// console.log("Top Card in Discard:");
// console.log(discardPile.topCard());
// console.log("Second Card in Discard:");
// console.log(discardPile.cards[1]);






//Notes
    //function checkRules(card, play)

    //function continuePlay()

    //cardToPlay - takes card played by player, moves it to discard

    //cardToHold - takes card from deck, gives it to player

    //whoseTurn - points to active player in order

    //creating certain number of players

    //if game.playdeck.length <= 0, add new deck

    //if everyone passes, place a new card from the deck

    //if cardMatch doesn't pass, don't allow card to be discarded, give penalty

// for (let i = 0; i < game.playerList[0].hand.length; i++){
//     let suit = game.playerList[0].hand[i][0].suit;
//     if (suit === 'J'){
//         game.playerList[0].playCard(i);
//         console.log(discardPile.topCard());
//         break;
//     }
// }



//Rule List
    //eights - use function to reverse the order of playerList, find current player, move along
    //kings, queens, sevens - use button press before sending in, treat message as a second parameter
        //nice days - start counter with first seven played, next person must press button once more than the last
        //OR have a separate button for verys
    //ace - turn skipping already exists, right?
    //jacks - pass in new suit as a second parameter (like the above), add invisible card to discard, value 'none' suit (new suit)



