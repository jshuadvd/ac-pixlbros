'use strict';

var camera = void 0;
var scene = void 0;
var renderer = void 0;
var isUserInteracting = false;
var onMouseDownMouseX = 0;
var onMouseDownMouseY = 0;
var onMouseDownLat = 0;
var onMouseDownLon = 0;
var lon = 30;
var lat = 0;
var phi = 0;
var theta = 0;
var fovMin = 75;
var fovMax = 55;
var zoomed = void 0;

var onPointerDownPointerX = void 0;
var onPointerDownPointerY = void 0;
var onPointerDownLon = void 0;
var onPointerDownLat = void 0;

var selected = void 0;
var controls = void 0;
var timeline = void 0;

init();
animate();

function init() {
	var container = void 0;
	var mesh = void 0;
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	// camera.position.set( 0, 0, 60 );
	camera.target = new THREE.Vector3(0, 0, 0);

	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);
	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	camera.lookAt(camera.target);

	scene = new THREE.Scene();
	scene.add(camera);
	var geometry = new THREE.SphereGeometry(500, 60, 40);
	geometry.scale(-1, 1, 1);
	var material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg')
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'scene';
	scene.add(mesh);

	// add light
	// let light = new THREE.DirectionalLight('white', 1);
	// light.position.set(-4,4,4);
	// light.name = 'Back light';
	// scene.add(light);

	// Add spotlight for case focus
	var spotLight = new THREE.SpotLight(0xffffff, 2.2, 1000, Math.PI / 10.5, 0.001);
	spotLight.castShadow = true;
	spotLight.position.set(52, 75, 50);
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowCameraNear = 1;
	spotLight.shadowCameraFar = 1000;
	scene.add(spotLight);

	// Add marker to set initial position for click
	var marker = new THREE.Object3D();
	marker.position.set(0, 0, 0);
	marker.add(spotLight);
	scene.add(marker);

	// add a sphere to click
	// let mat2 = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: '#f4d742'});
	// let object = new THREE.Mesh(new THREE.SphereGeometry(4,20,20),mat2);
	// object.position.set( 40, 0, 0 );
	// object.name = 'Object 1';
	// scene.add(object);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// set up controls
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 3.6;
	controls.zoomSpeed = 0.8;
	controls.panSpeed = 1;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.12;
	controls.enabled = true;

	TweenLite.ticker.addEventListener('tick', render);

	timeline = new TimelineLite({
		onStart: function onStart() {
			TweenLite.ticker.removeEventListener("tick", controls.update);
			controls.enabled = false;
		},
		onComplete: function onComplete() {
			TweenLite.ticker.addEventListener("tick", controls.update);
			controls.position0.copy(camera.position);
			controls.reset();
			controls.enabled = true;
		}
	});

	// set up click handlers
	// document.addEventListener('mousedown', onDocumentMouseDown, false);
	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('mousedown', mouseDown, false);
	TweenLite.ticker.addEventListener("tick", controls.update);
}

var startX = void 0;
var startY = void 0;
var easing = 'Expo.easeInOut';

function getDistance(object) {
	var helper = new THREE.BoundingBoxHelper(object, 0xff0000);
	helper.update();

	var width = helper.scale.x;
	var height = helper.scale.y;

	// Set camera distance
	var vFOV = camera.fov * Math.PI / 180;

	var ratio = 2 * Math.tan(vFOV / 2);
	var screen = ratio * camera.aspect;
	var size = Math.max(height, width);
	var distance = size / screen + helper.box.max.z / screen;

	return distance;
};

function reset() {

	var pos = { x: 0, y: 0 };
	var distance = 60;
	var speed = 1;

	if (camera.parent !== scene) {
		var pos = camera.position.clone();
		camera.parent.localToWorld(camera.position);
		scene.add(camera);
	}

	timeline.clear();
	timeline.to(camera.position, speed, {
		x: pos.x,
		y: pos.y,
		z: distance,
		ease: easing
	}, 0);
	timeline.to(camera.rotation, speed, { x: 0, y: 0, z: 0, ease: easing }, 0);
};

function zoom(object) {

	var pos = camera.position.clone();
	object.worldToLocal(camera.position);
	object.add(camera);

	var speed = 1;
	timeline.clear();

	timeline.to(camera.position, speed, {
		x: pos.x,
		y: pos.y,
		z: getDistance(object),
		ease: easing
	}, 0);
};

function mouseDown(e) {
	var x = e.touches ? e.touches[0].clientX : e.clientX;
	var y = e.touches ? e.touches[0].clientY : e.clientY;
	var mouse = {
		x: x / window.innerWidth * 2 - 1,
		y: -(y / window.innerHeight) * 2 + 1
	};
	var vector = new THREE.Vector3(mouse.x, mouse.y).unproject(camera);
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = raycaster.intersectObject(scene, true);
	if (intersects.length > 0 && intersects[0].object !== selected && intersects[0].object.name !== 'scene') {
		selected = intersects[0].object;
		console.log(selected);
		zoom(selected);
	} else {
		selected = null;
		reset();
	}
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

function onDocumentMouseWheel(event) {
	console.log('event', camera.fov);

	camera.fov += event.deltaY * 0.05;
	camera.updateProjectionMatrix();
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
	camera.fov = zoomed ? fovMin : fovMax;
	// i = zoomed ? -1 : 1
	zoomed = !zoomed;
	tween
	// .onUpdate(() => {
	// 	camera.fov = 
	// })
	.start();

	// int = setInterval(() => {
	// 	val = val + 0.05*i;
	// 	camera.fov = val;
	// 	i++;
	// 	console.log(val);
	// 	if(val > 85) {
	// 		clearInterval(int)
	// 	}
	// },30);
}

// var coords = { x: 0, y: 0 };
// var tween = new TWEEN.Tween({x: 75})
//     .to({x: 85}, 1000)
//     .onUpdate(function() {
//     	camera.fov = this.x
//     })

function animate() {
	requestAnimationFrame(animate);
	update();
}

function render() {
	renderer.render(scene, camera);
}

function update(time) {
	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);
	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	camera.target.y = 500 * Math.cos(phi);
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
	camera.lookAt(camera.target);
	// TWEEN.update(time);
	// camera.fov = camera.fov += 0.1 
	// console.log(camera.fov)
	camera.updateProjectionMatrix();
	render();
}

function orbit(origin, h, v, distance) {
	origin = origin || new THREE.Vector3();
	var p = new THREE.Vector3();
	var phi = v * Math.PI / 180;
	var theta = h * Math.PI / 180;
	p.x = distance * Math.sin(phi) * Math.cos(theta) + origin.x;
	p.z = distance * Math.sin(phi) * Math.sin(theta) + origin.z;
	p.y = distance * Math.cos(phi) + origin.y;
	return p;
}
//# sourceMappingURL=app.js.map
