'use strict';

// let camera;
// let scene;
// let renderer;
// let isUserInteracting = false;
// const onMouseDownMouseX = 0;
// const onMouseDownMouseY = 0;
// const onMouseDownLat = 0;
// const onMouseDownLon = 0;
var lon = 30;
// let lat = 0;
// let phi = 0;
// let theta = 0;
var fovMin = 75;
var fovMax = 55;
// let zoomed;
// 
var onPointerDownPointerX = void 0;
// let onPointerDownPointerY;
var onPointerDownLon = void 0;
// let onPointerDownLat;
// 
// let selected;
// let controls;
// let timeline;
// 
// // Init audio 
// let audio = document.getElementById('player');
// audio.play();
// audio.volume = 1;
// audio.crossOrigin = "anonymous";
// 
// 
// init();
// animate();
// 
// function init() {
// 	let container;
// 	let mesh;
// 	container = document.getElementById('container');
// 	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500);
// 	// camera.position.set( 0, 0, 60 );
// 	camera.target = new THREE.Vector3(0, 0, 0);
// 
// 	lat = Math.max(-85, Math.min(85,lat));
// 	phi = THREE.Math.degToRad(90-lat);
// 	theta = THREE.Math.degToRad(lon);
// 	camera.target.x = 500;
// 	camera.lookAt(camera.target);
// 
// 	scene = new THREE.Scene();
// 	scene.add(camera)
// 	const geometry = new THREE.SphereGeometry(500, 60, 40);
// 	geometry.scale(-1, 1, 1);
// 	const material = new THREE.MeshBasicMaterial({
// 		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg')
// 	});
// 	mesh = new THREE.Mesh(geometry, material);
// 	mesh.name = 'scene';
// 	scene.add(mesh);
// 	
// 
// 
// 	// add light
// 	// let light = new THREE.DirectionalLight('white', 1);
// 	// light.position.set(-4,4,4);
// 	// light.name = 'Back light';
// 	// scene.add(light);
// 	
// 	// Add spotlight for case focus
// 	// let spotLight = new THREE.SpotLight(0xffffff, 2.2, 1000, Math.PI/10.5, 0.001);
// 	// spotLight.castShadow = true;
// 	// spotLight.position.set(52, 75, 50);
// 	// spotLight.shadowMapWidth = 1024;
// 	// spotLight.shadowMapHeight = 1024;
// 	// spotLight.shadowCameraNear = 1;
// 	// spotLight.shadowCameraFar = 1000;
// 	// scene.add(spotLight);
// 	
// 	// Add marker to set initial position for click
// 	let marker = new THREE.Object3D();
// 	marker.position.set(0,0,0);
// 	// marker.add(spotLight);
// 	scene.add(marker);
// 
// 	// add a sphere to click
// 	// let mat2 = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: '#f4d742'});
// 	// let object = new THREE.Mesh(new THREE.SphereGeometry(4,20,20),mat2);
// 	// object.position.set( 40, 0, 0 );
// 	// object.name = 'Object 1';
// 	// scene.add(object);
// 
// 	renderer = new THREE.WebGLRenderer();
// 	renderer.setPixelRatio(window.devicePixelRatio);
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	container.appendChild(renderer.domElement);
// 
// 	// set up controls
// 	controls = new THREE.TrackballControls(camera);
// 	controls.rotateSpeed = 3.6;
// 	controls.zoomSpeed = 0.8;
// 	controls.panSpeed = 1;
// 	controls.noZoom = false;
// 	controls.noPan = false;
// 	controls.staticMoving = false;
// 	controls.dynamicDampingFactor = 0.12;
// 	controls.enabled = true;
// 	
// 	TweenLite.ticker.addEventListener('tick', render );
// 
// 	timeline = new TimelineLite({
// 		onStart: function(){
// 			TweenLite.ticker.removeEventListener("tick", controls.update );
// 			controls.enabled = false;
// 		},
// 		onComplete: function(){
// 			TweenLite.ticker.addEventListener("tick", controls.update );
// 			controls.position0.copy(camera.position);
// 			controls.reset();
// 			controls.enabled = true;
// 		}
// 	});
// 
// 	// set up click handlers
// 	// document.addEventListener('mousedown', onDocumentMouseDown, false);
// 	// document.addEventListener('mousemove', onDocumentMouseMove, false);
// 	document.addEventListener('mouseup', onDocumentMouseUp, false);
// 	window.addEventListener('resize', onWindowResize, false);
// 	document.addEventListener('mousedown', mouseDown, false);
// 	TweenLite.ticker.addEventListener("tick", controls.update);
// 	
// }
// 
// let startX
// let startY
// let easing = 'Expo.easeInOut';
// 
// function getDistance(object) {
// 	const helper = new THREE.BoundingBoxHelper(object, 0xff0000);
// 	helper.update();
// 
// 	let width = helper.scale.x;
// 	let height = helper.scale.y;
// 
// 	// Set camera distance
// 	const vFOV = camera.fov * Math.PI / 180;
// 
// 	const ratio = 2 * Math.tan( vFOV / 2 );
// 	const screen = ratio * camera.aspect;
// 	const size = Math.max(height,width);
// 	const distance = (size / screen) + (helper.box.max.z / screen);
// 
// 	return distance;
// };
// 
// function reset() {
// 
// 	var pos = { x: 0, y: 0 };
// 	const distance = 60;
// 	const speed = 1;
//  
// 	if ( camera.parent !== scene ) {
// 		var pos = camera.position.clone();
// 		camera.parent.localToWorld(camera.position);
// 		scene.add(camera);
// 	}
//  
// 	timeline.clear();
// 	timeline.to( camera.position, speed, { 
// 	x: pos.x, 
// 	y: pos.y, 
// 	z: distance, 
// 	ease: easing 
// 	}, 0);
//  	timeline.to( camera.rotation, speed, { x: 0, y: 0, z: 0, ease: easing}, 0);
// 
// }; 
// 
// function zoom(object) {
// 
// 	const pos = camera.position.clone();
// 	object.worldToLocal(camera.position);
// 	object.add(camera);
// 
// 	const speed = 1;
// 	timeline.clear();
// 
// 	timeline.to( camera.position, speed, {
// 		x: pos.x,
// 		y: pos.y,
// 		z: getDistance(object),
// 		ease: easing
// 	},0);
// 
// };
// 
// function mouseDown(e) {
// 	const x = ( e.touches ? e.touches[0].clientX : e.clientX );
// 	const y = ( e.touches ? e.touches[0].clientY : e.clientY );
// 	const mouse = {
// 		x: ( x / window.innerWidth ) * 2 - 1,
// 		y: - ( y / window.innerHeight ) * 2 + 1
// 	};
// 	const vector = new THREE.Vector3( mouse.x, mouse.y ).unproject( camera );
// 	const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
// 	const intersects = raycaster.intersectObject( scene, true );
// 	if(intersects.length > 0 && intersects[0].object !== selected && intersects[0].object.name !== 'scene') {
// 		selected = intersects[0].object;
// 		console.log(selected);
// 		zoom(selected);
// 	} else {
// 		selected = null;
// 		reset(); 
// 	}
// }
// 
// function onWindowResize() {
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// }
// 
// function onDocumentMouseDown(event) {
// 	event.preventDefault();
// 	isUserInteracting = true;
// 	onPointerDownPointerX = event.clientX;
// 	onPointerDownPointerY = event.clientY;
// 	onPointerDownLon = lon;
// 	onPointerDownLat = lat;
// }
// 
// function onDocumentMouseWheel( event ) {
// 	console.log('event', camera.fov)
// 
// 	camera.fov += event.deltaY * 0.05;
// 	camera.updateProjectionMatrix();
// 
// }
// 
// function onDocumentMouseMove(event) {
// 	if (isUserInteracting === true) {
// 		lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
// 	}
// }
// 
// function onDocumentMouseUp(event) {
// 	isUserInteracting = false;
// }
// 
// function onDocumentClick(event) {
// 	camera.fov = zoomed ? fovMin : fovMax
// 	// i = zoomed ? -1 : 1
// 	zoomed = !zoomed
// 	tween
// 	// .onUpdate(() => {
// 	// 	camera.fov = 
// 	// })
// 	.start();
// 
// 
// 	// int = setInterval(() => {
// 	// 	val = val + 0.05*i;
// 	// 	camera.fov = val;
// 	// 	i++;
// 	// 	console.log(val);
// 	// 	if(val > 85) {
// 	// 		clearInterval(int)
// 	// 	}
// 	// },30);
// }
// 
// // var coords = { x: 0, y: 0 };
// // var tween = new TWEEN.Tween({x: 75})
// //     .to({x: 85}, 1000)
// //     .onUpdate(function() {
// //     	camera.fov = this.x
// //     })
// 
// function animate() {
// 	requestAnimationFrame(animate);
// 	update();
// }
// 
// function render() {
// 	renderer.render(scene, camera);
// }
// 
// function update(time) {
// 	lat = Math.max(-85, Math.min(85, lat));
// 	phi = THREE.Math.degToRad(90 - lat);
// 	theta = THREE.Math.degToRad(lon);
// 	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
// 	camera.target.y = 500 * Math.cos(phi);
// 	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
// 	camera.lookAt(camera.target);
// 	// TWEEN.update(time);
// 	// camera.fov = camera.fov += 0.1 
// 	// console.log(camera.fov)
// 	camera.updateProjectionMatrix();
// 	render();
// }
// 
// function  orbit(origin, h, v, distance) {    
// 	origin = origin || new THREE.Vector3();    
// 	var p = new THREE.Vector3();    
// 	var phi = v * Math.PI / 180;    
// 	var theta = h * Math.PI / 180;    
// 	p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origin.x;    
// 	p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origin.z;    
// 	p.y = (distance * Math.cos(phi)) + origin.y;    
// 	return p;
// }

// Add Audio Loader
var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = '/audio/AC-Trailer.mp3';
audio.appendChild(source);
audio.play();

var camera = void 0,
    container = void 0,
    color = void 0,
    controls = void 0,
    clock = void 0,
    h = void 0,
    info = void 0,
    marker = void 0,
    mesh = void 0,
    materials = [],
    mousePos = void 0,
    parameters = void 0,
    particles = void 0,
    rainGeometry = void 0,
    renderer = void 0,
    raycaster = void 0,
    scene = void 0,
    size = void 0,
    spotLight = void 0,
    spotLightHelper = void 0,
    sprite = void 0,
    stats = void 0;

var isUserInteracting = true,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

var rainDensity = 20000;

container = document.getElementById('container');
// info = document.getElementById( 'info' );

init();
animate();

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

//************************************************************************//
//                             Init Scene                                //
//************************************************************************//

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	camera.target = new THREE.Vector3(0, 0, 0);

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x000000, 0.005);
	scene.fog = new THREE.Fog(0x000000, 0.012);

	var geometry = new THREE.SphereGeometry(500, 60, 400);
	geometry.scale(-1, 1, 1);

	var material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg'),
		fog: true,
		transparent: true
	});

	// instantiate a loader
	// var loader = new THREE.ImageLoader();
	// 
	// // load a image resource
	// loader.load(
	// 	// resource URL
	// 	'textures/assassins_creed_logo.png',
	// 	// Function when resource is loaded
	// 	function ( image ) {
	// 		// do something with it
	// 
	// 		// like drawing a part of it on a canvas
	// 		var canvas = document.createElement( 'canvas' );
	// 		var context = canvas.getContext( '2d' );
	// 		context.drawImage( image, 100, 100 );
	// 	},
	// 	// Function called when download progresses
	// 	function ( xhr ) {
	// 		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	// 	},
	// 	// Function called when download errors
	// 	function ( xhr ) {
	// 		console.log( 'An error happened' );
	// 	}
	// );
	// scene.add(loader)

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// controls = new THREE.FirstPersonControls( camera );
	// controls.movementSpeed = MOVESPEED;
	// controls.lookSpeed = LOOKSPEED;
	// controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	// controls.noFly = true;
	// clock = new THREE.Clock();

	var spotLight = new THREE.SpotLight(0xffffff, 4, 40);
	camera.add(spotLight);
	// spotLight.position.set(0, 0,1);
	spotLight.target = camera;

	// let light = new THREE.SpotLight(0xffffff, 2.0, 1000);
	// light.target = mesh;
	// scene.add(light)
	// 
	// let lightHelper = new THREE.SpotLightHelper(light);
	// scene.add(lightHelper)

	// spotLight = new THREE.SpotLight( 0xffffff, 2, 100 );
	// spotLight.position.set(0, 0, 0 );
	// spotLight.target = mesh
	// spotLight.position.set(20, 20, 20);
	// spotLight.castShadow = true;
	// spotLight.angle = Math.PI / 4;
	// spotLight.penumbra = 0.05;
	// spotLight.decay = 2;
	// spotLight.distance = 200;
	// spotLight.shadow.mapSize.width = 100;
	// spotLight.shadow.mapSize.height = 100;
	// spotLight.shadow.camera.near = 1;
	// spotLight.shadow.camera.far = 10;
	spotLight.position.set(-20, 60, -10);
	spotLight.castShadow = true;
	scene.add(spotLight);
	// camera.add(spotLight);
	// scene.add(camera)

	spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	// marker = new THREE.Object3D();
	// marker.position.set(400, 300, 400);
	// marker.add(spotLight);
	// scene.add(marker);

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	var onKeyDown = function onKeyDown(event) {
		switch (event.keyCode) {

			case 38: // up
			case 87:
				// w
				moveForward = true;
				break;

			case 37: // left
			case 65:
				// a
				// lon = event.clientX
				moveLeft = true;
				break;

			case 40: // down
			case 83:
				// s
				moveBackward = true;
				break;

			case 39: // right
			case 68:
				// d
				// lon = event.clientX
				moveRight = true;
				break;

			case 32:
				// space
				if (canJump === true) velocity.y += 350;
				canJump = false;
				break;
		}
	};

	var onKeyUp = function onKeyUp(event) {
		switch (event.keyCode) {

			case 38: // up
			case 87:
				// w
				moveForward = false;
				break;

			case 37: // left
			case 65:
				// a
				moveLeft = false;
				break;

			case 40: // down
			case 83:
				// s
				moveBackward = false;
				break;

			case 39: // right
			case 68:
				// d
				moveRight = false;
				break;

		}
	};

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	container.addEventListener("mousedown", getPosition, false);

	// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('wheel', onDocumentMouseWheel, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	// document.addEventListener("DOMContentLoaded", init, false);

	document.addEventListener('dragover', function (event) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	}, false);

	document.addEventListener('dragenter', function (event) {

		document.body.style.opacity = 0.5;
	}, false);

	document.addEventListener('dragleave', function (event) {

		document.body.style.opacity = 1;
	}, false);

	document.addEventListener('drop', function (event) {

		event.preventDefault();

		var reader = new FileReader();
		reader.addEventListener('load', function (event) {

			material.map.image.src = event.target.result;
			material.map.needsUpdate = true;
		}, false);
		reader.readAsDataURL(event.dataTransfer.files[0]);

		document.body.style.opacity = 1;
	}, false);

	window.addEventListener('resize', onWindowResize, false);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);

	// Init Rain
	initRain();
}

function initRain() {
	rainGeometry = new THREE.Geometry();

	var sprite1 = THREE.ImageUtils.loadTexture("textures/rain1.png"),
	    sprite2 = THREE.ImageUtils.loadTexture("textures/rain2.png"),
	    sprite3 = THREE.ImageUtils.loadTexture("textures/rain3.png"),
	    sprite4 = THREE.ImageUtils.loadTexture("textures/rain4.png"),
	    sprite5 = THREE.ImageUtils.loadTexture("textures/rain5.png");

	for (var i = 0; i < rainDensity; i++) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 4000 + 500;
		vertex.z = Math.random() * 2000 - 1000;

		rainGeometry.vertices.push(vertex);
	}

	parameters = [[[1.0, 0.2, 0.5], sprite2, 20], [[0.95, 0.1, 0.5], sprite3, 15], [[0.90, 0.05, 0.5], sprite1, 10], [[0.85, 0, 0.5], sprite5, 8], [[0.80, 0, 0.5], sprite4, 5]];

	for (var i = 0; i < parameters.length; i++) {

		color = parameters[i][0];
		sprite = parameters[i][1];
		size = parameters[i][2];

		materials[i] = new THREE.PointCloudMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
		materials[i].color.setHSL(color[0], color[1], color[2]);

		particles = new THREE.PointCloud(rainGeometry, materials[i]);

		particles.rotation.z = Math.random() * 0.20 + 0.10;

		scene.add(particles);
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// function onDocumentMouseDown( event ) {
// 
// 	// event.preventDefault();
// 
// 	isUserInteracting = true;
// 
// 	onPointerDownPointerX = event.clientX;
// 	// onPointerDownPointerY = event.clientY;
// 
// 	onPointerDownLon = lon;
// 	// onPointerDownLat = lat;
// 
// }

function onDocumentMouseMove(event) {

	isUserInteracting = true;
	lon = event.clientX;
	// event.clientY = 0
	// lon = ( onPointerDownPointerX - event.clientX ) * -0.5 + onPointerDownLon;

	// if ( isUserInteracting === true ) {
	// 	// onPointerDownLon = lon;
	// 	lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
	// 	// lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
	// }
}

function onDocumentMouseUp(event) {

	isUserInteracting = false;
}

// Zoom in & out | Need to limit this to the starting point and a endind point
function onDocumentMouseWheel(event) {

	camera.fov += event.deltaY * 0.01;
	camera.updateProjectionMatrix();
}

function animate() {
	animateRain();

	requestAnimationFrame(animate);
	update();
}

function update() {

	if (isUserInteracting === false) {
		// lon += 0.1;
	}

	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);

	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	// camera.target.y = 500 * Math.cos( phi );
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(camera.target);

	/*
 // distortion
 camera.position.copy( camera.target ).negate();
 */
	// let delta = clock.getDelta(), speed = delta * CAMERAMOVESPEED;
	// controls.update(delta);
	// spotLight.target = marker;
	// controls.update()

	spotLightHelper.update();
	stats.update();
	// rainEngine.update(0.01 * 0.5)
	renderer.render(scene, camera);
}

function animateRain() {
	var time = Date.now() * 0.00005;

	for (var i = 0; i < scene.children.length; i++) {

		var object = scene.children[i];

		if (object instanceof THREE.PointCloud) {

			if (i == 0) {
				object.translateY(-10);
			}

			if (i > 0) {
				if (layer) object.translateY(-10);else if (scene.children[i - 1].position.y < window.innerHeight * -1 / 2 - 1000) object.translateY(-10);
			}

			if (object.position.y < window.innerHeight * -1 * 5) {
				object.position.y = 500;
				object.position.x = 0;
				if (i == 0) layer = true;
			}
		}
	}

	for (var i = 0; i < materials.length; i++) {

		color = parameters[i][0];

		h = 360 * (color[0] + time) % 360 / 360;
		materials[i].color.setHSL(h, color[1], color[2]);
	}
}

function getPosition(event) {
	var x = new Number();
	var y = new Number();

	if (event.x != undefined && event.y != undefined) {
		x = event.x;
		y = event.y;
	} else {
		// Firefox method to get the position
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= container.offsetLeft;
	y -= container.offsetTop;
	// alert("x: " + x + "  y: " + y);
	console.log("x: " + x + "  y: " + y);
}
//# sourceMappingURL=app.js.map
