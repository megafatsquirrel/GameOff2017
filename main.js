var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var speed = 4;
var worldBounds;

function preload() {
    // Set to current bg of 1000x1000
    game.world.setBounds(0, 0, 1000, 1000);

    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('imp', 'assets/sprites/imp.png');
    game.load.image('player', 'assets/sprites/player.png');
    game.load.image('sword', 'assets/sprites/sword.png');
}

function create() {
    worldBounds = game.add.sprite(game.world.centerX, game.world.centerY, 'grassField');
    worldBounds.anchor.set(0.5);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.inputEnabled = true;
    player.input.boundsSprite = worldBounds;
    game.camera.follow(player);

    game.add.sprite(game.world.centerX - 100, game.world.centerY, 'imp');
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