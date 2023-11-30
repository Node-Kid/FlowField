
class Particle {
    constructor() {
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
        this.accel = new Vector2(0, 0);
        this.maxSpeed = 2;
    }
    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    update() {
        this.vel.add(this.accel);
        this.vel.clamp(this.maxSpeed);
        this.pos.add(this.vel);
        this.accel.multiply(0);
    }
    applyForce(force) {
        this.accel.add(force);
    }
    draw(context) {
        context.fillStyle = "#000000"
        context.fillRect(this.pos.x, this.pos.y, 2, 2);
    }
    edgeCheck() {
        if(this.pos.x > 1280) {
            this.pos.x = 0;
            this.pos.y = Math.floor(Math.random() * 719);
        } else if(this.pos.x < 0) {
            this.pos.x = 1279;
            this.pos.y = Math.floor(Math.random() * 719);
        }
        if(this.pos.y > 720) {
            this.pos.y = 0;
            this.pos.x = Math.floor(Math.random() * 1279);
        } else if(this.pos.y < 0) {
            this.pos.y = 719;
            this.pos.x = Math.floor(Math.random() * 1279);
        }
    }
    follow(flowField, gravityForces) {
        let relativeX = Math.floor(this.pos.x / scale);
        let relativeY = Math.floor(this.pos.y / scale);
        this.applyForce(flowField[relativeX + (relativeY * cols)]); 
        this.applyForce(gravityForces[relativeX + (relativeY * cols)]); 
    }
}