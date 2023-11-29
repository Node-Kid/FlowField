const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const inc = 0.05;
const scale = 10;
const rows = canvas.clientHeight / scale;
const cols = canvas.clientWidth / scale;
context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, 720, 480);
noise.seed(Math.random());

let previousPos;
let mouseDown = false;
let zOff = 0;
let flowField = [];
let mouseGradientLocations = [];
let screenGradient = [];
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
			vector.multiply(0.15);
			flowField[x + (y * cols)] = vector;
			xOff += inc;
		}	
		yOff += inc;
	}
	for(var i = 0; i < particles.length; i++) {
		particles[i].edgeCheck();
		particles[i].follow(flowField);
		particles[i].update();
		particles[i].draw(context);
	}
	zOff += 0.001;
	window.requestAnimationFrame(draw);
}

function normalize(value, min, max) {
	return (value - min) / (max - min);
}

window.requestAnimationFrame(draw);