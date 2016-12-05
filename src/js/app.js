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
// audio.play();

//************************************************************************//
//                              Variables                           	  //
//************************************************************************//

var camera = void 0,
    container = void 0,
    color = void 0,
    controls = void 0,
    clock = void 0,
    delta = void 0,
    deviceControls = void 0,
    h = void 0,
    hotspot = void 0,
    hsParticles = [],
    info = void 0,
    layer = false,
    logoGeo = void 0,
    logoMaterial = void 0,
    logoMesh = void 0,
    logoTexture = void 0,
    marker = void 0,
    mesh = void 0,
    materials = [],
    mouse = void 0,
    mousePos = void 0,
    objects = [],
    parameters = void 0,
    particles = void 0,
    particleMaterial = void 0,
    rainDensity = 20000,
    rainGeometry = void 0,
    raycaster = void 0,
    renderer = void 0,
    rotateSpeed = 0.1,
    scene = void 0,
    size = void 0,
    smokeParticles = [],
    spotLight = void 0,
    spotLightHelper = void 0,
    sprite = void 0,
    stats = void 0;

var hotspots = [];
var hotspotLocations = [[-20, 0, -475], // -475Z
[145, 0, -475], // -475Z
[345, 0, -205], // -475Z
[-235, 0, -435], // -435Z
[-445, 0, -25], // -405Z
[450, 0, 90], [400, 0, 225], [65, 0, 400], [-95, 0, 400], [-270, 0, 105]];

var isUserInteracting = true,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

container = document.getElementById('container');

var selectedObjects = [];
var loader = void 0;
var renderPass = void 0;
var outlinePass = void 0;
var composer = void 0;
var effectFXAA = void 0;

init();
animate();

//************************************************************************//
//                             Init Scene                                 //
//************************************************************************//

function init() {

	var width = window.innerWidth || 1;
	var height = window.innerHeight || 1;
	var devicePixelRatio = window.devicePixelRatio || 1;
	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.shadowMap.enabled = true;
	renderer.setClearColor(0xa0a0a0);
	renderer.setPixelRatio(1);
	renderer.setSize(width, height);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
	camera.target = new THREE.Vector3(0, 0, 0);
	scene = new THREE.Scene();

	var geometry = new THREE.SphereGeometry(500, 60, 400);
	geometry.scale(-1, 1, 1);

	var material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama.jpg'),
		fog: true
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'scene';
	scene.add(mesh);

	stats = initStats();

	deviceControls = new THREE.DeviceOrientationControls(camera);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Build items for raycaster clicks
	buildHotspots();

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	clock = new THREE.Clock();
	// renderer = new THREE.WebGLRenderer({
	// 	antialias: true,
	// 	alpha: true,
	// });
	// renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setSize( window.innerWidth, window.innerHeight );

	// postprocessing
	composer = new THREE.EffectComposer(renderer);
	renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);
	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

	outlinePass.edgeStrength = 10.0;
	outlinePass.edgeGlow = 10.0;
	outlinePass.edgeThickness = 4.0;
	outlinePass.pulsePeriod = 5;
	outlinePass.visibleEdgeColor = { r: 60, g: 60, b: 60 };

	composer.addPass(outlinePass);
	var onLoad = function onLoad(texture) {
		outlinePass.patternTexture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	};
	var lod = new THREE.TextureLoader();
	lod.load(
	// resource URL
	'textures/tri_pattern.jpg',
	// Function when resource is loaded
	onLoad);

	effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
	effectFXAA.renderToScreen = true;
	composer.addPass(effectFXAA);

	container.appendChild(renderer.domElement);
	container.addEventListener("mousemove", getPosition, false);

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('wheel', onDocumentMouseWheel, false);

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
	// buildSmoke();
	buildHotspot();

	document.body.appendChild(renderer.domElement);
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('/js/ac-logo.js', function (geometry) {
		hotspots = hotspotLocations.map(function (hotspotLocation, index) {
			geometry.center();
			var scale = 10;
			var hotspot = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#870000', opacity: 1 }));
			hotspot.name = 'hotspot-' + index;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale;
			hotspot.rotation.x = Math.PI;

			// hotspot.scale.x = 8
			// hotspot.scale.y = 10
			// hotspot.scale.z = 8
			// hotspot.rotation.y = 3

			var hitboxGeo = new THREE.BoxBufferGeometry(box.getSize().x * scale * 1.2, 200, 10);
			var hitboxMat = new THREE.MeshBasicMaterial({ wireframe: true });
			// // hitboxMat.visible = false
			var hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
			hitboxMesh.name = 'hitbox-' + index;

			var group = new THREE.Group();
			group.name = 'group-' + index;
			group.position.set(hotspotLocation[0], hotspotLocation[1], hotspotLocation[2]);
			scene.add(group);
			group.add(hotspot);
			group.add(hitboxMesh);

			return group;
		});
	});
}

function buildSmoke() {
	// Smoke Light
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

function buildHotspot() {
	THREE.ImageUtils.crossOrigin = '';

	// for ( let i = 0; i < 10; i ++ ) {

	// let logoTexture = THREE.ImageUtils.loadTexture('/textures/animus_red_logo.png');
	// logoTexture.crossOrigin = 'anonymous';

	// let logoMaterial = new THREE.MeshLambertMaterial({
	// 	color: 0xffffff, 
	// 	map: logoTexture, 
	// 	transparent: true
	// });

	// let logoGeo = new THREE.PlaneGeometry(40, 60);
	// // let hotspots = [];

	// hotspot = new THREE.Mesh(logoGeo, logoMaterial);

	// // hotspot.position.x = Math.random() * 800 - 400;
	// // hotspot.position.y = 0;
	// // hotspot.position.z = -400;
	// // 
	// // hotspot.scale.x = Math.random() * 2 + 1;
	// // hotspot.scale.y = Math.random() * 2 + 1;
	// // hotspot.scale.z = Math.random() * 2 + 1;
	// // 
	// // hotspot.rotation.x = Math.random() * 2 * Math.PI;
	// // hotspot.rotation.y = Math.random() * 2 * Math.PI;
	// // hotspot.rotation.z = Math.random() * 2 * Math.PI;
	// hotspot.position.set(-45, 0, -400);
	// // hotspot.rotation.x = 0.1;
	// scene.add(hotspot);

	// hotspots.push(hotspot)		
	// }	

	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(-1, 0, 1);
	scene.add(light);
	// for (let p = 0; p < 50; p++) {
	//     let particle = new THREE.Mesh(logoGeo, logoMaterial);
	//     particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
	//     particle.rotation.z = Math.random() * 360;
	//     scene.add(particle);
	//     hsParticles.push(particle);
	// }	
}

function evolveHotspot() {
	var hs = hsParticles.length;
	while (hs--) {
		hsParticles[hs].rotation.z += delta * 0.2;
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

		if (object instanceof THREE.PointCloud) {
			// Not getting into the log here
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
	var width = window.innerWidth || 1;
	var height = window.innerHeight || 1;
	var devicePixelRatio = window.devicePixelRatio || 1;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
	composer.setSize(width, height);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
}

function onDocumentTouchStart(event) {
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown(event);
}

function addSelectedObject(object) {
	console.log('addSelectedObject', object.name);
	selectedObjects = [];
	selectedObjects.push(object);
}

function onDocumentMouseDown(event) {
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	intersects.filter(function (intersect) {
		return intersect.object.name.match(/hitbox/);
	}).forEach(function (item) {
		var target = item.object.parent.children[0];
		// target.material.color.set(Math.random() * 0xffffff)
		addSelectedObject(target);
		outlinePass.selectedObjects = selectedObjects;
	});
	// intersects.forEach((intersect) => {
	// 	console.log('intersect', intersect.object.name);
	// 	let object = intersect.object;
	// 	if(object.name !== 'scene') {
	// 		object.parent.children[0].material.color.set(Math.random() * 0xffffff)
	// 		addSelectedObject(object);
	// 		outlinePass.selectedObjects = object;
	// 	}
	// });
}

function rotateHotspots() {
	hotspots.forEach(function (hotspot) {
		return hotspot.rotation.y += rotateSpeed * 0.5;
	});
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
	// if (camera.fov > 75) {
	// 	camera.fov = 75
	// } else {
	// 	camera.fov += event.deltaY * 0.01;
	// 	camera.updateProjectionMatrix();
	// }
	camera.fov += event.deltaY * 0.02;
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);
	update();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
	// if ( isUserInteracting === false ) {
	// 	// lon += 0.1;
	// }
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
	evolveHotspot();
	// animateRain();
	// rotateHotspot();
	rotateHotspots();
	// rainEngine.update(0.01 * 0.5)
	theta += 0.1;
	// let radius = 600;
	// camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	// camera.lookAt( scene.position );
	// renderer.render( scene, camera );
	composer.render();
	// renderer.autoClear = true;
	// renderer.setClearColor( 0xfff0f0 );
	// renderer.setClearAlpha( 0.0 );
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
