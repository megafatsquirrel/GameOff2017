class Wolf extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.health = 100;
    }

    handleDamage(damage) {
        wolf.health -= damage;
        if (wolf.health - damage < 0) {
            wolf.kill();
        }
    }
}