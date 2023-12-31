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
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
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
        this.calculateMagnitude();
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
    normalize() {
        if(this.mag == 0) return;
        this.x /= this.mag;
        this.y /= this.mag;
        this.mag = 1;
    }
    copy() {
        return new Vector2(this.x, this.y); 
    }
}