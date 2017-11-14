class GameEntity extends Phaser.Sprite {
    
    constructor(x, y, key, type, str, dex, int, vit) {
        super(game, x, y, key);
        this.type = type || 'fighter';
        this.str = str || 1;
        this.dex = dex || 1;
        this.int = int || 1;
        this.vit = vit || 1;
        this.speed = 100;

        this.facing = {
            top: false,
            left: false,
            right: false,
            down: true // default to this?
        };
    };

    setEntityFacing(face){
        if (face && typeof String){
            this.facing.top = face === 'top' ? true : false;
            this.facing.left = face === 'left' ? true : false;
            this.facing.right = face === 'right' ? true : false;
            this.facing.down = face === 'down' ? true : false;
        }else{
            console.warn('Please use a string, "top", "left", "right", or "down"');
        }
    }
} 