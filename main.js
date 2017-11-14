var game = new Phaser.Game(1000, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var player;
var playerText;
var sword;
var swordSide;
var shield;
var imp;
var speed = 100;
var worldBounds;
var debugActive = false;

function preload() {
    // Set to current bg of 1000x1000
    game.world.setBounds(0, 0, 1000, 1000);

    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('imp', 'assets/sprites/imp.png');
    game.load.image('player', 'assets/sprites/player.png');
    game.load.spritesheet('sword', 'assets/sprites/sword.png', 20, 40, 1);
    game.load.spritesheet('swordSide', 'assets/sprites/swordSide.png');
    game.load.spritesheet('shield', 'assets/sprites/shield.png');
    game.load.spritesheet('shieldSide', 'assets/sprites/shieldSide.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    worldBounds = game.add.sprite(game.world.centerX, game.world.centerY, 'grassField');
    worldBounds.anchor.set(0.5);

    player = game.world.add(new Player(40, 40, 'player', 'warrior', 5, 3, 2, 5));
    
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

    shield = game.add.sprite(player.position.x, player.position.y, 'shield');
    shieldSide = game.add.sprite(player.position.x, player.position.y, 'shieldSide');
    shield.visible = false;
    shieldSide.visible = false;
        
    imp = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'imp');

    game.physics.arcade.enable([player, sword, swordSide, shield, shieldSide, imp]);
    player.body.collideWorldBounds = true;
    
    imp.body.immovable = true;
    swordSide.enableBody = false;
    sword.enableBody = false;    
    shield.enableBody = false;
    shieldSide.enableBody = false;
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        player.setEntityFacing('left');
        sword.currentFacing = 'left';
        player.body.velocity.x = -speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        player.setEntityFacing('right');
        sword.currentFacing = 'right';
        player.body.velocity.x = speed;
    }else{
        player.body.velocity.x = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        player.setEntityFacing('top');
        sword.currentFacing = 'top';
        player.body.velocity.y = -speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        player.setEntityFacing('down');
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
    if (game.input.keyboard.isDown(Phaser.Keyboard.E)){
        sword.position.x = player.position.x;
        sword.position.y = player.position.y;
        shieldSide.position.x = player.position.x;
        shieldSide.position.y = player.position.y;
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

    // Block
    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)){
        shield.position.x = player.position.x;
        shield.position.y = player.position.y;
        shieldSide.position.x = player.position.x;
        shieldSide.position.y = player.position.y;
        
        if (player.facing.left || player.facing.right){
            shieldSide.visible = true;
            shieldSide.enableBody = true;
            game.time.events.add(250, removeShieldSide, this, this);
        }else{
            shield.visible = true;
            shield.enableBody = true;
            game.time.events.add(250, removeShield, this, this);
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

    if (shield.enableBody || shieldSide.enableBody) {
        shield.position.x = player.position.x;
        shield.position.y = player.position.y;
        shieldSide.position.x = player.position.x;
        shieldSide.position.y = player.position.y;
        adjustShieldPosition();
    }
}

function render() {
    if (debugActive) {
        game.debug.bodyInfo(player, 40, 40);
        game.debug.body(player);
        game.debug.body(imp);
        game.debug.body(sword);
        game.debug.body(swordSide);
        game.debug.body(shield);
        game.debug.body(shieldSide);
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

function adjustShieldPosition(){
    if(player.facing.top){
        shield.position.y -= 40;
        shield.position.x -= 10; // Add the height of the player
    }
    if(player.facing.left){
        shieldSide.position.y -= 10;
        shieldSide.position.x -= 40; // Remove the width of the player
    }
    if(player.facing.right){
        shieldSide.position.y -= 10;
        shieldSide.position.x += 30; // Remove the width of the player
    }
    if(player.facing.down){
        shield.position.y += 30;
        shield.position.x -= 10;
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

function removeShield(){
    shield.visible = false;
    shield.enableBody = false;
}

function removeShieldSide(){
    shieldSide.visible = false;
    shieldSide.enableBody = false;
}