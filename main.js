var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('imp', 'assets/sprites/imp.png');
    game.load.image('player', 'assets/sprites/player.png');
}

function create() {
    game.add.sprite(100, 0, 'player');
    game.add.sprite(0, 0, 'imp');
}

function update() {
}