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

var mainLayer;
var attackLayer;
var bgLayer;

var mainGame = function(game) {};

mainGame.prototype = {
    preload: function() {
        // Set to current bg of 1000x1000
        game.world.setBounds(0, 0, 1000, 1000);
    },
    create: function() {
        

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        worldBounds = game.add.sprite(game.world.centerX, game.world.centerY, 'grassField');
        worldBounds.anchor.set(0.5);

        player = game.world.add(new Player(40, 40, 'player'));
        player.animations.add('walkDown', [0, 1, 2, 3], 30, false);
        player.animations.add('walkRight', [4, 5, 6, 7], 30, false);
        player.animations.add('walkLeft', [8, 9, 10, 11], 30, false);
        player.animations.add('walkUp', [12, 13, 14, 15], 30, false);
        
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);

        player.sword = game.add.sprite(player.position.x, player.position.y, 'sword');
        player.sword.animations.add('stab');
        player.swordSide = game.add.sprite(player.position.x, player.position.y, 'swordSide');
        player.swordSide.animations.add('stab');
        player.sword.visible = false;
        player.swordSide.visible = false;
        player.swordAudio = game.add.audio('stab');

        player.shield = game.add.sprite(player.position.x, player.position.y, 'shield');
        player.shieldSide = game.add.sprite(player.position.x, player.position.y, 'shieldSide');
        player.shield.visible = false;
        player.shieldSide.visible = false;
            
        
        wolf = game.world.add(new Wolf(game.world.centerX - 100, game.world.centerY, 'wolf'));
        wolf.anchor.setTo(0.5, 0.5);
        wolf.bite.anchor.setTo(0.5, 0.5);
        wolf.bite.visible = false;
        wolf.dangerAreaSide.visible = false;
        wolf.dangerAreaTop.visible = false;

        game.physics.arcade.enable([player, player.sword, player.swordSide, player.shield, player.shieldSide, 
                                    wolf, wolf.bite]);

        player.body.collideWorldBounds = true;
        player.swordSide.enableBody = false;
        player.sword.enableBody = false;    
        player.shield.enableBody = false;
        player.shieldSide.enableBody = false;

        wolf.bite.enableBody = false;

        // create layers
        mainLayer = game.add.group();
        mainLayer.add(wolf);
        mainLayer.add(player);

        attackInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
        attackInput.onDown.add(player.attack);
        attackInput.onUp.add(player.clearButtonDown);

        blockInput = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        blockInput.onDown.add(player.block);
        blockInput.onUp.add(player.clearButtonDown);

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
    },
    update: function() {

        if (wolf.alive) {
            wolf.logic();
        }
        
        // MOVEMENT
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            player.setEntityFacing('left');
            player.body.velocity.x = -player.speed;
            player.animations.play('walkLeft');
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            player.setEntityFacing('right');
            player.body.velocity.x = player.speed;
            player.animations.play('walkRight');
        } else {
            player.body.velocity.x = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            player.setEntityFacing('top');
            player.body.velocity.y = -player.speed;
            player.animations.play('walkUp');
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            player.setEntityFacing('down');
            player.body.velocity.y = player.speed;
            player.animations.play('walkDown');
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

        if (wolf.bite.enableBody && game.physics.arcade.collide(player, wolf.bite)) {
            if ( !wolf.biteHasHit && !player.isBlocking ) {
                wolf.biteHasHit = true;
                wolf.isRetreating = true;
                game.time.events.add(game.rnd.integerInRange(1000, 5000), wolf.removeRetreating, this, true);
                if (player.health > 0) {
                    player.health -= 2;
                    if (wolf.isSpecialAttack) {
                        player.health -= 60;
                        game.camera.shake(0.1, 100);
                    }else{
                        game.camera.shake(0.001, 100);
                    }
                    playerHealthBar.scale.x = player.health / 100;
                }else if (player.health <= 0) {
                    player.kill();
                    // handle game over
                }
            } else if (player.isBlocking) {
                console.log('BLOCKING');
                wolf.biteHasHit = true;
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

        if (game.physics.arcade.collide(player, boundGroup, this.collisionHandler, this.processHandler, this)) {
            console.log('collide');
        }

        if (game.physics.arcade.collide(wolf, boundGroup, this.collisionHandler, this.processHandler, this)) {
            console.log('collide - wolf');
        }

        // DEBUG
        if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE)) {
            debugActive = debugActive ? false : true;
        }
    },
    render: function() {
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
    },
    processHandler: function(player, other) {
        console.log('processHandler');
    },
    collisionHandler: function(player, other) {
        console.log('collisionHandler');
    }
}