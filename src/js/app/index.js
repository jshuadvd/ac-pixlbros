let camera;
let scene;
let renderer;
let isUserInteracting = false;
const onMouseDownMouseX = 0;
const onMouseDownMouseY = 0;
let lon = 0;
const onMouseDownLon = 0;
let lat = 0;
const onMouseDownLat = 0;
let phi = 0;
let theta = 0;

let fovMin = 75;
let fovMax = 55;
let zoomed;

let onPointerDownPointerX;
let onPointerDownPointerY;
let onPointerDownLon;
let onPointerDownLat;

init();
animate();

function init() {
	let container;
	let mesh;
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	camera.target = new THREE.Vector3(0, 0, 0);
	scene = new THREE.Scene();
	const geometry = new THREE.SphereGeometry(500, 60, 40);
	geometry.scale(-1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg')
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('click', onDocumentClick, false);
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
	event.preventDefault();
	isUserInteracting = true;
	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;
	onPointerDownLon = lon;
	onPointerDownLat = lat;
}

function onDocumentMouseMove(event) {
	if (isUserInteracting === true) {
		lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
	}
}

function onDocumentMouseUp(event) {
	isUserInteracting = false;
}

function onDocumentClick(event) {
	camera.fov = zoomed ? fovMin : fovMax
	zoomed = !zoomed
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);
	update();
}

function update() {
	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);
	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	camera.target.y = 500 * Math.cos(phi);
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
	camera.lookAt(camera.target);
	renderer.render(scene, camera);
}