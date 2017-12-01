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
		style = { font: "24px Arial", fill: "#ffffff", align: "left" };
		game.add.text(30, 250, 'CONTROLS', style);
		game.add.text(30, 275, 'W A S D: move', style);
		game.add.text(30, 300, 'E: attack', style);
		game.add.text(30, 325, 'Q: block', style);
		game.add.text(30, 350, 'SHIFT: sprint', style);
	},
	listener: function(){
		this.game.state.start("mainGame");
	}
}