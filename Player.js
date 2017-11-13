class Player extends GameEntity {
    constructor(x, y, key, type, str, dex, int, vit) {
        super(x, y, key, type, str, dex, int, vit);
        this.exp = 0;
    }
}