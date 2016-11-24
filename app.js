var camera, controls, renderer, scene;

init();
animate();

function init() {

	var container = document.getElementById( 'container' );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.z = 0.01;

	controls = new THREE.OrbitControls( camera );
	controls.enableZoom = true;
	controls.enablePan = false;

	var textures = getTextures( "assets/textures/animus.jpg", 6 );

	var materials = [];

	for ( var i = 0; i < 6; i ++ ) {

		materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

	}

	// var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
	var skyBox = new THREE.Mesh( new THREE.SphereGeometry( 30, 32, 32 ), new THREE.MeshFaceMaterial( materials ) );
	skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, - 1 ) );
	scene.add( skyBox );

	window.addEventListener( 'resize', onWindowResize, false );

}

function getTextures( atlasImgUrl, tilesNum ) {

	var textures = [];

	for ( var i = 0; i < tilesNum; i ++ ) {

		textures[ i ] = new THREE.Texture();

	}

	var imageObj = new Image();

	imageObj.onload = function() {

		var canvas, context;
		var tileWidth = imageObj.height;

		for ( var i = 0; i < textures.length; i ++ ) {

			canvas = document.createElement( 'canvas' );
			context = canvas.getContext( '2d' );
			canvas.height = tileWidth;
			canvas.width = tileWidth;
			context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
			textures[ i ].image = canvas
			textures[ i ].needsUpdate = true;

		}

	};

	imageObj.src = atlasImgUrl;

	return textures;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	controls.update();

	renderer.render( scene, camera );

	requestAnimationFrame( animate );

}