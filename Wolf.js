class Wolf extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.health = 100;
        this.bite = game.add.sprite(0, 0, 'wolfBite');
        this.biteHasHit;
        this.attackTimer;
        this.isRetreating;
        this.dangerAreaSide = game.add.sprite(0, 0, 'dangerSide');
        this.dangerAreaTop = game.add.sprite(0, 0, 'dangerTop');
        this.specialAttackTimer = game.time.events.add(5000, this.specialAttack, this, true);
        this.isSpecialAttack = false;
        this.isSpecialAttackOnCooldown = false;
        this.isAttackOnCooldown;
        this.clearDangerAreaTimer;
    }

    handleDamage(damage) {
        wolf.health -= damage;
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
        }
        if(wolf.facing.right) {
            wolf.bite.position.x += 20;
        }
        if(wolf.facing.down) {
            wolf.bite.position.y += 20;
        }
        if(wolf.facing.top) {
            wolf.bite.position.y -= 20;
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
        if (!wolf.isSpecialAttackOnCooldown && !wolf.isSpecialAttack) {
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

            wolf.specialAttackTimer = game.time.events.add(2000, wolf.clearSpecialAttack, this, true);
            wolf.clearDangerAreaTimer = game.time.events.add(1000, wolf.clearDangerArea, this, true);
            game.time.events.add(1000, wolf.executeSpecial, this, true);
        }
    }

    clearDangerArea() {
        wolf.dangerAreaSide.visible = false;
        wolf.dangerAreaTop.visible = false;
    }

    clearSpecialAttack() {
        wolf.isSpecialAttack = false;
        wolf.isSpecialAttackOnCooldown = false;
        wolf.specialAttackTimer = game.time.events.add(5000, wolf.specialAttack, this, true);
    }

    executeSpecial() {
        wolf.bite.enableBody = true;
        wolf.bite.visible = true;
        if (wolf.facing.top) {
            wolf.body.velocity.y = -600;
        } else if (wolf.facing.down) { 
            wolf.body.velocity.y = 600;
        } else if (wolf.facing.right) {
            wolf.body.velocity.x = 600;
        } else if (wolf.facing.left) {
            wolf.body.velocity.x = -600;
        }
    }
}