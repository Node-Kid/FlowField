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

function handleMouseMove(e) {
	// if(!mouseDown) return;
	// const boundingBox = canvas.getBoundingClientRect();
	// const x = Math.floor((e.clientX - boundingBox.left) / scale);
	// const y = Math.floor((e.clientY - boundingBox.top) / scale);
	// context.fillStyle = "#000000";

	// if(previousPos) {
	// 	context.fillRect(previousPos.x * scale, previousPos.y * scale, scale, scale);
	// 	for(var point of getLinePoints(previousPos, new Vector2(x, y))) {
	// 		mouseGradientLocations.push(point);
	// 		context.fillRect(point.x * scale, point.y * scale, scale, scale);
	// 	}
	// }

	// context.fillRect(x * scale, y * scale, scale, scale);

	// previousPos = new Vector2(x, y);
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
	previousPos = undefined;
	for(var y = 0; y < rows; y++) {
		for(var x = 0; x < cols; x++) {
			let acc = 0;
			for(var point of mouseGradientLocations) {
				const dist = getDistance(new Vector2(x, y), point);
				if(dist <= 2) {
					const nDist = normalize(dist, 0, 3);
					acc += 6 * (nDist ** 5) - 15 * (nDist ** 4) + 10 * (nDist ** 3);
				}
			}
			screenGradient[x + (y * cols)] = acc / 4;
		}
	}
	mouseGradientLocations = []; // reset this to make sure we keep lag low
});
window.requestAnimationFrame(draw);