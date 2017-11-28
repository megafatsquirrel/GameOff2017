var startScreen = function(game) {};
startScreen.prototype = {
    create: function() {
		var image = game.add.sprite(0, 0, 'startScreen');
		image.inputEnabled = true;
		image.events.onInputDown.add(this.listener, this);

		var style = { font: "64px Arial", fill: "#000000", align: "center" };
		game.add.text(330, 100, 'Gedsted Arena', style);
		style = { font: "48px Arial", fill: "#000000", align: "center" };
		game.add.text(410, 500, 'Click to start', style);
	},
	listener: function(){
		this.game.state.start("mainGame");
	}
}