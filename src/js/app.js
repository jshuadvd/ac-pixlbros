'use strict';

var lon = 30;
// let lat = 0;
// let phi = 0;
// let theta = 0;
var fovMin = 75;
var fovMax = 50;
// let zoomed = false;

var onPointerDownPointerX = void 0;
var onPointerDownLon = void 0;
// let onPointerDownLat;
var blocked = false;
var curPosX = 0;

//************************************************************************//
//                             Init Loader                                //
//************************************************************************//

var showLoader = false;

if (showLoader) {
	var bar;

	(function () {
		bar = new ProgressBar.Path('.st0', {
			easing: 'easeInOut',
			duration: 800
		});

		bar.set(0);

		var percent = 0.1;
		var int = setInterval(function () {
			percent += 0.1;
			if (percent >= 1.0) {
				clearInterval(int);
			} else {
				bar.animate(percent, function () {
					TweenMax.to($('#loader'), 0.3, { autoAlpha: 0, display: 'none' });
				});
				var fixed = (percent * 100).toFixed(0);
				$('text').html(fixed + '%');
			}
		}, 500);

		// THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
		// 	let percent = loaded/total
		// 	bar.animate(percent, function() {
		// 		TweenMax.to($('#loader') , 0.3, {autoAlpha: 0, display: 'none'});
		// 	});
		// 	let fixed = (percent*100).toFixed(0);
		// 	$('text').html(`${fixed}%`);
		// };
	})();
} else {
	$('#loader').hide();
}

function setupButtons() {
	$('.button-outer .logo').each(function () {
		var $el = $(this);
		var clone = $el.find('.clone').clone().attr('class', 'fill blur');
		$el.append(clone);
	});
	$('.inner-path').each(function () {
		var $el = $(this);
		var clone = $el.clone().attr('class', 'blur');
		$el.after(clone);
	});
	$('.button-outer').on('mouseenter', function () {
		var key = $(this).attr('key');
		console.log('moustenter', key);
		buttons[key].animate(1);
	});
	$('.button-outer').on('mouseleave', function (event) {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
	});
}

var buttons = {};

//************************************************************************//
//                             Init Audio                                 //
//************************************************************************//

var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = 'audio/AC-Trailer.mp3';
audio.appendChild(source);
audio.play();

$('.sound').click(function () {
	if (this.paused == false) {
		audio.pause();
	} else {
		audio.play();
	}
});

// herp derp

$(document).ready(function () {
	$('.button-outer').each(function (index, el) {
		var $el = $(el);
		var key = $el.attr('key');
		console.log('outer-path', $el.find('.outer-path'));
		buttons[key] = new ProgressBar.Path($el.find('.outer-path').get(0), {
			easing: 'easeInOut',
			duration: 500
		});
		buttons[key].set(0);
	});

	$('.button-outer').on('mouseenter', function () {
		var key = $(this).attr('key');
		console.log('moustenter', key);
		buttons[key].animate(1);
		// $(this).find('.outer-path').data('progress')
	});

	$('.button-outer').on('mouseleave', function (event) {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
		// $(event.currentTarget).find('.outer-path').data('progress').set(0);
	});

	$('.sound').on('click', function () {
		audio.stop();
	});

	setupButtons();
});

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
var hotspotObjects = [{
	content: {
		header: '',
		body: ''
	},
	feature: {
		type: 'mesh',
		location: ''
	},
	position: [450, 0, 150]
}, {
	position: [370, 0, 280]
}, {
	position: [25, 0, 400]
}, {
	position: [-115, 0, 400]
}, {
	position: [-400, 0, 205]
}, {
	position: [-445, 0, 30]
}, {
	position: [-265, 0, -380]
}, {
	position: [-60, 0, -455]
}, {
	position: [125, 0, -455]
}, {
	position: [400, 0, -205]
}];

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
var controlsEnabled = void 0;
var showingModal = false;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
	var element = document.body;
	var pointerlockchange = function pointerlockchange(event) {
		if (showingModal) return;
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
			controlsEnabled = true;
			// controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			// controls.enabled = false;
			controlsEnabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};

	var pointerlockerror = function pointerlockerror(event) {
		instructions.style.display = '';
	};

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', pointerlockchange, false);
	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

	document.addEventListener('pointerlockerror', pointerlockerror, false);
	document.addEventListener('mozpointerlockerror', pointerlockerror, false);
	document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

	instructions.addEventListener('click', function (event) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		pointerLock();
	}, false);
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

function pointerLock() {
	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	if (/Firefox/i.test(navigator.userAgent)) {
		var fullscreenchange = function fullscreenchange(event) {
			if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
				document.removeEventListener('fullscreenchange', fullscreenchange);
				document.removeEventListener('mozfullscreenchange', fullscreenchange);
				element.requestPointerLock();
			}
		};
		document.addEventListener('fullscreenchange', fullscreenchange, false);
		document.addEventListener('mozfullscreenchange', fullscreenchange, false);
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
		element.requestFullscreen();
	} else {
		element.requestPointerLock();
	}
}

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
		map: new THREE.TextureLoader().load('textures/AnimusPanoramaTreated.jpg'),
		fog: true
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'scene';
	scene.add(mesh);

	stats = initStats();

	deviceControls = new THREE.DeviceOrientationControls(camera, container);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Build items for raycaster clicks
	buildHotspots();

	// temp sphere
	// var sphereMaterial = new THREE.MeshNormalMaterial();
	// var sphereGeometry = new THREE.SphereGeometry(200, 200, 200);
	// var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	// // sphere.position.set(0, 0, 0);
	// sphere.position.set(0, 0, 200);
	// // sphere.position.set(-60, 55, 0);
	// scene.add( sphere );

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
	// @todo: prob dont need this texture but SHRUG
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
	window.addEventListener('resize', onWindowResize, false);

	initRain();
	// buildSmoke();
	buildHotspot();

	document.body.appendChild(renderer.domElement);
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('js/ac-logo.js', function (geometry) {
		hotspots = hotspotObjects.map(function (hotspotObject, index) {
			geometry.center();
			var scale = 10;
			var hotspot = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#870000', opacity: 1 }));
			hotspot.name = 'hotspot-' + index;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale;
			hotspot.rotation.x = Math.PI;
			console.log('hotspotObject', hotspotObject);
			hotspot.hotspot = hotspotObject;

			// auto generate some stuff!
			// {
			// 	content: {
			// 		header: '',
			// 		body: ''
			// 	},
			// 	feature: {
			// 		type: 'mesh',
			// 		location: ''
			// 	},
			// 	position: [-20, 0, -475],
			// },
			hotspot.hotspot.content = {};
			hotspot.hotspot.content.header = hotspot.name;
			hotspot.hotspot.content.body = Math.random().toString(36).substring(7);

			// hotspot.scale.x = 8
			// hotspot.scale.y = 10
			// hotspot.scale.z = 8
			// hotspot.rotation.y = 3

			var hitboxGeo = new THREE.BoxBufferGeometry(box.getSize().x * scale * 1.2, 200, box.getSize().x * scale * 1.2);
			var hitboxMat = new THREE.MeshBasicMaterial({ wireframe: true });
			// // hitboxMat.visible = false
			var hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
			hitboxMesh.name = 'hitbox-' + index;

			var hotspotLocation = hotspotObject.position;

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

function checkRaycasterCollisions() {
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	// @todo: we need to add deselect here
	var items = intersects.filter(function (intersect) {
		return intersect.object.name.match(/hitbox/);
	});
	if (items.length) {
		items.forEach(function (item) {
			var target = item.object.parent.children[0];
			if (selectedObjects.indexOf(target) === -1) {
				addSelectedObject(target);
			}
		});
	} else {
		selectedObjects = [];
	}
	outlinePass.selectedObjects = selectedObjects;
}

function hideModal() {
	for (var i in buttons) {
		buttons[i].set(0);
	}
	var duration = 550 / 1000;
	showingModal = false;
	pointerLock();
	TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 0 });
	TweenMax.to(camera, duration, { fov: fovMin, onComplete: function onComplete() {
			blocked = false;
		} });
	$('.button-outer').trigger('mouseleave');
}

function renderFeatureMesh() {
	var feature = $('.feature');

	if (feature.find('canvas').length) return;
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(feature.width(), feature.height());
	feature.append(renderer.domElement);

	var geometry = new THREE.CubeGeometry(5, 5, 5);
	var material = new THREE.MeshLambertMaterial({
		color: 0x00fff0
	});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 12;

	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(pointLight);

	var reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

	var render = function render() {
		reqAnimFrame(render);

		var delta = Math.random() * (0.06 - 0.02) + 0.02;

		cube.rotation.x += delta;
		cube.rotation.y += delta;
		cube.rotation.z -= delta;

		renderer.render(scene, camera);
	};

	render();
}

function spawnModal(hotspot) {
	$('.modal-container').css({ top: 0 });
	$('.modal-container .close').on('click', hideModal);

	$('.overlay').on('click', hideModal);
	$(document).on('keydown', function (event) {
		if (event.charCode === 0) {
			hideModal();
		}
	});
	$('.modal .content h1').text(hotspot.content.header);
	$('.modal .content p').text(hotspot.content.body);
	renderFeatureMesh();
}

function onDocumentMouseDown(event) {

	if (!controlsEnabled) return;

	if (selectedObjects.length) {
		console.log('DO STUFF');
		var _hotspot = selectedObjects[0].hotspot;
		var duration = 550 / 1000;
		showingModal = true;
		controlsEnabled = false;
		document.exitPointerLock();
		TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 1 });
		TweenMax.to(camera, duration, { fov: fovMax, onComplete: spawnModal(_hotspot) });
		// selectedObjects[0]
	}
}

function rotateHotspots() {
	hotspots.forEach(function (hotspot) {
		return hotspot.rotation.y += rotateSpeed * 0.5;
	});
}

function onDocumentMouseMove(event) {
	isUserInteracting = true;

	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

	if (controlsEnabled) {
		curPosX += movementX;
		lon = curPosX;
	}
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
	if (camera.fov > 75) {
		camera.fov = 75;
	} else {
		camera.fov += event.deltaY * 0.02;
		camera.updateProjectionMatrix();
	}
	// camera.fov += event.deltaY * 0.02;
	// camera.updateProjectionMatrix();
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

	checkRaycasterCollisions();
	// rainEngine.update(0.01 * 0.5)
	theta += 0.1;
	// let radius = 600;
	// camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	// camera.lookAt( scene.position );
	if (window.innerWidth < 800) {
		deviceControls.update();
	}

	// if (window.DeviceOrientationEvent) {
	// 	window.addEventListener('deviceorientation', function(event) {
	// 		let alpha = event.alpha;
	// 		let beta = event.beta;
	// 		let gamma = event.gamma;
	// 		// console.log("We on Mobile")
	// 		// console.log("GAMMA" gamma);
	// 		deviceControls.update();
	// 		// Do something
	// 	}, false);
	// }


	// deviceControls.connect();
	renderer.render(scene, camera);
	// renderer.render( scene, camera );
	camera.updateProjectionMatrix();
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

TweenLite.ticker.addEventListener("tick", render);

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

$(document).ready(function () {
	$('.slider').slick({
		dots: false,
		infinite: false,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 4,
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			}
		}, {
			breakpoint: 600,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 3
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 3
			}
		}
		// You can unslick at a given breakpoint now by adding:
		// settings: "unslick"
		// instead of a settings object
		]
	});
});
//# sourceMappingURL=app.js.map
