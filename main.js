var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var speed = 4;

function preload() {
    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('imp', 'assets/sprites/imp.png');
    game.load.image('player', 'assets/sprites/player.png');
    game.load.image('sword', 'assets/sprites/sword.png');
}

function create() {
    game.add.sprite(0, 0, 'grassField');
    player = game.add.sprite(100, 0, 'player');
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);

    game.add.sprite(0, 0, 'imp');
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        player.x -= speed;        
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        player.x += speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        player.y -= speed;        
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        player.y += speed;
    }
}