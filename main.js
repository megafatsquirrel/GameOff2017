var game = new Phaser.Game(1000, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var player;
var wolf;
var worldBounds;
var debugActive = false;
var attackInput;
var worldLeftSide;
var pillar;
var boundGroup;

function preload() {
    // Set to current bg of 1000x1000
    game.world.setBounds(0, 0, 1000, 1000);

    game.load.image('grassField', 'assets/sprites/grassField.png');
    game.load.image('pillar', 'assets/sprites/pillar.png');
    game.load.image('leftBounds', 'assets/sprites/leftBounds.png');
    game.load.image('topBounds', 'assets/sprites/topBounds.png');

    game.load.image('wolf', 'assets/sprites/imp.png');
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

    game.physics.arcade.enable([player, player.sword, player.swordSide, player.shield, player.shieldSide, wolf]);

    player.body.collideWorldBounds = true;
    player.swordSide.enableBody = false;
    player.sword.enableBody = false;    
    player.shield.enableBody = false;
    player.shieldSide.enableBody = false;

    attackInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
    attackInput.onDown.add(player.attack);
    attackInput.onUp.add(player.clearAttack);

    blockInput = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    blockInput.onDown.add(player.block);
    blockInput.onUp.add(player.clearAttack);

    //wolf.body.immovable = true;
    wolf.body.collideWorldBounds = true;

    boundGroup = game.add.physicsGroup();
    pillar = boundGroup.create(450, 200, 'pillar');
    pillar.body.immovable = true;

    graphics = game.add.graphics(100, 100);
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(250, 220);
    graphics.lineTo(50, 220);
    graphics.lineTo(50, 50);

    //var test = game.world.add(0, 0, graphics.drawRect(10, 10, 100, 100));
    //test.fixedToCamera = true;

}

function follow() {
    var distance = this.game.math.distance(wolf.x, wolf.y, player.x, player.y);
    if (distance > 40) {
        var rotation = this.game.math.angleBetween(wolf.x, wolf.y, player.x, player.y);
        wolf.body.velocity.x = Math.cos(rotation) * 100;
        wolf.body.velocity.y = Math.sin(rotation) * 100;
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
    }

    if (wolf.alive) {
        game.physics.arcade.collide(player, wolf);
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
    game.debug.text('Player\'s health: ' + player.health, 32, 32);
    game.debug.text('Player\'s stamina: ' + player.stamina, 32, 64);
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