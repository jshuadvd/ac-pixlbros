let camera;
let controls;
let renderer;
let scene;

init();
animate();

function init() {

	const container = document.getElementById( 'container' );

	console.log('container', container);

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

	const textures = getTextures( "/textures/animus.jpg", 6 );

	const materials = [];

	for ( let i = 0; i < 6; i ++ ) {

		materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

	}

	// var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
	const skyBox = new THREE.Mesh( new THREE.SphereGeometry( 30, 32, 32 ), new THREE.MeshFaceMaterial( materials ) );
	skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, - 1 ) );
	scene.add( skyBox );

	window.addEventListener( 'resize', onWindowResize, false );

}

function getTextures( atlasImgUrl, tilesNum ) {

	const textures = [];

	for ( let i = 0; i < tilesNum; i ++ ) {

		textures[ i ] = new THREE.Texture();

	}

	const imageObj = new Image();

	imageObj.onload = () => {
        let canvas;
        let context;
        const tileWidth = imageObj.height;

        for ( let i = 0; i < textures.length; i ++ ) {

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