class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.calculateMagnitude();
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.calculateMagnitude();
    }
    calculateMagnitude() {
        this.mag = Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getMag() {
        return this.mag;
    }
    multiply(value) {
        this.x *= value;
        this.y *= value;
    }
    dot(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.calculateMagnitude();
    }
    clamp(value) {
        this.multiply(value / this.mag);
        this.calculateMagnitude();
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
}