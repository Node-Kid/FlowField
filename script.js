const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const inc = 0.05;
const scale = 10;
const strength = 0.15;
const rows = canvas.clientHeight / scale;
const cols = canvas.clientWidth / scale;
context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, 720, 480);
noise.seed(Math.random());

let previousMousePos;
let mouseDown = false;
let zOff = 0;
let flowField = [];
let mouseVectors = [];
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
			vector.multiply(strength);
			if(mouseVectors[x + (y * cols)]) {
				vector = mouseVectors[x + (y * cols)];
				vector.multiply(strength * 6.6);
			}
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

function handleMouseMove(e) {
	if(!mouseDown) return;
	const boundingBox = canvas.getBoundingClientRect();
	const x = Math.floor((e.clientX - boundingBox.left) / scale);
	const y = Math.floor((e.clientY - boundingBox.top) / scale);
	if(previousMousePos) {
		const mouseCursor = new Vector2(x, y);
		const points = getLinePoints(previousMousePos, mouseCursor);
		console.log(points);
		if(points.length == 0) return;
		let previousVector = points[0].copy();
		previousVector.subtract(previousMousePos);
		// previousVector.normalize();
		mouseVectors[previousMousePos.x + (previousMousePos.y * cols)] = previousVector;
		console.log(mouseVectors);
		for(var i = 0; i < points.length; i++) {
			let vector = mouseCursor.copy();
			let prevPos = points[i - 1];
			if(!points[i - 1]) {
				prevPos = previousMousePos;
			}
			vector.subtract(prevPos);
			// vector.normalize();
			mouseVectors[prevPos.x + (prevPos.y * cols)] = vector;
		}
		let lastVector = new Vector2(x, y);
		lastVector.subtract(points[points.length - 1]);
		// lastVector.normalize();
		mouseVectors[points[points.length - 1].x + (points[points.length - 1].y * cols)] = lastVector;
	}
	previousMousePos = new Vector2(x, y);
}

function normalize(value, min, max) {
	return (value - min) / (max - min);
}

function getDistance(start, end) {
	return Math.sqrt(
		(end.x - start.x) ** 2 + (end.y - start.y) ** 2
	);
}

// Authro: Joana Borges Late
// https://javascript.plainenglish.io/the-bresenhams-line-algorithm-for-javascript-developers-ada1d973be76
// Adapted slightly

function getLinePoints(start, end) {
	const deltaCol = Math.abs(end.x - start.x);
	const deltaRow = Math.abs(end.y - start.y);

	let pointX = start.x;
	let pointY = start.y;

	const horizontalStep = (start.x < end.x) ? 1 : -1;
	const verticalStep = (start.y < end.y) ? 1 : -1;

	const points = [];
	let difference = deltaCol - deltaRow;

	while(true) {
		const doubleDifference = 2 * difference;

		if(doubleDifference > -deltaRow) {
			difference -= deltaRow;
			pointX += horizontalStep;
		}
		if (doubleDifference < deltaCol) {
			difference += deltaCol;
			pointY += verticalStep;
		}
		if((pointX == end.x) && (pointY == end.y)) {
			break;
		}
		points.push(new Vector2(pointX, pointY));
	}
	return points;

}

canvas.addEventListener("mousedown", (e) => mouseDown = true);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;
	previousMousePos = undefined;
});
window.requestAnimationFrame(draw);