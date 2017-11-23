class Wolf extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.health = 100;
        this.bite;
        this.biteHasHit;
        this.attackTimer;
        this.isAttackOnCooldown;
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
}