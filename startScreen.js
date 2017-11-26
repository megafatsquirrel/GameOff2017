var startScreen = function(game) {};
startScreen.prototype = {
    create: function() {
		var image = game.add.sprite(0, 0, 'startScreen');
		image.inputEnabled = true;
		image.events.onInputDown.add(this.listener, this);

		var style = { font: "14px Arial", fill: "#ff0044", align: "center" };
		game.add.text(32, 30, 'Click to start', style);
	},
	listener: function(){
		this.game.state.start("mainGame");
	}
}