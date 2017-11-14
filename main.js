var game = new Phaser.Game(1000, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var player;
var imp;
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
    
    player.playerText = game.add.text(0, 0, "Player Exp: 0", {
        font: "24px Arial",
        fill: "#ff0044"
    });
    player.playerText.alignTo(player, Phaser.LEFT_BOTTOM, 16);

    player.sword = game.add.sprite(player.position.x, player.position.y, 'sword');
    player.swordSide = game.add.sprite(player.position.x, player.position.y, 'swordSide');
    player.sword.visible = false;
    player.swordSide.visible = false;

    player.shield = game.add.sprite(player.position.x, player.position.y, 'shield');
    player.shieldSide = game.add.sprite(player.position.x, player.position.y, 'shieldSide');
    player.shield.visible = false;
    player.shieldSide.visible = false;
        
    imp = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'imp');

    game.physics.arcade.enable([player, player.sword, player.swordSide, player.shield, player.shieldSide, imp]);
    player.body.collideWorldBounds = true;
    
    imp.body.immovable = true;
    player.swordSide.enableBody = false;
    player.sword.enableBody = false;    
    player.shield.enableBody = false;
    player.shieldSide.enableBody = false;
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.setEntityFacing('left');
        player.body.velocity.x = -player.speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.setEntityFacing('right');
        player.body.velocity.x = player.speed;
    } else {
        player.body.velocity.x = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.setEntityFacing('top');
        player.body.velocity.y = -player.speed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        player.setEntityFacing('down');
        player.body.velocity.y = player.speed;
    } else {
        player.body.velocity.y = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
        if (player.body.velocity.x !== 0 ) {
            player.body.velocity.x *= 5;
        }
        else if (player.body.velocity.y !== 0 ) {
            player.body.velocity.y *= 5;
        }
    }

    // Debug
    if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE)) {
        debugActive = debugActive ? false : true;
    }

    if (imp.alive) {
        game.physics.arcade.collide(player, imp);
    }

    // Attack
    if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
        player.sword.position.x = player.position.x;
        player.sword.position.y = player.position.y;
        player.shieldSide.position.x = player.position.x;
        player.shieldSide.position.y = player.position.y;
        if (player.facing.left || player.facing.right) {
            player.swordSide.visible = true;
            player.swordSide.enableBody = true;
            game.time.events.add(250, player.removeSwordSide, this, true);
        } else {
            player.sword.visible = true;
            player.sword.enableBody = true;
            game.time.events.add(250, player.removeSword, this, true);
        }
    }

    // Block
    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
        player.shield.position.x = player.position.x;
        player.shield.position.y = player.position.y;
        player.shieldSide.position.x = player.position.x;
        player.shieldSide.position.y = player.position.y;
        
        if (player.facing.left || player.facing.right) {
            player.shieldSide.visible = true;
            player.shieldSide.enableBody = true;
            game.time.events.add(250, player.removeShieldSide, this, this);
        } else {
            player.shield.visible = true;
            player.shield.enableBody = true;
            game.time.events.add(250, player.removeShield, this, this);
        }        
    }

    if (player.sword.enableBody || player.swordSide.enableBody) {
        if (game.physics.arcade.collide(player.sword, imp) || game.physics.arcade.collide(player.swordSide, imp)) {
            imp.kill(); // handle death
            player.exp += 10;
            player.playerText.setText("Player Exp: " + player.exp);
        }
        player.sword.position.x = player.position.x;
        player.sword.position.y = player.position.y;
        player.swordSide.position.x = player.position.x;
        player.swordSide.position.y = player.position.y;
        player.adjustSwordPosition();
    }

    if (player.shield.enableBody || player.shieldSide.enableBody) {
        player.shield.position.x = player.position.x;
        player.shield.position.y = player.position.y;
        player.shieldSide.position.x = player.position.x;
        player.shieldSide.position.y = player.position.y;
        player.adjustShieldPosition();
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