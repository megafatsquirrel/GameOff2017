class Player extends GameEntity {
    constructor(x, y, key) {
        super(x, y, key);
        this.playerText = '';
        this.swordAudio;
        this.sword;
        this.swordSide;
        this.shield;
        this.shieldSide;
        this.health = 100;
        this.swordDamage = 10;
        this.hasSwordHit = false;
        this.isBlocking = false;
        this.stamina = 100;
        this.attackBtnDown = false;
    }

    adjustSwordPosition() {
        if(player.facing.top) {
            player.sword.scale.y = 1;
            player.sword.position.x -= 10;
            player.sword.position.y -= 60; // Add the height of the player
        }
        if(player.facing.left) {
            player.swordSide.scale.x = -1;
            player.swordSide.position.y -= 10;
            player.swordSide.position.x -= 20; // Remove the width of the player
        }
        if(player.facing.right) {
            player.swordSide.scale.x = 1;
            player.swordSide.position.y -= 10;
            player.swordSide.position.x += 20; // Remove the width of the player
        }
        if(player.facing.down) {
            player.sword.scale.y = -1;
            player.sword.position.x -= 10;
            player.sword.position.y += 60;
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
        player.clearAttack()
    }

    removeSwordSide() {
        player.swordSide.visible = false;
        player.swordSide.enableBody = false;
        player.clearAttack()
    }

    removeShield() {
        player.shield.visible = false;
        player.shield.enableBody = false;
        player.clearAttack()
    }

    removeShieldSide() {
        player.shieldSide.visible = false;
        player.shieldSide.enableBody = false;
        player.clearAttack()
    }

    attack() {
        player.setButtonDown();
        if (!player.isAttacking) {
            player.swordAudio.play();
            player.isAttacking = true;
            player.sword.position.x = player.position.x;
            player.sword.position.y = player.position.y;
            player.shieldSide.position.x = player.position.x;
            player.shieldSide.position.y = player.position.y;
            if (player.facing.left || player.facing.right) {
                player.swordSide.visible = true;
                player.swordSide.play('stab', 60, false, false);
                player.swordSide.enableBody = true;
                game.time.events.add(500, player.removeSwordSide, this, true);
            } else {
                player.sword.visible = true;
                player.sword.play('stab', 60, false, false);
                player.sword.enableBody = true;
                game.time.events.add(500, player.removeSword, this, true);
            }
        }
    }

    clearAttack() {
        player.isAttacking = false;
        player.hasSwordHit = false;
        player.isBlocking = false;
    }

    setButtonDown() {
        player.attackBtnDown = true;
    }

    clearButtonDown() {
        player.attackBtnDown = false;
    }

    block() {
        player.setButtonDown();
        if (!player.isAttacking) {
            player.isBlocking = true;
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

    handleInput() {
        // MOVEMENT
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            player.setEntityFacing('left');
            player.body.velocity.x = -player.speed;
            player.animations.play('walkLeft');
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            player.setEntityFacing('right');
            player.body.velocity.x = player.speed;
            player.animations.play('walkRight');
        } else {
            player.body.velocity.x = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            player.setEntityFacing('top');
            player.body.velocity.y = -player.speed;
            player.animations.play('walkUp');
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            player.setEntityFacing('down');
            player.body.velocity.y = player.speed;
            player.animations.play('walkDown');
        } else {
            player.body.velocity.y = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            if (player.stamina >= 4) {
                player.stamina -= 4;
                playerStaminaBar.scale.x = player.stamina / 100;
                if (player.body.velocity.x !== 0 ) {
                    player.body.velocity.x *= 5;
                }
                else if (player.body.velocity.y !== 0 ) {
                    player.body.velocity.y *= 5;
                }
            }
        }
    }
}