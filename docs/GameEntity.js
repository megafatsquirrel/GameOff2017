class GameEntity extends Phaser.Sprite {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(game, x, y, key);
        this.type = type || 'fighter';
        this.str = str || 1;
        this.dex = dex || 1;
        this.int = int || 1;
        this.vit = vit || 1;
        this.speed = 100;
        this.isAttacking = false;

        this.facing = {
            top: false,
            left: false,
            right: false,
            down: true // default to this?
        };
    }

    setEntityFacing(face){
        if (typeof String && face){
            this.facing.top = face === 'top' ? true : false;
            this.facing.left = face === 'left' ? true : false;
            this.facing.right = face === 'right' ? true : false;
            this.facing.down = face === 'down' ? true : false;
        }else{
            console.warn('Please use a string, "top", "left", "right", or "down"');
        }
    }

    follow(target) {
        var distance = this.game.math.distance(this.x, this.y, target.x, target.y);
        if (distance > 40) {
            var rotation = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
            this.body.velocity.x = Math.cos(rotation) * 100;
            this.body.velocity.y = Math.sin(rotation) * 100;

            if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
                if (this.body.velocity.x > 0) {
                    this.setEntityFacing('right');
                    this.frame = 2;
                }else if (this.body.velocity.x < 0) {
                    this.setEntityFacing('left');
                    this.frame = 1;
                }
            } else if (Math.abs(this.body.velocity.x) < Math.abs(this.body.velocity.y)) { 
                if (this.body.velocity.y > 0) {
                    this.setEntityFacing('down');
                    this.frame = 0;
                }else if (this.body.velocity.y < 0) {
                    this.setEntityFacing('top');
                    this.frame = 3;
                }
            }

        } else {
            this.body.velocity.setTo(0, 0);
        }
    }

    retreat(target) {
        var distance = this.game.math.distance(this.x, this.y, target.x, target.y);
        if (distance > 100) {
            var rotation = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
            this.body.velocity.x = (Math.cos(rotation) * 100) * -1;
            this.body.velocity.y = (Math.sin(rotation) * 100) * -1;

            if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
                if (this.body.velocity.x > 0) {
                    this.setEntityFacing('right');
                }else if (this.body.velocity.x < 0) {
                    this.setEntityFacing('left');
                }
            } else if (Math.abs(this.body.velocity.x) < Math.abs(this.body.velocity.y)) { 
                if (this.body.velocity.y > 0) {
                    this.setEntityFacing('down');
                }else if (this.body.velocity.y < 0) {
                    this.setEntityFacing('top');
                }
            }

        } else {
            this.body.velocity.setTo(0, 0);
        }
    }
} 