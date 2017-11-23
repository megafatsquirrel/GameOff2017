class Wolf extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.health = 100;
        this.bite;
        this.biteHasHit;
    }

    handleDamage(damage) {
        wolf.health -= damage;
        if (wolf.health - damage < 0) {
            wolf.kill();
        }
    }

    attack() {
        var distance = this.game.math.distance(wolf.x, wolf.y, player.x, player.y);
        if (distance <= 40) {
            // bite
            if (!wolf.isAttacking) {
                wolf.isAttacking = true;
                wolf.bite.position.x = wolf.position.x - 20;
                wolf.bite.position.y = wolf.position.y - 20;
                wolf.bite.visible = true;
                wolf.bite.enableBody = true;
                game.time.events.add(250, wolf.removeAttack, this, true);
            }
        }
    }

    removeAttack() {
        wolf.bite.visible = false;
        wolf.bite.enableBody = false;
        wolf.isAttacking = false;
        wolf.biteHasHit = false;
    }
}