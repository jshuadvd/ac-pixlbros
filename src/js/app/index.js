// let camera;
// let scene;
// let renderer;
// let isUserInteracting = false;
// const onMouseDownMouseX = 0;
// const onMouseDownMouseY = 0;
// const onMouseDownLat = 0;
// const onMouseDownLon = 0;
let lon = 30;
// let lat = 0;
// let phi = 0;
// let theta = 0;
let fovMin = 75;
let fovMax = 55;
// let zoomed;
// 
let onPointerDownPointerX;
// let onPointerDownPointerY;
let onPointerDownLon;
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
let audio = document.createElement('audio');
let source = document.createElement('source');
source.src = '/audio/AC-Trailer.mp3';
audio.appendChild(source);
audio.play();

let camera, container, controls, clock, info, marker, mesh, mousePos, renderer, raycaster, scene, spotLight, spotLightHelper, stats;
// var MOVESPEED = 0, LOOKSPEED = 0.075, CAMERAMOVESPEED = MOVESPEED * 2;
let isUserInteracting = true,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

container = document.getElementById( 'container' );
// info = document.getElementById( 'info' );

init();
animate();

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();

//************************************************************************//
//                             Init Scene                                //
//************************************************************************//

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
	camera.target = new THREE.Vector3( 0, 0, 0 );

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x000000, 0.005);
	scene.fog = new THREE.Fog(0x000000, 0.012);
	

	let geometry = new THREE.SphereGeometry( 500, 60, 400 );
	geometry.scale( - 1, 1, 1 );

	let material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'textures/AnimusPanorama.jpg' ),
		fog: true,
		transparent: true	
	});

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	// controls = new THREE.FirstPersonControls( camera );
	// controls.movementSpeed = MOVESPEED;
	// controls.lookSpeed = LOOKSPEED;
	// controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	// controls.noFly = true;
	// clock = new THREE.Clock();
	
	let spotLight = new THREE.SpotLight(0xffffff, 4, 40);
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
	scene.add( spotLight );
	// camera.add(spotLight);
	// scene.add(camera)

	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );
		
	// marker = new THREE.Object3D();
	// marker.position.set(400, 300, 400);
	// marker.add(spotLight);
	// scene.add(marker);
	
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	
	let onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			
			case 38: // up
			case 87: // w
			moveForward = true;
			break;
			
			case 37: // left
			case 65: // a
			// lon = event.clientX
			moveLeft = true; 
			break;
			
			case 40: // down
			case 83: // s
			moveBackward = true;
			break;
			
			case 39: // right
			case 68: // d
			// lon = event.clientX
			moveRight = true;
			break;
			
			case 32: // space
			if ( canJump === true ) velocity.y += 350;
			canJump = false;
			break;
		}
	};
	
	let onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			
			case 38: // up
			case 87: // w
			moveForward = false;
			break;
			
			case 37: // left
			case 65: // a
			moveLeft = false;
			break;
			
			case 40: // down
			case 83: // s
			moveBackward = false;
			break;
			
			case 39: // right
			case 68: // d
			moveRight = false;
			break;
			
		}
	};

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	container.addEventListener("mousemove", getPosition, false);

	// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	// document.addEventListener("DOMContentLoaded", init, false);

	document.addEventListener( 'dragover', function ( event ) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';

	}, false );

	document.addEventListener( 'dragenter', function ( event ) {

		document.body.style.opacity = 0.5;

	}, false );

	document.addEventListener( 'dragleave', function ( event ) {

		document.body.style.opacity = 1;

	}, false );

	document.addEventListener( 'drop', function ( event ) {

		event.preventDefault();

		let reader = new FileReader();
		reader.addEventListener( 'load', function ( event ) {

			material.map.image.src = event.target.result;
			material.map.needsUpdate = true;

		}, false );
		reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

		document.body.style.opacity = 1;

	}, false );

	window.addEventListener( 'resize', onWindowResize, false );
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	// Create Rain
	// let rainEngine = new ParticleEngine();
	// rainEngine.setValues( Examples.rain );
	// rainEngine.initialize();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

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

function onDocumentMouseMove( event ) {
	
	isUserInteracting = true;
	lon = event.clientX 
	event.clientY = 0
	// lon = ( onPointerDownPointerX - event.clientX ) * -0.5 + onPointerDownLon;
	
	// if ( isUserInteracting === true ) {
	// 	// onPointerDownLon = lon;
	// 	lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
	// 	// lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
	// }
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}

// Zoom in & out | Need to limit this to the starting point and a endind point
function onDocumentMouseWheel( event ) {
	
	camera.fov += event.deltaY * 0.01;
	camera.updateProjectionMatrix();

}

function animate() {

	requestAnimationFrame( animate );
	update();

}

function update() {
		
	if ( isUserInteracting === false ) {
		// lon += 0.1;
	}

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );

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
	
	
	spotLightHelper.update()
	stats.update()
	// rainEngine.update(0.01 * 0.5)
	renderer.render( scene, camera );

}

function getPosition(event) {
	let x = new Number();
	let y = new Number();
	
	if (event.x != undefined && event.y != undefined) {
		x = event.x;
		y = event.y;
	} else { // Firefox method to get the position
		x = event.clientX + document.body.scrollLeft +
		document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop +
		document.documentElement.scrollTop;
	}
	x -= container.offsetLeft;
	y -= container.offsetTop;	
	// alert("x: " + x + "  y: " + y);
	console.log("x: " + x + "  y: " + y);
	
}
