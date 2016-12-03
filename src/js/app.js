'use strict';

var lon = 30;
// let lat = 0;
// let phi = 0;
// let theta = 0;
var fovMin = 75;
var fovMax = 55;
var zoomed = void 0;

var onPointerDownPointerX = void 0;
var onPointerDownLon = void 0;
// let onPointerDownLat;


//************************************************************************//
//                             Init Loader                                //
//************************************************************************//


var manager = new THREE.LoadingManager();

manager.onProgress = function (item, loaded, total) {
	item = 'textures/AC-Logo.png';
	console.log(item, loaded, total);
};
manager.onLoad = function () {
	console.log('all items loaded');
	return item;
};
manager.onError = function () {
	console.log('there has been an error');
};

//************************************************************************//
//                             Init Audio                                 //
//************************************************************************//

var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = '/audio/AC-Trailer.mp3';
audio.appendChild(source);
audio.play();

//************************************************************************//
//                              Variables                           	  //
//************************************************************************//

var camera = void 0,
    container = void 0,
    color = void 0,
    controls = void 0,
    clock = void 0,
    delta = void 0,
    h = void 0,
    info = void 0,
    layer = false,
    logoGeo = void 0,
    logoMaterial = void 0,
    logoMesh = void 0,
    logoTexture = void 0,
    marker = void 0,
    mesh = void 0,
    materials = [],
    mousePos = void 0,
    parameters = void 0,
    particles = void 0,
    rainDensity = 20000,
    rainGeometry = void 0,
    renderer = void 0,
    raycaster = void 0,
    scene = void 0,
    size = void 0,
    smokeParticles = [],
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

container = document.getElementById('container');

init();
animate();

//************************************************************************//
//                             Init Scene                                 //
//************************************************************************//

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
	camera.target = new THREE.Vector3(0, 0, 0);

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
	// scene.fog = new THREE.FogExp2(0x000000, 0.005);
	scene.fog = new THREE.Fog(0x000000, 0.0008);

	var geometry = new THREE.SphereGeometry(500, 60, 400);
	geometry.scale(-1, 1, 1);

	var material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg'),
		fog: true
	});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	stats = initStats();
	// let logoGeo = THREE.PlaneGeometry( 5, 20, 32 );
	// let logo = new THREE.MeshBasicMaterial({
	// 	map: new THREE.TextureLoader().load( 'textures/assassins_creed_logo.jpg' ),
	// })

	// let logoMesh = new THREE.Mesh(logoGeo, logo);
	// scene.add(logoMesh)
	// 


	// let spotLight = new THREE.SpotLight(0xffffff, 40, 40);
	// camera.add(spotLight);
	// spotLight.position.set(0, 0,1);
	// spotLight.target = mesh;
	// add light
	// let light = new THREE.DirectionalLight(0xffffff, 1);
	// light.position.set(0,0,0);
	// scene.add(light);

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
	// spotLight.position.set(-20, 60, -10);
	// spotLight.castShadow = true;
	// scene.add( spotLight );
	// camera.add(spotLight);
	// scene.add(camera)

	// spotLightHelper = new THREE.SpotLightHelper( spotLight );
	// scene.add( spotLightHelper );

	// marker = new THREE.Object3D();
	// marker.position.set(400, 300, 400);
	// marker.add(spotLight);
	// scene.add(marker);

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	clock = new THREE.Clock();

	// logoGeo = new THREE.PlaneGeometry(300,300);
	// THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
	// logoTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/quickText.png');
	// logoMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 0.1, map: logoTexture, transparent: true, blending: THREE.AdditiveBlending})
	// logoMesh = new THREE.Mesh(logoGeo, logoMaterial);
	// logoMesh.position.z = 800;
	// scene.add(logoMesh);

	logoGeo = new THREE.PlaneGeometry(1024, 1024);
	THREE.ImageUtils.crossOrigin = '';
	logoTexture = THREE.ImageUtils.loadTexture('/textures/AC-Logo.png');
	logoMaterial = new THREE.MeshLambertMaterial({
		// color: 0xffffff, 
		opacity: 2.1,
		map: logoTexture
	});
	logoMesh = new THREE.Mesh(logoGeo, logoMaterial);
	scene.add(logoMesh);

	// let onKeyDown = function ( event ) {
	// 	switch ( event.keyCode ) {
	// 		
	// 		case 38: // up
	// 		case 87: // w
	// 		moveForward = true;
	// 		break;
	// 		
	// 		case 37: // left
	// 		case 65: // a
	// 		// lon = event.clientX
	// 		moveLeft = true; 
	// 		break;
	// 		
	// 		case 40: // down
	// 		case 83: // s
	// 		moveBackward = true;
	// 		break;
	// 		
	// 		case 39: // right
	// 		case 68: // d
	// 		// lon = event.clientX
	// 		moveRight = true;
	// 		break;
	// 		
	// 		case 32: // space
	// 		if ( canJump === true ) velocity.y += 350;
	// 		canJump = false;
	// 		break;
	// 	}
	// };
	// 
	// let onKeyUp = function ( event ) {
	// 	switch( event.keyCode ) {
	// 		
	// 		case 38: // up
	// 		case 87: // w
	// 		moveForward = false;
	// 		break;
	// 		
	// 		case 37: // left
	// 		case 65: // a
	// 		moveLeft = false;
	// 		break;
	// 		
	// 		case 40: // down
	// 		case 83: // s
	// 		moveBackward = false;
	// 		break;
	// 		
	// 		case 39: // right
	// 		case 68: // d
	// 		moveRight = false;
	// 		break;
	// 		
	// 	}
	// };

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	container.addEventListener("mousedown", getPosition, false);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('wheel', onDocumentMouseWheel, false);
	// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	// document.addEventListener( 'keydown', onKeyDown, false );
	// document.addEventListener( 'keyup', onKeyUp, false );
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

	initRain();

	document.body.appendChild(renderer.domElement);
}

function buildSmoke() {
	//Smoke Light
	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(-1, 0, 1);
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

	var smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
	var smokeMaterial = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		map: smokeTexture,
		transparent: true
	});
	var smokeGeo = new THREE.PlaneGeometry(500, 500);

	for (var p = 0; p < 150; p++) {
		var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
		particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
		particle.rotation.z = Math.random() * 360;
		scene.add(particle);
		smokeParticles.push(particle);
	}
}

function evolveSmoke() {
	var sp = smokeParticles.length;
	while (sp--) {
		smokeParticles[sp].rotation.z += delta * 0.2;
	}
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

	for (var _i = 0; _i < parameters.length; _i++) {

		color = parameters[_i][0];
		sprite = parameters[_i][1];
		size = parameters[_i][2];

		materials[_i] = new THREE.PointCloudMaterial({
			size: size,
			map: sprite,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});
		materials[_i].color.setHSL(color[0], color[1], color[2]);

		particles = new THREE.PointCloud(rainGeometry, materials[_i]);

		particles.rotation.z = Math.random() * 0.20 + 0.10;

		scene.add(particles);
	}
}

function animateRain() {
	// console.log("I'M ANIMATING THINGS");
	var time = Date.now() * 0.00005;

	for (var i = 0; i < scene.children.length; i++) {

		var object = scene.children[i];

		// Not getting into the log here
		if (object instanceof THREE.PointCloud) {
			console.log("I'M ANIMATING THINGS");
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

	for (var _i2 = 0; _i2 < materials.length; _i2++) {

		color = parameters[_i2][0];

		h = 360 * (color[0] + time) % 360 / 360;
		materials[_i2].color.setHSL(h, color[1], color[2]);
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {

	isUserInteracting = true;
	lon = event.clientX;

	// if ( isUserInteracting === true ) {
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

	// spotLightHelper.update()
	stats.update();
	delta = clock.getDelta();
	evolveSmoke();
	animateRain();
	// rainEngine.update(0.01 * 0.5)
	renderer.render(scene, camera);
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

function initStats() {
	// stats.setMode(0); // 0: fps, 1: ms
	// Align top-left
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	// stats.domElement.style.bottom = '0px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);
	return stats;
}
//# sourceMappingURL=app.js.map
