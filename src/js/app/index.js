
let position = {
	lon: 30
}
let lon = 30;
// let lat = 0;
// let phi = 0;
// let theta = 0;
let fovMin = 75;
let fovMax = 50;
// let zoomed = false;

let onPointerDownPointerX;
let onPointerDownLon;
// let onPointerDownLat;
let blocked = false;
let curPosX = 0;

//************************************************************************//
//                             Init Loader                                //
//************************************************************************//

let showLoader = false;

if(showLoader) {
	var bar = new ProgressBar.Path('.st0', {
		easing: 'easeInOut',
		duration: 800
	});
	bar.set(0)

	let percent = 0.1
	let int = setInterval(function() {
		percent += 0.1;
		if(percent >= 1.0) {
			clearInterval(int);
		} else {
			bar.animate(percent, () => {
				TweenMax.to($('#loader') , 0.3, {autoAlpha: 0, display: 'none'});
			});
			let fixed = (percent*100).toFixed(0);
			$('text').html(`${fixed}%`)
		}
	}, 500)

	// THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
	// 	let percent = loaded/total
	// 	bar.animate(percent, function() {
	// 		TweenMax.to($('#loader') , 0.3, {autoAlpha: 0, display: 'none'});
	// 	});
	// 	let fixed = (percent*100).toFixed(0);
	// 	$('text').html(`${fixed}%`);
	// };
} else {
	$('#loader').hide();
}

function setupButtons() {
	$('.button-outer .logo').each(function() {
		var $el = $(this);
		var clone = $el.find('.clone').clone().attr('class', 'fill blur');
		$el.append(clone);
	});
	$('.inner-path').each(function() {
		var $el = $(this);
		var clone = $el.clone().attr('class', 'blur');
		$el.after(clone);
	});
	$('.button-outer').on('mouseenter', function() {
		var key = $(this).attr('key');
		console.log('moustenter', key);
		buttons[key].animate(1);
	});
	$('.button-outer').on('mouseleave', (event) => {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
	});
}

var buttons = {};


//************************************************************************//
//                             Init Audio                                 //
//************************************************************************//

// let audio = document.createElement('audio');
// let source = document.createElement('source');
// source.src = 'audio/AC-Trailer.mp3';
// audio.appendChild(source);
// audio.play();

let audio = new Audio('audio/AC-Trailer.mp3');
audio.play();

let playAudio = true;

// $('.sound').click(function() {
//   if (this.paused == false) {
//       audio.pause();
//   } else {
//       audio.play();
//   }
// });


// herp derp

$(document).ready(function() {

	$('.button-outer').each((index, el) => {
		var $el = $(el);
		var key = $el.attr('key');
		buttons[key] = new ProgressBar.Path($el.find('.outer-path').get(0), {
			easing: 'easeInOut',
			duration: 500
		});
		buttons[key].set(0);
	});

	$('.button-outer').on('mouseenter', function() {
		var key = $(this).attr('key');
		console.log('moustenter', key);
		buttons[key].animate(1);
		// $(this).find('.outer-path').data('progress')
	});

	$('.button-outer').on('mouseleave', (event) => {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
		// $(event.currentTarget).find('.outer-path').data('progress').set(0);
	});

	$('.button-outer').on('click', () => {
		var key = $(event.currentTarget).attr('key');
		handleButtonClick(key);
	});

	let offLine = $('.sound line');
	let container = offLine.parents('svg');
	$('.sound').on('click', () => {
		if(playAudio) {
			audio.pause();
			offLine.show();
			container.attr('class', 'off');
		} else {
			audio.play();
			offLine.hide();
			container.attr('class', '');
		}
		playAudio = !playAudio;
	});

	setupButtons();
});

//************************************************************************//
//                              Variables                           	  //
//************************************************************************//

let camera, container, color, controls, clock, delta, deviceControls, h, hotspot, info, logoGeo, logoMaterial, logoMesh, logoTexture, marker, mesh, materials = [], mouse, mousePos, objects = [], parameters, particles, particleMaterial, rainDensity = 20000, rainGeometry, raycaster, renderer, scene, size, smokeParticles = [], spotLight, spotLightHelper, sprite, stats; 
let layer = false;
let hsParticles = [];
let rotateSpeed = 0.03
let hotspots = [];
let hotspotObjects = [
	{
		id: 0,
		content: {
			header: '',
			body: ''
		},
		feature: {
			type: 'mesh',
			location: ''
		},
		lon: 19,
		position: [450, 0, 150],
	},
	{
		id: 1,
		lon: -323,
		position: [370, 0, 280],
	},
	{
		id: 2,
		lon: -274,
		position: [25, 0, 400],
	},
	{
		id: 3,
		lon: -254,
		position: [-115, 0, 400],
	},
	{
		id: 4,
		lon: -207,
		position: [-400, 0, 205],
	},
	{
		id: 5,
		lon: -184,
		position: [-445, 0, 30],
	},
	{
		id: 6,
		lon: -125,
		position: [-265, 0, -380],
	},
	{
		id: 7,
		lon: -97.5,
		position: [-60, 0, -455],
	},
	{
		id: 8,
		lon: -74.5,
		position: [125, 0, -455],
	},
	{
		id: 9,
		lon: -27,
		position: [400, 0, -205]
	},
];
let onMouseDownMouseX = 0, onMouseDownMouseY = 0,
onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

container = document.getElementById( 'container' );

let containerWidth = container.clientWidth;
let containerHeight = container.clientHeight;

let selectedObjects = [];
let loader;
let renderPass;
let outlinePass;
let composer;
let effectFXAA;
// let controlsEnabled = true;
let showingModal = false;
let initialOrientation;
let isUserInteracting = false;

let projector = new THREE.Projector();
let mouseVector = new THREE.Vector3();

// var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

// if (havePointerLock) {
// 	var element = document.body;
// 	var pointerlockchange = function(event) {
// 		if(showingModal) return;
// 		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
// 			controlsEnabled = true;
// 			// controls.enabled = true;
// 			blocker.style.display = 'none';
// 		} else {
// 			// controls.enabled = false;
// 			controlsEnabled = false;
// 			blocker.style.display = '-webkit-box';
// 			blocker.style.display = '-moz-box';
// 			blocker.style.display = 'box';
// 			instructions.style.display = '';
// 		}
// 	};

// 	var pointerlockerror = function(event) {
// 		instructions.style.display = '';
// 	};

// 	// Hook pointer lock state change events
// 	document.addEventListener('pointerlockchange', pointerlockchange, false);
// 	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
// 	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

// 	document.addEventListener('pointerlockerror', pointerlockerror, false);
// 	document.addEventListener('mozpointerlockerror', pointerlockerror, false);
// 	document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

// 	instructions.addEventListener('click', function(event) {
// 		instructions.style.display = 'none';
// 		// Ask the browser to lock the pointer
// 		pointerLock();
// 	}, false);
// } else {
// 	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
// }

// function pointerLock() {
// 	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
// 	if (/Firefox/i.test(navigator.userAgent)) {
// 		var fullscreenchange = function(event) {
// 			if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
// 				document.removeEventListener('fullscreenchange', fullscreenchange);
// 				document.removeEventListener('mozfullscreenchange', fullscreenchange);
// 				element.requestPointerLock();
// 			}
// 		};
// 		document.addEventListener('fullscreenchange', fullscreenchange, false);
// 		document.addEventListener('mozfullscreenchange', fullscreenchange, false);
// 		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
// 		element.requestFullscreen();
// 	} else {
// 		element.requestPointerLock();
// 	}
// }

init();
animate();

//************************************************************************//
//                             Init Scene                                 //
//************************************************************************//

function init() {

	var width = window.innerWidth || 1;
	var height = window.innerHeight || 1;
	var devicePixelRatio = window.devicePixelRatio || 1;
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.shadowMap.enabled = true;
	renderer.setClearColor( 0xa0a0a0 );
	renderer.setPixelRatio( 1 );
	renderer.setSize( width, height );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.target = new THREE.Vector3( 0, 0, 0 );
	scene = new THREE.Scene();

	let geometry = new THREE.SphereGeometry( 500, 60, 400 );
	geometry.scale( - 1, 1, 1 );

	let material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'textures/AnimusPanoramaTreated.jpg' ),
		fog: true,
	});
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'scene';
	scene.add( mesh );
	
	stats = initStats()
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	
	// Build items for raycaster clicks
	buildHotspots();
	
	
	// Device Orientation Stuff	
	// deviceControls = new DeviceOrientationController( camera, renderer.domElement );
	// deviceControls.connect()
	
	// setupControllerEventHandlers( deviceControls )
	
	
	
	// if (window.DeviceOrientationEvent) {
	// 	console.log("Wonderful, Our browser supports DeviceOrientation");
	// 	window.addEventListener("deviceorientation", deviceOrientationListener, false);
	// 	deviceControls = new THREE.DeviceOrientationControls( camera, renderer.domElement );
	// } else {
	// 	console.log("Sorry, your browser doesn't support Device Orientation");
	// }

	// temp sphere
	// var sphereMaterial = new THREE.MeshNormalMaterial();
	// var sphereGeometry = new THREE.SphereGeometry(200, 200, 200);
	// var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	// // sphere.position.set(0, 0, 0);
	// sphere.position.set(0, 0, 200);
	// // sphere.position.set(-60, 55, 0);
	// scene.add( sphere );

	// controls = new THREE.PointerLockControls(camera);
	// scene.add(controls.getObject());
	
	clock = new THREE.Clock();
	// renderer = new THREE.WebGLRenderer({
	// 	antialias: true,
	// 	alpha: true,
	// });
	// renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setSize( window.innerWidth, window.innerHeight );

	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass( renderPass );
	outlinePass = new THREE.OutlinePass( new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

	outlinePass.edgeStrength = 10.0;
	outlinePass.edgeGlow = 10.0;
	outlinePass.edgeThickness = 4.0;
	outlinePass.pulsePeriod = 5;
	// outlinePass.edgeStrength = 2.0;
	// outlinePass.edgeGlow = 5.0;
	// outlinePass.edgeThickness = 2.0;
	// outlinePass.pulsePeriod = 0.8;
	// outlinePass.visibleEdgeColor = '#fffffff'; //{r: 255, g: 255, b: 255}
	outlinePass.visibleEdgeColor = {r: 255, g: 255, b: 255};

	composer.addPass( outlinePass );
	// @todo: prob dont need this texture but SHRUG
	var onLoad = function(texture) {
		outlinePass.patternTexture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	};
	var lod = new THREE.TextureLoader();
	lod.load(
		// resource URL
		'textures/tri_pattern.jpg',
		// Function when resource is loaded
		onLoad
	);

	effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );
	effectFXAA.renderToScreen = true;
	composer.addPass( effectFXAA );

	container.appendChild( renderer.domElement );
	// container.addEventListener("mousemove", getPosition, false);
	
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	window.addEventListener( 'resize', onWindowResize, false );
	
	initRain();
	// buildSmoke();
	buildHotspot();
	orientCamera();
	
	document.body.appendChild( renderer.domElement );

}

function getUrlParams() {
	var urlParams,
		match,
	    pl     = /\+/g,  // Regex for replacing addition symbol with a space
	    search = /([^&=]+)=?([^&]*)/g,
	    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	    query  = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
	   urlParams[decode(match[1])] = decode(match[2]);
	return urlParams;
}

function orientCamera() {
	var urlParams = getUrlParams();
	if(urlParams.id) {
		let id = parseInt(urlParams.id)
		let hotspot = hotspotObjects.filter( hotspot => id === hotspot.id );
		if(hotspot) {
			hotspot = hotspot[0]
			initialOrientation = hotspot.lon;
			popModal(hotspot);
		}
	}
}

let buttonClicks = {
	'ig-header'() {
		console.log('igHeader');
	},
	fb() {
		console.log('fbshare');
	}
}
function handleButtonClick(key) {
	if(key in buttonClicks) buttonClicks[key]();
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('js/ac-badge-big.js', function(geometry) {
	// loader.load('js/ac-badge.js', function(geometry) {
	// loader.load('js/ac-logo.js', function(geometry) {
		hotspots = hotspotObjects.map( (hotspotObject, index) => {
			geometry.center();

			// previous ac-logo.js scale
			// let scale = 10;

			let scale = 45;

			let hotspot = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: '#cccccc', opacity: 1 } ));
			hotspot.name = `hotspot-${index}`;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale
			hotspot.rotation.x = .5*Math.PI
			// console.log('hotspotObject', hotspotObject);
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

			let hitboxGeo = new THREE.BoxBufferGeometry( box.getSize().x * scale * 1.2, 200, box.getSize().x * scale * 1.2 );
			let hitboxMat = new THREE.MeshBasicMaterial({wireframe: true});
			// // hitboxMat.visible = false
			let hitboxMesh = new THREE.Mesh( hitboxGeo, hitboxMat );
			hitboxMesh.name = `hitbox-${index}`;

			let hotspotLocation = hotspotObject.position;

			var group = new THREE.Group();
			group.name = `group-${index}`
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
	let light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(-1, 0, 1);
	scene.add(light);
	
	let directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
  
	let smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
	let smokeMaterial = new THREE.MeshLambertMaterial({
		color: 0xffffff, 
		map: smokeTexture, 
		transparent: true
	});
	let smokeGeo = new THREE.PlaneGeometry(500, 500);
	 
	for (let p = 0; p < 150; p++) {
		let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
		particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
		particle.rotation.z = Math.random() * 360;
		scene.add(particle);
		smokeParticles.push(particle);
	}	
}


function evolveSmoke() {
	let sp = smokeParticles.length;
	while(sp--) {
		smokeParticles[sp].rotation.z += (delta * 0.2);
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
	
	 let light = new THREE.DirectionalLight(0xffffff, 1.5);
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
	let hs = hsParticles.length;
	while(hs--) {
		hsParticles[hs].rotation.z += (delta * 0.2);
	}
}

function initRain() {
	rainGeometry = new THREE.Geometry();

	let sprite1 = THREE.ImageUtils.loadTexture( "textures/rain1.png" ),
	sprite2 = THREE.ImageUtils.loadTexture( "textures/rain2.png" ),
	sprite3 = THREE.ImageUtils.loadTexture( "textures/rain3.png" ),
	sprite4 = THREE.ImageUtils.loadTexture( "textures/rain4.png" ),
	sprite5 = THREE.ImageUtils.loadTexture( "textures/rain5.png" );

	for (let i = 0; i < rainDensity; i++ ) {
		let vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 4000 + 500;
		vertex.z = Math.random() * 2000 - 1000;

		rainGeometry.vertices.push( vertex );
	}

	parameters = [ [ [1.0, 0.2, 0.5], 	sprite2, 20 ],
				   [ [0.95, 0.1, 0.5], 	sprite3, 15 ],
				   [ [0.90, 0.05, 0.5], sprite1, 10 ],
				   [ [0.85, 0, 0.5], 	sprite5, 8 ],
				   [ [0.80, 0, 0.5], 	sprite4, 5 ],
				   ];

	for (let i = 0; i < parameters.length; i++ ) {

		color  = parameters[i][0];
		sprite = parameters[i][1];
		size   = parameters[i][2];

		materials[i] = new THREE.PointCloudMaterial({ 
			size: size, 
			map: sprite, 
			blending: THREE.AdditiveBlending, 
			depthTest: false, 
			transparent : true 
		});
		materials[i].color.setHSL( color[0], color[1], color[2] );

		particles = new THREE.PointCloud( rainGeometry, materials[i] );

		particles.rotation.z = Math.random() * 0.20 + 0.10;

		scene.add( particles );
	}
}

function animateRain() {
	// console.log("I'M ANIMATING THINGS");
	let time = Date.now() * 0.00005;

	for (let i = 0; i < scene.children.length; i++ ) {

		let object = scene.children[i];
		
		if ( object instanceof THREE.PointCloud ) {
			// Not getting into the log here
			console.log("I'M ANIMATING THINGS");
			if (i == 0) {
				object.translateY(-10);
			}

			if (i > 0) {
				if (layer)
					object.translateY(-10);
				else
					if(scene.children[i-1].position.y < ((window.innerHeight * -1) / 2 - 1000))
						object.translateY(-10);
			}

			if ((object.position.y < window.innerHeight * -1 * 5)) {
					object.position.y = 500;
					object.position.x = 0;
					if (i == 0) layer = true;
			}
		}
	}

	for (let i = 0; i < materials.length; i++ ) {

		color = parameters[i][0];

		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );

	}
}

function onWindowResize() {
	var width = window.innerWidth || 1;
	var height = window.innerHeight || 1;
	var devicePixelRatio = window.devicePixelRatio || 1;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
	composer.setSize( width, height );
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );
}

function onDocumentTouchStart( event ) {
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );
}

function addSelectedObject(object) {
	selectedObjects = [];
	selectedObjects.push(object);
}

function checkRaycasterCollisions() {

	var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,
									-( event.clientY / window.innerHeight ) * 2 + 1,
									0.5 );
	raycaster.setFromCamera( mouse3D, camera );
	let intersects = raycaster.intersectObjects(scene.children, true);
	let items = intersects.filter( intersect => intersect.object.name.match(/hitbox/) );
	if(items.length) {
		items.forEach((item) => {
			let target = item.object.parent.children[0]
			if(selectedObjects.indexOf(target) === -1) {
				$('body').addClass('hot');
				addSelectedObject(target);
			}
		});
	} else {
		$('body').removeClass('hot');
		selectedObjects = [];
	}
	outlinePass.selectedObjects = selectedObjects;

	// this was center point collisions
	// raycaster.setFromCamera(mouse, camera);
	// let intersects = raycaster.intersectObjects(scene.children, true);
	// // @todo: we need to add deselect here
	// let items = intersects.filter( intersect => intersect.object.name.match(/hitbox/) )
	// if(items.length) {
	// 	items.forEach((item) => {
	// 		let target = item.object.parent.children[0]
	// 		if(selectedObjects.indexOf(target) === -1) {
	// 			addSelectedObject(target);
	// 		}
	// 	});
	// } else {
	// 	selectedObjects = [];
	// }
	// outlinePass.selectedObjects = selectedObjects;
}

function hideModal() {
	for(var i in buttons) {
		buttons[i].set(0);
	}
	let duration = 550/1000
	showingModal = false;
	// pointerLock();
	TweenMax.to($('.modal-container') , 0.3, {autoAlpha: 0})
	TweenMax.to(camera, duration, {fov: fovMin, onComplete: function() {
		blocked = false;
	}});
	// $('.button-outer').trigger('mouseleave');
}

function renderFeatureMesh() {
	var feature = $('.feature');

	if(feature.find('canvas').length) return;
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

	var render = function() {
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
	$('.modal-container').css({top: 0})
	$('.modal-container .close').on('click', hideModal);

	$('.overlay').on('click', hideModal);
	$(document).on('keydown', (event) => {
		if(event.charCode === 0) {
			hideModal();
		} 
	});
	if(hotspot.content) {
		if(hotspot.content.header) $('.modal .content h1').text(hotspot.content.header);
		if(hotspot.content.body) $('.modal .content p').text(hotspot.content.body);
	}
	renderFeatureMesh();
}

function makeUrlParams(id, subid) {
	let str = '';
	if(id !== undefined || id !== null) {
		str += `?id=${id}`;
	}
	if(!subid) subid = 0;
	str += `&subid=${subid}`;
	console.log('makeUrlParams', id, subid, str);
	return str;
}

function popModal(hotspot, subid) {
	console.log('popModal', hotspot)
	let urlParams = makeUrlParams(hotspot.id);
	history.replaceState(null, null, urlParams);
	let duration = 550/1000;
	showingModal = true;
	// document.exitPointerLock();
	TweenMax.to($('.modal-container') , 0.3, {autoAlpha: 1})
	TweenMax.to(camera, duration, {fov: fovMax, onComplete: spawnModal(hotspot)})
}

function onDocumentMouseDown( event ) {
	isUserInteracting = true;
	// raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	// var intersects = raycaster.intersectObjects( scene.children );
	// console.log('intersects', intersects);
	if(selectedObjects.length) {
		TweenMax.to(position, 550/1000, {lon: selectedObjects[0].hotspot.lon, onComplete: function() {
			popModal(selectedObjects[0].hotspot, 0);
		}});
		// TweenMax.to(position, 550/1000, {lon: selectedObjects[0].hotspot.lon})
		// popModal(selectedObjects[0].hotspot, 0);
	}
}

function rotateHotspots() {
	hotspots.forEach( hotspot => hotspot.children[0].rotation.z += rotateSpeed * 0.5 );
}

function onDocumentMouseMove( event ) {
	checkRaycasterCollisions();
	if(isUserInteracting) {
		let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		curPosX += movementX;
		position.lon = curPosX;
	}
}

function onDocumentMouseUp( event ) {
	isUserInteracting = false;
}

// Zoom in & out | Need to limit this to the starting point and a endind point
function onDocumentMouseWheel( event ) {
	if (camera.fov > 75) {
		camera.fov = 75
	} else {
		camera.fov += event.deltaY * 0.02;
		camera.updateProjectionMatrix();
	}
	// camera.fov += event.deltaY * 0.02;
	// camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame( animate );
	update();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function update() {
	// if ( isUserInteracting === false ) {
	// 	// lon += 0.1;
	// }
	// console.log('initialOrientation', lon, initialOrientation)
	// console.log('update', lon)
	if(initialOrientation) {
		position.lon = initialOrientation;
		initialOrientation = null;
	}

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( position.lon );

	camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
	// camera.target.y = 500 * Math.cos( phi );
	camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
	camera.lookAt( camera.target );

	/*
	// distortion
	camera.position.copy( camera.target ).negate();
	*/
	// let delta = clock.getDelta(), speed = delta * CAMERAMOVESPEED;
	// controls.update(delta);
	// spotLight.target = marker;
	// controls.update()
	
	// spotLightHelper.update()
	stats.update()
	delta = clock.getDelta();

	evolveSmoke();
	evolveHotspot();
	// animateRain();
	// rotateHotspot();
	rotateHotspots();

	// checkRaycasterCollisions();

	// rainEngine.update(0.01 * 0.5)
	theta += 0.1;
	// let radius = 600;
	// camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	// camera.lookAt( scene.position );
	// if (window.innerWidth < 800) {
	// 	deviceControls.update();
	// }
	
	// if (window.innerWidth < 768) {
		// deviceControls.update()
		// camera.lookAt(deviceControls.gamma)
		// console.log(deviceControls);
		
		// sconsole.log("DEVICE CONTROLS", deviceControls);
		// deviceControls.alpha = 0
		// deviceControls.beta = 180
		// deviceControls.gamma = 90
		// deviceControls.updateAlphaOffsetAngle(0);
	// }
	
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
	
	// deviceControls.update()
	
	// deviceControls.connect();
	renderer.render( scene, camera );
	// renderer.render( scene, camera );
	camera.updateProjectionMatrix();
	composer.render();
	// renderer.autoClear = true;
	// renderer.setClearColor( 0xfff0f0 );
	// renderer.setClearAlpha( 0.0 );
}

// function getPosition(event) {
// 	let x = new Number();
// 	let y = new Number();
	
// 	if (event.x != undefined && event.y != undefined) {
// 		x = event.x;
// 		y = event.y;
// 	} else { // Firefox method to get the position
// 		x = event.clientX + document.body.scrollLeft +
// 		document.documentElement.scrollLeft;
// 		y = event.clientY + document.body.scrollTop +
// 		document.documentElement.scrollTop;
// 	}
// 	x -= container.offsetLeft;
// 	y -= container.offsetTop;	
// 	// alert("x: " + x + "  y: " + y);
// 	console.log("x: " + x + "  y: " + y);
// }

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


function deviceOrientationListener(event) {
	let deg2rad = Math.PI / 180;
	camera.rotation.set(
        !event.beta * deg2rad,
        !event.gamma ? 0 : event.gamma * deg2rad,
        !event.alpha ? 0 : event.alpha * deg2rad
    );
	
	console.log(event.beta * deg2rad)
	console.log(event.gamma * deg2rad)
	console.log(event.alpha * deg2rad)
	
        // console.log("Do Stuff With Device", event);
        // ctx.clearRect(0, 0, c.width, c.height);
        // ctx.fillStyle = "#FF7777";
        // ctx.font = "14px Verdana";
        // ctx.fillText("Alpha: " + Math.Round(event.alpha), 10, 20);
        // ctx.beginPath();
        // ctx.moveTo(180, 75);
        // ctx.lineTo(210, 75);
        // ctx.arc(180, 75, 60, 0, event.alpha * Math.PI / 180);
        // ctx.fill();
		// 
        // ctx.fillStyle = "#FF6600";
        // ctx.fillText("Beta: " + Math.round(event.beta), 10, 140);
        // ctx.beginPath();
        // ctx.fillRect(180, 150, event.beta, 90);
		// 
        // ctx.fillStyle = "#FF0000";
        // ctx.fillText("Gamma: " + Math.round(event.gamma), 10, 270);
        // ctx.beginPath();
        // ctx.fillRect(90, 340, 180, event.gamma);
}

//DeviceOrientationController event handling
function setupControllerEventHandlers( controls ) {
	
	var controllerEl = document.querySelector( '#controllername' );
	var controllerDefaultText = controllerEl.textContent;
	var controllerSelectorEl = document.querySelector( '#controllertype' );
	var compassCalibrationPopupEl = document.querySelector( '#calibrate-compass-popup' );
	
	// Listen for manual interaction (zoom OR rotate)	
	controls.addEventListener( 'userinteractionstart', function () {
		renderer.domElement.style.cursor = 'move';
		controllerSelectorEl.style.display = 'none';
	});
	
	controls.addEventListener( 'userinteractionend', function () {
		renderer.domElement.style.cursor = 'default';
		controllerSelectorEl.style.display = 'inline-block';
	});
	
	// Listen for manual rotate interaction	
	controls.addEventListener( 'rotatestart', function () {
		controllerEl.innerText = 'Manual Rotate';
	});
	
	controls.addEventListener( 'rotateend', function () {
		controllerEl.innerText = controllerDefaultText;
	});
	
	// Listen for manual zoom interaction
	controls.addEventListener( 'zoomstart', function () {
		controllerEl.innerText = 'Manual Zoom';
	});
	
	controls.addEventListener( 'zoomend', function () {
		controllerEl.innerText = controllerDefaultText;
	});
	
	// Allow advanced switching between 'Quaternions' and 'Rotation Matrix' calculations
	controllerSelectorEl.addEventListener( 'click', function ( event ) {
		event.preventDefault();
		
		if ( controls.useQuaternions === true ) {
			controllerSelectorEl.textContent = 'Rotation Matrix';
			controls.useQuaternions = false;
		} else {
			controllerSelectorEl.textContent = 'Quaternions';
			controls.useQuaternions = true;
		}
	}, false);
}