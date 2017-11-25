var startScreen = function(game) {};
startScreen.prototype = {
    create: function() {
		var image = game.add.sprite(0, 0, 'startScreen');
		image.inputEnabled = true;
		image.events.onInputDown.add(this.listener, this);
	},
	listener: function(){
		this.game.state.start("mainGame");
	}
}