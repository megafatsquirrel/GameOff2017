var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var sword;
var imp;
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
    player.facing = {
        top: false,
        left: false,
        right: false,
        down: true // default to this?
    };
    player.anchor.setTo(0.5, 0.5);
    player.inputEnabled = true;
    player.input.boundsSprite = worldBounds;
    game.camera.follow(player);

    sword = game.add.sprite(player.position.x, player.position.y, 'sword');
    sword.visible = false;

    imp = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'imp');
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        setPlayerFacing('left');
        sword.currentFacing = 'left';
        player.x -= speed;        
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        setPlayerFacing('right');
        sword.currentFacing = 'right';
        player.x += speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        setPlayerFacing('top');
        sword.currentFacing = 'top';
        player.y -= speed;        
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        setPlayerFacing('down');
        sword.currentFacing = 'down';
        player.y += speed;
    }

    // Attack
    if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
        sword.position.x = player.position.x;
        sword.position.y = player.position.y;
        sword.visible = true;
        game.time.events.add(250, removeSword, this, true);
    }

    if (sword.visible){
        if (Phaser.Rectangle.intersects(sword.getBounds(), imp.getBounds())){
            imp.visible = false; // handle death
        }
        sword.position.x = player.position.x;
        sword.position.y = player.position.y;
        adjustSwordPosition();
    }
}

function setPlayerFacing(face){
    if (face && typeof String){
        player.facing.top = face === 'top' ? true : false;
        player.facing.left = face === 'left' ? true : false;
        player.facing.right = face === 'right' ? true : false;
        player.facing.down = face === 'down' ? true : false;
    }else{
        console.warn('Please use a string, "top", "left", "right", or "down"');
    }

}

function adjustSwordPosition(){
    if(player.facing.top){
        sword.angle = 0;
        sword.position.y -= 60; // Add the height of the player
    }
    if(player.facing.left){
        sword.angle = 90;
        sword.position.y -= 10;
        sword.position.x -= 20; // Remove the width of the player
    }
    if(player.facing.right){
        sword.angle = -90;
        sword.position.y += 10;
        sword.position.x += 20; // Remove the width of the player
    }
    if(player.facing.down){
        sword.angle = 0;
        sword.position.y += 20;
    }
}

function removeSword(){
    sword.visible = false;
}