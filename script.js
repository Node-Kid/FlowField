const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const inc = 0.05;
const scale = 10;
const rows = canvas.clientHeight / scale;
const cols = canvas.clientWidth / scale;
context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, 720, 480);
noise.seed(Math.random());
let mouseDown = false;
let mousePos = new Vector2(0, 0);
let zOff = 0;
let flowField = [];
let gravityForces = new Array(rows * cols);
gravityForces.fill(new Vector2(0, 0), 0, rows * cols);
let particles = [];
for(var i = 0; i < 400; i++) {
	particles[i] = new Particle();
	particles[i].setPos(Math.random() * 1280, Math.random() * 720);
}
function draw() {	
	context.fillStyle = "rgba(255, 255, 255, 0.05)";
	context.fillRect(0, 0, 1280, 720);
	var yOff = 0;
	for(var y = 0; y < rows; y++) {
		var xOff = 0;
		for(var x = 0; x < cols; x++) {
			let noiseValue = normalize(noise.perlin3(xOff, yOff, zOff), -1, 1);
			let vector = new Vector2(Math.cos(noiseValue * Math.PI * 3), Math.sin(noiseValue * Math.PI * 3));
			if(mouseDown) {
				let vectorToMouse = new Vector2(mousePos.x, mousePos.y);
				vectorToMouse.subtract(new Vector2(x, y));
				const dist = vectorToMouse.mag;
				vectorToMouse.normalize();
				vectorToMouse.multiply((1 - normalize(dist, 0, 10)));
				gravityForces[x + (y * cols)] = vectorToMouse;
			}
			vector.multiply(0.15);
			flowField[x + (y * cols)] = vector;
			xOff += inc;
		}	
		yOff += inc;
	}
	for(var i = 0; i < particles.length; i++) {
		particles[i].follow(flowField, gravityForces);
		particles[i].update();
		particles[i].edgeCheck();
		particles[i].draw(context);
	}
	zOff += 0.001;
	window.requestAnimationFrame(draw);
}

function normalize(value, min, max) {
	if(value > max) value = max;
	return (value - min) / (max - min);
}
canvas.addEventListener("mousedown", (e) => mouseDown = true);
canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;
	gravityForces.fill(new Vector2(0, 0), 0, rows * cols);
});
canvas.addEventListener("mousemove", (e) => {
	const boundingBox = canvas.getBoundingClientRect();
	const x = Math.floor((e.clientX - boundingBox.left) / scale);
	const y = Math.floor((e.clientY - boundingBox.top) / scale);
	mousePos = new Vector2(x, y);
});


window.requestAnimationFrame(draw);