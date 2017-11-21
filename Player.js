class Player extends GameEntity {
    constructor(x, y, key) {
        super(x, y, key);
        this.playerText = '';
        this.sword;
        this.swordSide;
        this.shield;
        this.shieldSide;
        this.health = 100;
        this.swordDamage = 10;
        this.hasSwordHit = false;
        this.stamina = 100;
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

    attack() {
        if (!player.isAttacking) {
            player.isAttacking = true;
            player.sword.position.x = player.position.x;
            player.sword.position.y = player.position.y;
            player.shieldSide.position.x = player.position.x;
            player.shieldSide.position.y = player.position.y;
            if (player.facing.left || player.facing.right) {
                player.swordSide.visible = true;
                player.swordSide.enableBody = true;
                game.time.events.add(250, player.removeSwordSide, this, true);
            } else {
                player.sword.visible = true;
                player.sword.enableBody = true;
                game.time.events.add(250, player.removeSword, this, true);
            }
        }
    }

    clearAttack() {
        player.isAttacking = false;
        player.hasSwordHit = false;
    }

    block() {
        if (!player.isAttacking) {
            player.isAttacking = true;
            player.shield.position.x = player.position.x;
            player.shield.position.y = player.position.y;
            player.shieldSide.position.x = player.position.x;
            player.shieldSide.position.y = player.position.y;
            
            if (player.facing.left || player.facing.right) {
                player.shieldSide.visible = true;
                player.shieldSide.enableBody = true;
                game.time.events.add(250, player.removeShieldSide, this, this);
            } else {
                player.shield.visible = true;
                player.shield.enableBody = true;
                game.time.events.add(250, player.removeShield, this, this);
            }        
        }
    }
    
}