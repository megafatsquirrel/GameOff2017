var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var player;
var playerText;
var sword;
var swordSide;
var imp;
var speed = 100;
var worldBounds;
var debugActive = true;

function preload() {
    // Set to current bg of 1000x1000
    game.world.setBounds(0, 0, 1000, 1000);

    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('imp', 'assets/sprites/imp.png');
    game.load.image('player', 'assets/sprites/player.png');
    game.load.spritesheet('sword', 'assets/sprites/sword.png', 20, 40, 1);
    game.load.spritesheet('swordSide', 'assets/sprites/swordSide.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    worldBounds = game.add.sprite(game.world.centerX, game.world.centerY, 'grassField');
    worldBounds.anchor.set(0.5);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    player.facing = {
        top: false,
        left: false,
        right: false,
        down: true // default to this?
    };
    player.exp = 0;
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    
    playerText = game.add.text(0, 0, "Player Exp: 0", {
        font: "24px Arial",
        fill: "#ff0044"
    });
    playerText.alignTo(player, Phaser.LEFT_BOTTOM, 16);

    sword = game.add.sprite(player.position.x, player.position.y, 'sword');
    swordSide = game.add.sprite(player.position.x, player.position.y, 'swordSide');
    sword.visible = false;
    swordSide.visible = false;
        
    imp = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'imp');

    game.physics.arcade.enable([player, sword, swordSide, imp]);
    player.body.collideWorldBounds = true;
    
    imp.body.immovable = true;
    swordSide.enableBody = false;
    sword.enableBody = false;
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        setPlayerFacing('left');
        sword.currentFacing = 'left';
        player.body.velocity.x = -speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        setPlayerFacing('right');
        sword.currentFacing = 'right';
        player.body.velocity.x = speed;
    }else{
        player.body.velocity.x = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        setPlayerFacing('top');
        sword.currentFacing = 'top';
        player.body.velocity.y = -speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        setPlayerFacing('down');
        sword.currentFacing = 'down';
        player.body.velocity.y = speed;
    }else{
        player.body.velocity.y = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        if (player.body.velocity.x !== 0 ) {
            player.body.velocity.x *= 5;
        }
        else if (player.body.velocity.y !== 0 ) {
            player.body.velocity.y *= 5;
        }
    }

    // Debug
    if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE)){
        debugActive = debugActive ? false : true;
    }

    if (imp.alive) {
        game.physics.arcade.collide(player, imp);
    }

    // Attack
    if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
        sword.position.x = player.position.x;
        sword.position.y = player.position.y;
        if (player.facing.left || player.facing.right){
            swordSide.visible = true;
            swordSide.enableBody = true;
            game.time.events.add(250, removeSwordSide, this, true);
        }else{
            sword.visible = true;
            sword.enableBody = true;
            game.time.events.add(250, removeSword, this, true);
        }
    }

    if (sword.enableBody || swordSide.enableBody){
        if (game.physics.arcade.collide(sword, imp) || game.physics.arcade.collide(swordSide, imp)){
            imp.kill(); // handle death
            player.exp += 10;
            playerText.setText("Player Exp: " + player.exp);
        }
        sword.position.x = player.position.x;
        sword.position.y = player.position.y;
        swordSide.position.x = player.position.x;
        swordSide.position.y = player.position.y;
        adjustSwordPosition();
    }
}

function render() {
    if (debugActive) {
        game.debug.bodyInfo(player, 40, 40);
        game.debug.body(player);
        game.debug.body(imp);
        game.debug.body(sword);
        game.debug.body(swordSide);
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
        sword.position.y -= 60; // Add the height of the player
    }
    if(player.facing.left){
        swordSide.position.y -= 10;
        swordSide.position.x -= 100; // Remove the width of the player
    }
    if(player.facing.right){
        swordSide.position.y -= 10;
        swordSide.position.x += 20; // Remove the width of the player
    }
    if(player.facing.down){
        sword.position.y += 20;
    }
}

function removeSword(){
    sword.visible = false;
    sword.enableBody = false;
}

function removeSwordSide(){
    swordSide.visible = false;
    swordSide.enableBody = false;
}