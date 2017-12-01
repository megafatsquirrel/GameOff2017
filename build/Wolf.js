class Wolf extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.health = 200;
        this.bite = game.add.sprite(0, 0, 'wolfBite');
        this.biteHasHit;
        this.attackTimer;
        this.isRetreating;
        this.dangerAreaSide = game.add.sprite(0, 0, 'dangerSide');
        this.dangerAreaTop = game.add.sprite(0, 0, 'dangerTop');
        this.specialAttackSpeed = 600;
        this.specialAttackTimer = game.time.events.add(5000, this.specialAttack, this, true);
        this.specialAttackTimerInterval = 5000;
        this.isSpecialAttack = false;
        this.isSpecialAttackOnCooldown = false;
        this.isAttackOnCooldown;
        this.clearDangerAreaTimer;
        this.clearDangerAreaTimerInterval = 1000;
        this.clearSpecialAttackInterval = 1500;
        this.growlAudio = game.add.audio('growl');
        this.hurtAudio = game.add.audio('wolfHurt');
        this.healthBar = game.add.sprite(x, y, 'playerHealthBar');
    }

    handleDamage(damage) {
        wolf.hurtAudio.volume = 0.5;
        wolf.hurtAudio.play();
        wolf.health -= damage;
        wolf.healthBar.scale.x = (1 * (wolf.health / 200)) * 0.2;
        if (wolf.health - damage < 0) {
            wolf.kill();
        }
    }

    attack() {
        if (!wolf.isAttacking) {
            wolf.isAttacking = true;
            wolf.isAttackOnCooldown = true;
            wolf.bite.body.velocity.x = 0;
            wolf.bite.body.velocity.y = 0;
            wolf.bite.position.x = wolf.position.x;
            wolf.bite.position.y = wolf.position.y;
            wolf.adjustBiteAttack();
            wolf.bite.visible = true;
            wolf.bite.enableBody = true;
            game.time.events.add(150, wolf.removeAttack, this, true);
            game.time.events.add(1000, wolf.setAttackCooldown, this, true);
        }
    }

    adjustBiteAttack() {
        if(wolf.facing.left) {
            wolf.bite.position.x -= 20;
            wolf.bite.angle = 0;
        }
        if(wolf.facing.right) {
            wolf.bite.position.x += 20;
            wolf.bite.angle = 180;
        }
        if(wolf.facing.down) {
            wolf.bite.position.y += 20;
            wolf.bite.angle = -90;
        }
        if(wolf.facing.top) {
            wolf.bite.position.y -= 20;
            wolf.bite.angle = 90;
        }
    }

    setAttackCooldown() {
        wolf.isAttackOnCooldown = false;
    }

    removeAttack() {
        wolf.bite.visible = false;
        wolf.bite.enableBody = false;
        wolf.isAttacking = false;
        wolf.biteHasHit = false;
    }

    ai() {
        var distance = this.game.math.distance(wolf.x, wolf.y, player.x, player.y);
        if ( wolf.health > 0 && distance >= 60 && !wolf.isRetreating) {
            wolf.follow(player);
        } else {
            wolf.retreat(player);
        }
        
        if (distance <= 60 && !wolf.isAttackOnCooldown) {
            wolf.attack();
        }
    }

    removeRetreating() {
        wolf.isRetreating = false;
    }

    specialAttack() {
        if (!wolf.isSpecialAttackOnCooldown && !wolf.isSpecialAttack && wolf.alive) {
            wolf.growlAudio.volume = 1.5;
            wolf.growlAudio.play();
            wolf.isSpecialAttack = true;
            wolf.isSpecialAttackOnCooldown = true;
            wolf.body.velocity.x = 0;
            wolf.body.velocity.y = 0;

            if ( wolf.facing.top || wolf.facing.down ) {
                wolf.dangerAreaTop.position.x = wolf.body.position.x;
                wolf.dangerAreaTop.position.y = wolf.body.position.y;
                wolf.facing.top ? wolf.dangerAreaTop.scale.y = -1 : wolf.dangerAreaTop.scale.y = 1;
                wolf.dangerAreaTop.visible = true;
            } else if (wolf.facing.right || wolf.facing.left) {
                wolf.dangerAreaSide.position.x = wolf.body.position.x;
                wolf.dangerAreaSide.position.y = wolf.body.position.y;
                wolf.facing.left ? wolf.dangerAreaSide.scale.x = -1 : wolf.dangerAreaSide.scale.x = 1;
                wolf.dangerAreaSide.visible = true;
            }

            wolf.specialAttackTimer = game.time.events.add(wolf.clearSpecialAttackInterval, wolf.clearSpecialAttack, this, true);
            wolf.clearDangerAreaTimer = game.time.events.add(wolf.clearDangerAreaTimerInterval, wolf.clearDangerArea, this, true);
        }
    }

    clearDangerArea() {
        wolf.dangerAreaSide.visible = false;
        wolf.dangerAreaTop.visible = false;
        wolf.executeSpecial();
    }

    clearSpecialAttack() {
        wolf.isSpecialAttack = false;
        wolf.isSpecialAttackOnCooldown = false;
        wolf.bite.enableBody = false;
        wolf.bite.visible = false;
        wolf.specialAttackTimer = game.time.events.add(wolf.specialAttackTimerInterval, wolf.specialAttack, this, true);
    }

    executeSpecial() {
        wolf.bite.enableBody = true;
        wolf.bite.visible = true;
        if (wolf.facing.top) {
            wolf.body.velocity.y = -wolf.specialAttackSpeed;
        } else if (wolf.facing.down) { 
            wolf.body.velocity.y = wolf.specialAttackSpeed;
        } else if (wolf.facing.right) {
            wolf.body.velocity.x = wolf.specialAttackSpeed;
        } else if (wolf.facing.left) {
            wolf.body.velocity.x = -wolf.specialAttackSpeed;
        }
    }

    logic() {
        wolf.healthBar.position.x = wolf.body.position.x + 10;
        wolf.healthBar.position.y = wolf.body.position.y - 10;

        if ( wolf.health < 160) {
            wolf.specialAttackTimerInterval = 4000;
            wolf.clearDangerAreaTimerInterval = 900;
            wolf.clearSpecialAttackInterval = 1400;
        }

        if ( wolf.health < 110) {
            wolf.specialAttackTimerInterval = 3000;
            wolf.clearDangerAreaTimerInterval = 800;
            wolf.clearSpecialAttackInterval = 1200;
        }

        if ( wolf.health < 60) {
            wolf.specialAttackTimerInterval = 2000;
            wolf.clearDangerAreaTimerInterval = 600;
            wolf.clearSpecialAttackInterval = 1000;
        }


        if (!wolf.isSpecialAttack) {
            wolf.ai();
        }

        if (wolf.bite.visible && wolf.isSpecialAttack) {
            wolf.bite.body.position.x = wolf.body.position.x;
            wolf.bite.body.position.y = wolf.body.position.y;
        }
    }
    
}