var game = new Phaser.Game(1000, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var player;
var wolf;
var worldBounds;
var debugActive = false;
var attackInput;
var worldLeftSide;
var pillar;
var boundGroup;

var playerHealthBar;
var playerHealthBarBG;
var playerStaminaBar;
var playerStaminaBarBG;

function preload() {
    // Set to current bg of 1000x1000
    game.world.setBounds(0, 0, 1000, 1000);

    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('pillar', 'assets/sprites/pillar.png');
    game.load.image('leftBounds', 'assets/sprites/leftBounds.png');
    game.load.image('topBounds', 'assets/sprites/topBounds.png');

    game.load.image('wolf', 'assets/sprites/imp.png');
    game.load.image('wolfBite', 'assets/sprites/wolfBite.png');
    game.load.image('player', 'assets/sprites/player.png');
    game.load.spritesheet('playerHealthBar', 'assets/sprites/playerHealth.png', 100, 20, 2);
    game.load.spritesheet('playerStaminaBar', 'assets/sprites/playerStamina.png', 100, 20, 2);
    game.load.spritesheet('sword', 'assets/sprites/sword.png', 20, 40, 1);
    game.load.spritesheet('swordSide', 'assets/sprites/swordSide.png');
    game.load.spritesheet('shield', 'assets/sprites/shield.png');
    game.load.spritesheet('shieldSide', 'assets/sprites/shieldSide.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    worldBounds = game.add.sprite(game.world.centerX, game.world.centerY, 'grassField');
    worldBounds.anchor.set(0.5);

    player = game.world.add(new Player(40, 40, 'player'));
    
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);

    player.sword = game.add.sprite(player.position.x, player.position.y, 'sword');
    player.swordSide = game.add.sprite(player.position.x, player.position.y, 'swordSide');
    player.sword.visible = false;
    player.swordSide.visible = false;

    player.shield = game.add.sprite(player.position.x, player.position.y, 'shield');
    player.shieldSide = game.add.sprite(player.position.x, player.position.y, 'shieldSide');
    player.shield.visible = false;
    player.shieldSide.visible = false;
        
    wolf = game.world.add(new Wolf(game.world.centerX - 100, game.world.centerY, 'wolf'));
    wolf.bite = game.add.sprite(wolf.position.x, wolf.position.y, 'wolfBite');
    wolf.bite.anchor.setTo(0.5, 0.5);
    wolf.bite.visible = false;

    game.physics.arcade.enable([player, player.sword, player.swordSide, player.shield, player.shieldSide, 
                                wolf, wolf.bite]);

    player.body.collideWorldBounds = true;
    player.swordSide.enableBody = false;
    player.sword.enableBody = false;    
    player.shield.enableBody = false;
    player.shieldSide.enableBody = false;

    wolf.bite.enableBody = false;

    attackInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
    attackInput.onDown.add(player.attack);
    attackInput.onUp.add(player.clearAttack);

    blockInput = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    blockInput.onDown.add(player.block);
    blockInput.onUp.add(player.clearAttack);

    wolf.body.collideWorldBounds = true;

    boundGroup = game.add.physicsGroup();
    pillar = boundGroup.create(450, 200, 'pillar');
    pillar.body.immovable = true;

    playerHealthBarBG = game.add.sprite(120, 20, 'playerHealthBar');
    playerHealthBarBG.fixedToCamera = true;
    playerHealthBarBG.frame = 1;
    playerHealthBar = game.add.sprite(120, 20, 'playerHealthBar');
    playerHealthBar.fixedToCamera = true;
    playerHealthBar.frame = 2;
    playerStaminaBarBG = game.add.sprite(120, 50, 'playerStaminaBar');
    playerStaminaBarBG.frame = 1;
    playerStaminaBarBG.fixedToCamera = true;
    playerStaminaBar = game.add.sprite(120, 50, 'playerStaminaBar');
    playerStaminaBar.fixedToCamera = true;
    playerStaminaBar.frame = 2;

}

function follow() {
    var distance = this.game.math.distance(wolf.x, wolf.y, player.x, player.y);
    if (distance > 40) {
        var rotation = this.game.math.angleBetween(wolf.x, wolf.y, player.x, player.y);
        wolf.body.velocity.x = Math.cos(rotation) * 100;
        wolf.body.velocity.y = Math.sin(rotation) * 100;

        if (Math.abs(wolf.body.velocity.x) > Math.abs(wolf.body.velocity.y)) {
            if (wolf.body.velocity.x > 0) {
                wolf.setEntityFacing('right');
            }else if (wolf.body.velocity.x < 0) {
                wolf.setEntityFacing('left');
            }
        } else if (Math.abs(wolf.body.velocity.x) < Math.abs(wolf.body.velocity.y)) { 
            if (wolf.body.velocity.y > 0) {
                wolf.setEntityFacing('down');
            }else if (wolf.body.velocity.y < 0) {
                wolf.setEntityFacing('top');
            }
        }

    } else {
        wolf.body.velocity.setTo(0, 0);
    }
}

function update() {
    follow();

    // MOVEMENT
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
        if (player.stamina >= 4) {
            player.stamina -= 4;
            playerStaminaBar.scale.x = player.stamina / 100;
            if (player.body.velocity.x !== 0 ) {
                player.body.velocity.x *= 5;
            }
            else if (player.body.velocity.y !== 0 ) {
                player.body.velocity.y *= 5;
            }
        }
    }

    if (player.stamina < 100){
        player.stamina++;
        playerStaminaBar.scale.x = player.stamina / 100;
    }

    if (wolf.alive && player.alive) {
        var distance = this.game.math.distance(wolf.x, wolf.y, player.x, player.y);
        if (distance < 50 && !wolf.isAttackOnCooldown) {
            wolf.attack();
        }
        
        if (wolf.bite.enableBody && game.physics.arcade.collide(player, wolf.bite)) {
            if ( !wolf.biteHasHit ) {
                wolf.biteHasHit = true;
                if (player.health > 0) {
                    player.health -= 2;
                    playerHealthBar.scale.x = player.health / 100;
                }else if (player.health <= 0) {
                    player.kill();
                    // handle game over
                }
            }
        }
    }

    if (player.sword.enableBody || player.swordSide.enableBody) {
        if (!player.hasSwordHit &&
            (game.physics.arcade.collide(player.sword, wolf) || 
            game.physics.arcade.collide(player.swordSide, wolf))) {
            wolf.handleDamage(player.swordDamage);
            player.hasSwordHit = true;
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

    if (game.physics.arcade.collide(player, boundGroup, collisionHandler, processHandler, this)) {
        console.log('collide');
    }

    if (game.physics.arcade.collide(wolf, boundGroup, collisionHandler, processHandler, this)) {
        console.log('collide - wolf');
    }

    // DEBUG
    if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE)) {
        debugActive = debugActive ? false : true;
    }
}

function render() {
    game.debug.text('Health', 30, 32);
    game.debug.text('Stamina', 30, 64);
    game.debug.text('Wolf\'s health: ' + wolf.health, 770, 32);

    if (debugActive) {
        game.debug.bodyInfo(player, 40, 40);
        game.debug.body(player);
        game.debug.body(wolf);
        game.debug.body(player.sword);
        game.debug.body(player.swordSide);
        game.debug.body(player.shield);
        game.debug.body(player.shieldSide);
    }   
}

function processHandler (player, other) {
    console.log('processHandler');
}

function collisionHandler (player, other) {
    console.log('collisionHandler');
}