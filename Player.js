class Player extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.exp = 0;
        this.playerText = '';
        this.sword;
        this.swordSide;
        this.shield;
        this.shieldSide;
    }

    adjustSwordPosition() {
        if(player.facing.top) {
            player.sword.position.y -= 60; // Add the height of the player
        }
        if(player.facing.left) {
            player.swordSide.position.y -= 10;
            player.swordSide.position.x -= 100; // Remove the width of the player
        }
        if(player.facing.right) {
            player.swordSide.position.y -= 10;
            player.swordSide.position.x += 20; // Remove the width of the player
        }
        if(player.facing.down) {
            player.sword.position.y += 20;
        }
    }
    
    adjustShieldPosition() {
        if(player.facing.top) {
            player.shield.position.y -= 40;
            player.shield.position.x -= 10; // Add the height of the player
        }
        if(player.facing.left) {
            player.shieldSide.position.y -= 10;
            player.shieldSide.position.x -= 40; // Remove the width of the player
        }
        if(player.facing.right) {
            player.shieldSide.position.y -= 10;
            player.shieldSide.position.x += 30; // Remove the width of the player
        }
        if(player.facing.down) {
            player.shield.position.y += 30;
            player.shield.position.x -= 10;
        }
    }

    removeSword() {
        player.sword.visible = false;
        player.sword.enableBody = false;
    }

    removeSwordSide() {
        player.swordSide.visible = false;
        player.swordSide.enableBody = false;
    }

    removeShield() {
        player.shield.visible = false;
        player.shield.enableBody = false;
    }

    removeShieldSide() {
        player.shieldSide.visible = false;
        player.shieldSide.enableBody = false;
    }
}