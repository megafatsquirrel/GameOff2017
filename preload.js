var preload = function(game){
    swordAudio = null;
}
preload.prototype = {
	preload: function(){             
        game.load.audio('stab', 'assets/sounds/stab.mp3');
        
        game.load.image('startScreen', 'assets/sprites/startScreen.png');
        game.load.image('grassField', 'assets/sprites/grassField.png');
        game.load.image('pillar', 'assets/sprites/pillar.png');
        game.load.image('leftBounds', 'assets/sprites/leftBounds.png');
        game.load.image('topBounds', 'assets/sprites/topBounds.png');
        game.load.image('wolf', 'assets/sprites/imp.png');
        game.load.image('wolfBite', 'assets/sprites/wolfBite.png');
        game.load.spritesheet('player', 'assets/sprites/player.png', 40, 40, 16);
        game.load.spritesheet('playerHealthBar', 'assets/sprites/playerHealth.png', 100, 20, 2);
        game.load.spritesheet('playerStaminaBar', 'assets/sprites/playerStamina.png', 100, 20, 2);
        game.load.spritesheet('sword', 'assets/sprites/sword.png', 20, 40, 4);
        game.load.spritesheet('swordSide', 'assets/sprites/swordSide.png', 40, 20, 4);
        game.load.spritesheet('shield', 'assets/sprites/shield.png');
        game.load.spritesheet('shieldSide', 'assets/sprites/shieldSide.png');
	},
  	create: function(){
        swordAudio = game.add.audio('stab');
        this.game.sound.setDecodedCallback([ swordAudio ], this.startGame, this);
    },
    startGame: function(){
        this.game.state.start('startScreen', startScreen);
    }
}