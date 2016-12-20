let siteConfig = {
	siteURL: 'http://numinoustechnologies.com/animus/',
	shareText: 'Welcome to the Animus. Enter the 360º experience and discover the weapons and armor of the Assassins and Templars.',
	siteTweet: 'Welcome to the Animus. Enter the 360º experience and discover the weapons and armor of the Assassins and Templars. #AssassinsCreed [URL]',
	assetShare: 'I entered the 360º Animus and discovered the [Object Name], an ancient artifact of Assassins\' lore. Enter the Animus now to uncover ancient Assassins and Templar relics.',
	assetTweet: 'I entered the 360º Animus and discovered the [Object Name].'
}

let position = {
	lon: 30
}
let curPosX = 30;
let fovMin = 75;
let fovMax = 50;
let onPointerDownPointerX;
let onPointerDownLon;
let blocked = false;
let touchStartX;
let mouseStartX;

//************************************************************************//
//                             Init Loader                                //
//************************************************************************//

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
		slides: [
			{
				title: 'Bladed Spear de Bilboa',
				image: 'textures/weapons/bladed-spear-de-bilboa.png',
				key: 'bladed-spear-de-bilboa',
				description: 'this bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.'
			},
			{
				title: 'Assassin\'s Hidden Blade',
				image: 'textures/weapons/assassins-hidden-blade.png',
				key: 'assassins-hidden-blade',
				description: 'this simple leather vambrace as an essential piece of every assassin’s outfit. theblade-concealing armor both proects from attacks and gives the assassin access to a deadly hidden blade with a simple flick of the wrist.'
			}
		],
		lon: 19,
		position: [450, 0, 150],
	},
	{
		id: 1,
		lon: 39,
		slides: [
			{
				title: 'Córdoban Halberd',
				image: 'textures/weapons/cordoban-halberd.png',
				key: 'cordoban-halberd',
				description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.'
			}
		],
		position: [370, 0, 280],
	},
	{
		id: 2,
		lon: 87.5,
		slides: [
			{
				title: 'Legendary Prowler Hood',
				image: 'textures/weapons/legendary-prowler-hood.png',
				key: 'legendary-prowler-hood',
				description: 'if you’re talking stealth look no further than the legendary prowler hood. this stylish-but-effecient garb features discreet pockets for hidden blades and gives any assassin the ability to disappear into a crowd at a moment’s notice.'
			},
			{
				title: 'Assassin\'s Hidden Blade with Grappling Hook',
				image: 'textures/weapons/assassins-hidden-blade-with.png',
				key: 'assassins-hidden-blade-with',
				description: 'these leather killing machines hide a deadly blade on the right wrist and a powerful propulsive grappling hook on the left, creating a gauntlet of pain and dexterity unsurprassed throughout the kingdom.'
			}
		],
		position: [25, 0, 400],
	},
	{
		id: 3,
		lon: 106,
		slides: [
			{
				title: 'Shadow Brigadine',
				image: 'textures/weapons/shadow-brigandine.png',
				key: 'shadow-brigandine',
				description: 'this obsidian chainmail armor gives any assassin the ability to bleed into the shadows undetected, all the better to stalk and eliminate their templar prey.'
			},
			{
				title: 'Blade de Barcelona',
				image: 'textures/weapons/blade-de-barcelona.png',
				key: 'blade-de-barcelona',
				description: 'this curved blade was created by the greatest assassin craftsmen of barcelona to withstand blows from the strongest of weaponry. it’s unqiue curved design is designed to deflect direct blows from swords, spears and sabres.'
			},
			{
				title: 'Long Sword de Don Quixote',
				image: 'textures/weapons/long-sword-de-don-quixote.png',
				key: 'long-sword-de-don-quixote',
				description: 'this long sword, rumored to be owned by the legendary warrior don quixote, features tempered steel and a gold-infused hilt. just don’t try to fight a windmill with it. things probably won’t work out the way you want them to.'
			}
		],
		position: [-115, 0, 400],
	},
	{
		id: 4,
		lon: 153,
		slides: [
			{
				title: 'Bow de silencio',
				image: 'textures/weapons/bow-de-silencio.png',
				key: 'bow-de-silencio',
				description: 'your enemy will hear naught but the wind rustling through the trees as you release the string on this silent but deadly longbow. using arrows forged from strong spanish oak, this stealth weapon is a key in every assassin’s arsenal.'
			},
			{
				title: 'Piece of Eden',
				image: 'textures/weapons/piece-of-eden.png',
				key: 'piece-of-eden',
				description: 'this mysterious orb is rumored by many to unlock the mysteries of mind control, allowing the owner to manipulate freedom of thought. so if you’ve ever felt like an assassin was reading your mind, odds are you’re probably right.'
			}
		],
		position: [-400, 0, 205],
	},
	{
		id: 5,
		lon: 175,
		slides: [
			{
				title: 'Umbrella Blade',
				image: 'textures/weapons/umbrella-blade.png',
				key: 'umbrella-blade',
				description: 'this stealthy blade is not what you think it is. disguised as an early version of an umbrella, the hidden steel contained within is just as deadly as any weapon in the assassin’s collection.'
			},
			// missing slide here, "Cloak of Midnight"
			{
				title: 'Ceremonial Digit Removal Blade',
				image: 'textures/weapons/ceremonial-digit-removal-blade.png',
				key: 'ceremonial-digit-removal-blade',
				description: 'a shared touchpoint on every assassin’s journey involves this ceremonial digit removal blade. used to prove the assassin’s loyalty to the cause, seeing this device in a master assassin’s hands means final admittance to a very exclusive club...and a fairly uncomfortable afternoon.'
			}
		],
		position: [-445, 0, 30],
	},
	{
		id: 6,
		lon: 236,
		slides: [
			{
				title: 'Smoke Bombs',
				image: 'textures/weapons/smoke-bombs.png',
				key: 'smoke-bombs',
				description: 'used for both attack and escape, these pouch bombs use a combination of gunpowder, sulfur, and secret alchemy to create a variety of effects, from explosions to smoke screens. perfect for destraction...or destruction.'
			},
			{
				title: 'Pistola de Pyreness',
				image: 'textures/weapons/pistola-de-pyrenees.png',
				key: 'pistola-de-pyrenees',
				description: 'this pistola is an exclellent choice when stealth is no longer an option. perfect for disorienting groups of enemies or eliminating a lone inquisitor, this weapon is essential for every assassin in the field (or the mountains).'
			}
			// missing slide, piece of eden (gold)
		],
		position: [-265, 0, -380],
	},
	{
		id: 7,
		lon: 262.5,
		slides: [
			{
				title: 'Elche de Ballesta',
				image: 'textures/weapons/elche-de-ballesta.png',
				key: 'elche-de-ballesta',
				description: 'this powerful crossbow fires tungsten bolts at a velocity unmatched in ancient times, providing assassins with a silent option for long-range attacks.'
			}
		],
		position: [-60, 0, -455],
	},
	{
		id: 8,
		lon: 286.5,
		slides: [
			{
				title: 'Inquisitors Shield',
				image: 'textures/weapons/inquisitors-shield.png',
				key: 'inquisitors-shield',
				description: 'this standard bronze shield “borrowed” from the spanish inquisition gives assassin’s a powerful defensive tool for use in seige, or a valuable prop when infiltrating a spanish dungeon.'
			},
			{
				title: 'Armada Bow',
				image: 'textures/weapons/armada-bow.png',
				key: 'armada-bow',
				description: 'this powerful longbow favored by spanish seamen provides hightened accuracy and increased distance for maximum killing power. if that’s a thing you’re looking for.'
			}
		],
		position: [125, 0, -455],
	},
	{
		id: 9,
		lon: 332,
		slides: [
			{
				title: 'Blade of the Assassin',
				image: 'textures/weapons/blades-of-the-assassin.png',
				key: 'blades-of-the-assassin',
				description: 'whether leaping from a ledge or silently stalking a victim through a crowded marketplace, an assassin is only as good as his blades. featuring a variety of shapes and sizes customizable to its owner, no self-respecting assassin would be caught dead without one of these handy weapons.'
			}
		],
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
let freeze;

let projector = new THREE.Projector();
let mouseVector = new THREE.Vector3();

let currentHotspot;

let touchDevice
if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) { 
	touchDevice = true;
}

let showLoader = true;
let playAudio = true;
// var audioLoader = new THREE.AudioLoader();
// audioLoader.load(audioFile);

let audio;
let progressBar = $('.progress');
let numAnim = new CountUp(percent, 0, 0, 0, 0.5, {suffix: '%'});
let filesLoaded = 0;
let totalFiles = 0;
function loadTick() {
	let percent = filesLoaded/totalFiles*100;
	numAnim.update(percent);
	progressBar.css('width', `${percent}%`);
	if(percent === 100) {
		TweenMax.to($('#preloader'), 750/1000, {delay: 550/1000, autoAlpha: 0, onComplete: () => {
			audio.volume = 0.5;
			audio.play();
		}});
	}
}

function preloadAudio(url) {
	totalFiles += 1;
	let audio = new Audio();
	audio.addEventListener('canplaythrough', () => {
		filesLoaded += 1;
		loadTick();
	}, false);
	audio.src = url;
	return audio;
}

function preloadImages() {
	let slides = hotspotObjects.map( hotspotObject => hotspotObject.slides ).reduce( (prev, current) => prev.concat(current) )
	totalFiles += slides.length;
	slides.forEach((slide) => {
		let image = new Image();
		image.onload = () => {
			filesLoaded += 1;
			loadTick();
		}
		image.src = slide.image;
	});
}

if(showLoader) {
	preloadImages();
	audio = preloadAudio('audio/AC-Trailer.mp3');
	THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
		if(loaded === 1) totalFiles += total;
		filesLoaded += 1;
		loadTick();
	};
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

function Modal(hotspot) {
	this.modal = $('.modal');
	this.item = this.modal.find('.item');
	this.content = this.modal.find('.content');
	this.description = this.modal.find('.description');
	this.title = this.modal.find('.title');
	this.facebookShare = this.modal.find('.button-outer.fb');
	this.twitterShare = this.modal.find('.button-outer.twitter');
	this.nextButton = this.modal.find('.next');
	this.prevButton = this.modal.find('.prev');
	this.controls = this.modal.find('.controls');
	$('.modal-container .close').on('click', () => {
		this.hide();
	});
	$('.overlay').on('click', this.hide);
	this.bindEvents();
}

Modal.prototype = {
	bindEvents() {
		this.nextButton.on('click', () => {
			this.next();
		});

		this.prevButton.on('click', () => {
			this.prev();
		});
		this.facebookShare.on('click', () => {
			this.shareFacebook();
		});
		this.twitterShare.on('click', () => {
			this.shareTwitter();
		});
	},
	prev() {
		let content = this.content;
		let duration = this.duration;
		TweenMax.to(content, duration, {autoAlpha: 0, onComplete: () => {
			this.offset = this.offset === 0 ? this.hotspot.slides.length-1 : this.offset-1;
			this.setModalValues(this.hotspot.slides[this.offset]);
			TweenMax.to(content, duration, {autoAlpha: 1});
		}});
	},
	next() {
		let content = this.content;
		let duration = this.duration;
		TweenMax.to(content, duration, {autoAlpha: 0, onComplete: () => {
			this.offset = this.offset+1 === this.hotspot.slides.length ? 0 : this.offset+1;
			this.setModalValues(this.hotspot.slides[this.offset]);
			TweenMax.to(content, duration, {autoAlpha: 1});
		}})
	},
	// share: {
		shareFacebook() {
			let slide = this.hotspot.slides[this.offset];
			let href = `${siteConfig.siteURL}${makeUrlParams(this.hotspot.id, this.offset)}`;
			let picture = `${siteConfig.siteURL}${slide.image}`;
			FB.ui(
			{
				method: 'share',
				href: href,
				title: slide.title,
				picture: picture,
				// caption: 'your_caption',
				description: siteConfig.assetShare.replace('[Object Name]', slide.title)
			 },
			 function(response){
				// your code to manage the response
			 });
		},
		shareTwitter() {
			let params = encodeURIComponent(makeUrlParams(this.hotspot.id, this.offset));
			let url = `${siteConfig.siteURL}${params}`;
			let slide = this.hotspot.slides[this.offset];
			let text = siteConfig.assetTweet.replace('[Object Name]', slide.title)
			// .replace('[URL]', `${url}${params}`);
			let hashtags = 'AssassinsCreed'
			window.open(`http://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`);
		},
	// },
	duration: 0.35,
	offset: 0,
	setModalValues(hotspot) {
		this.description.text(hotspot.description);
		this.title.text(hotspot.title);
		this.item.attr('src', hotspot.image);
		this.modal.attr('class', `modal ${hotspot.key}`);
	},
	hide() {
		freeze = false;
		this.modal.attr('class', 'modal');
		for(var i in buttons) {
			buttons[i].set(0);
		}
		let duration = 550/1000
		showingModal = false;
		this.controls.hide();
		// pointerLock();
		TweenMax.to($('.modal-container') , 0.3, {autoAlpha: 0, onComplete: function() {
				this.modal.removeClass('open');
			}.bind(this)
		})
		TweenMax.to(camera, duration, {fov: fovMin, onComplete: function() {
			blocked = false;
		}});
		$(document).off('keydown');
	},
	show(hotspot, subid) {
		this.hotspot = hotspot;
		this.subid = subid;
		this.offset = 0;
		// let urlParams = makeUrlParams(hotspot.id);
		// history.replaceState(null, null, urlParams);
		let duration = 550/1000;
		showingModal = true;
		if(hotspot.slides && hotspot.slides.length > 0) {
			if(hotspot.slides.length > 1) this.controls.fadeIn();
			this.activeSlide = hotspot.slides[this.offset];
			this.setModalValues(this.activeSlide);
		}
		TweenMax.to($('.modal-container') , 0.3, {autoAlpha: 1});
		setTimeout(() => {
			this.modal.addClass('open');
		}, 200)
		TweenMax.to(camera, duration, {fov: fovMax, onComplete: () => {
			$('.modal-container').css({top: 0})
			$(document).on('keydown', (event) => {
				if(event.keyCode === 27) {
					modal.hide();
				} 
			});
		}})
	}
}
let modal = new Modal();
modal.bindEvents();

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
		buttons[key].animate(1);
	});

	$('.button-outer').on('mouseleave', (event) => {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
	});

	$('.button-outer').on('click', (event) => {
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
	renderer.physicallyCorrectLights = true;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.renderReverseSided = false;
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.toneMappingExposure = 0.8;
	renderer.setClearColor( 0xa0a0a0 );
	renderer.setPixelRatio( 1 );
	renderer.setSize( width, height );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.target = new THREE.Vector3( 0, 0, 0 );
	scene = new THREE.Scene();

	let geometry = new THREE.SphereGeometry( 500, 60, 400 );
	geometry.scale( - 1, 1, 1 );

	let material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'textures/AnimusPanorama_V4.jpg' ),
		fog: true,
	});
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'scene';
	scene.add( mesh );
	
	stats = initStats()
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// bulb
	// let bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
	// let bulbMat = new THREE.MeshStandardMaterial( {
	// 	emissive: 0xffffee,
	// 	emissiveIntensity: 1,
	// 	color: 0x000000
	// });
	// bulbLight.add(new THREE.Mesh( bulbGeometry, bulbMat));
	// bulbLight.position.set(0, 2, 0);
	// bulbLight.castShadow = true;
	// scene.add(bulbLight);
	// bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 );

	let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 5 );
	// hemiLight.color.setHSL( 0.6, 1, 0.6 );
	// hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set(0, 200, 0);
	scene.add(hemiLight);

	// var hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.1 );
	// hemiLight.intensity = 8;
	// scene.add( hemiLight );
	
	// Build items for raycaster clicks
	buildHotspots();
	
	// Device Orientation Stuff
	deviceControls = new DeviceOrientationController( camera, renderer.domElement );
	deviceControls.connect()
	setupControllerEventHandlers( deviceControls )

	// if (window.DeviceOrientationEvent) {
	// 	console.log("Wonderful, Our browser supports DeviceOrientation");
	// 	window.addEventListener("deviceorientation", deviceOrientationListener, false);
	// 	deviceControls = new THREE.DeviceOrientationControls( camera, renderer.domElement );
	// } else {
	// 	console.log("Sorry, your browser doesn't support Device Orientation");
	// }

	
	clock = new THREE.Clock();

	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass( renderPass );
	outlinePass = new THREE.OutlinePass( new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

	outlinePass.edgeStrength = 0.5;
	outlinePass.edgeGlow = 1.0;
	outlinePass.edgeThickness = 1.0;
	outlinePass.pulsePeriod = 0.1;
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


	// @todo: event aliasing
	// document.addEventListener(touchDevice ? 'touchstart' : 'mousedown', onDocumentMouseDown, false );
	// document.addEventListener(touchDevice ? 'touchmove' : 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener(touchDevice ? 'touchend' : 'mouseup', onDocumentMouseUp, false );

	document.addEventListener('mousedown', onDocumentMouseDown, false );
	document.addEventListener('mousemove', onDocumentMouseMove, false );
	document.addEventListener('mouseup', onDocumentMouseUp, false );

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	// document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	// document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	window.addEventListener( 'resize', onWindowResize, false );
	
	// initRain();
	// buildSmoke();
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
			currentHotspot = hotspot
			modal.show(hotspot);
		}
	}
}

let buttonClicks = {
	'ig-header'() {
		console.log('igHeader');
	},
	fb() {
		// modal.share('fb');
	}
}
function handleButtonClick(key) {
	if(key in buttonClicks) buttonClicks[key]();
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('js/new-ac-logo-e3.js', function(geometry) {
	// loader.load('js/ac-logo-simple.js', function(geometry) {
	// loader.load('js/ac-badge-big.js', function(geometry) {
	// loader.load('js/ac-badge.js', function(geometry) {
	// loader.load('js/ac-logo.js', function(geometry) {
		hotspots = hotspotObjects.map( (hotspotObject, index) => {
			geometry.center();

			let scale = 5;

			// previous ac-logo.js scale
			// let scale = 10;

			// js/ac-badge-big.js
			// let scale = 45;

			//js/ac-logo-simple.js
			// let scale = 27;

			// let newMat = new THREE.MeshLambertMaterial()

			let newMat = new THREE.MeshPhongMaterial( { 
				color: 0xFFFFFF, 
				specular: 0x000000,
				shininess: 1000
			} ) 

			let oldMat = new THREE.MeshBasicMaterial( { color: '#cccccc', opacity: 1 } )

			let hotspot = new THREE.Mesh(geometry, newMat);
			hotspot.name = `hotspot-${index}`;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale
			hotspot.rotation.x = .5*Math.PI
			hotspot.hotspot = hotspotObject;

			let hitboxGeo = new THREE.BoxBufferGeometry( box.getSize().x * scale * 1.2, box.getSize().x * scale * 1.2 , box.getSize().x * scale * 1.2 );
			let hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
			// {wireframe: true}
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

// function buildSmoke() {
// 	// Smoke Light
// 	let light = new THREE.DirectionalLight(0xffffff, 1.5);
// 	light.position.set(-1, 0, 1);
// 	scene.add(light);
// 	
// 	let directionalLight = new THREE.DirectionalLight(0xffffff);
// 	directionalLight.position.set(1, 1, 1).normalize();
// 	scene.add(directionalLight);
//   
// 	let smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
// 	let smokeMaterial = new THREE.MeshLambertMaterial({
// 		color: 0xffffff, 
// 		map: smokeTexture, 
// 		transparent: true
// 	});
// 	let smokeGeo = new THREE.PlaneGeometry(500, 500);
// 	 
// 	for (let p = 0; p < 150; p++) {
// 		let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
// 		particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
// 		particle.rotation.z = Math.random() * 360;
// 		scene.add(particle);
// 		smokeParticles.push(particle);
// 	}
// }


// function evolveSmoke() {
// 	let sp = smokeParticles.length;
// 	while(sp--) {
// 		smokeParticles[sp].rotation.z += (delta * 0.2);
// 	}
// }

// function initRain() {
// 	rainGeometry = new THREE.Geometry();
// 
// 	let sprite1 = THREE.ImageUtils.loadTexture( "textures/rain1.png" ),
// 	sprite2 = THREE.ImageUtils.loadTexture( "textures/rain2.png" ),
// 	sprite3 = THREE.ImageUtils.loadTexture( "textures/rain3.png" ),
// 	sprite4 = THREE.ImageUtils.loadTexture( "textures/rain4.png" ),
// 	sprite5 = THREE.ImageUtils.loadTexture( "textures/rain5.png" );
// 
// 	for (let i = 0; i < rainDensity; i++ ) {
// 		let vertex = new THREE.Vector3();
// 		vertex.x = Math.random() * 2000 - 1000;
// 		vertex.y = Math.random() * 4000 + 500;
// 		vertex.z = Math.random() * 2000 - 1000;
// 
// 		rainGeometry.vertices.push( vertex );
// 	}
// 
// 	parameters = [ [ [1.0, 0.2, 0.5], 	sprite2, 20 ],
// 				   [ [0.95, 0.1, 0.5], 	sprite3, 15 ],
// 				   [ [0.90, 0.05, 0.5], sprite1, 10 ],
// 				   [ [0.85, 0, 0.5], 	sprite5, 8 ],
// 				   [ [0.80, 0, 0.5], 	sprite4, 5 ],
// 				   ];
// 
// 	for (let i = 0; i < parameters.length; i++ ) {
// 
// 		color  = parameters[i][0];
// 		sprite = parameters[i][1];
// 		size   = parameters[i][2];
// 
// 		materials[i] = new THREE.PointCloudMaterial({ 
// 			size: size, 
// 			map: sprite, 
// 			blending: THREE.AdditiveBlending, 
// 			depthTest: false, 
// 			transparent : true 
// 		});
// 		materials[i].color.setHSL( color[0], color[1], color[2] );
// 
// 		particles = new THREE.PointCloud( rainGeometry, materials[i] );
// 
// 		particles.rotation.z = Math.random() * 0.20 + 0.10;
// 
// 		scene.add( particles );
// 	}
// }

// function animateRain() {
// 	// console.log("I'M ANIMATING THINGS");
// 	let time = Date.now() * 0.00005;
// 
// 	for (let i = 0; i < scene.children.length; i++ ) {
// 
// 		let object = scene.children[i];
// 		
// 		if ( object instanceof THREE.PointCloud ) {
// 			// Not getting into the log here
// 			console.log("I'M ANIMATING THINGS");
// 			if (i == 0) {
// 				object.translateY(-10);
// 			}
// 
// 			if (i > 0) {
// 				if (layer)
// 					object.translateY(-10);
// 				else
// 					if(scene.children[i-1].position.y < ((window.innerHeight * -1) / 2 - 1000))
// 						object.translateY(-10);
// 			}
// 
// 			if ((object.position.y < window.innerHeight * -1 * 5)) {
// 					object.position.y = 500;
// 					object.position.x = 0;
// 					if (i == 0) layer = true;
// 			}
// 		}
// 	}
// 
// 	for (let i = 0; i < materials.length; i++ ) {
// 
// 		color = parameters[i][0];
// 
// 		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
// 		materials[i].color.setHSL( h, color[1], color[2] );
// 
// 	}
// }

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

// function onDocumentTouchEnd() {
// 	console.log('---- onDocumentTouchEnd ----');
// }

function onDocumentTouchStart(event) {
	if(event.touches && event.touches.length === 1) {
		let touch = event.touches[0];
		touchStartX = touch.pageX;
		checkRaycasterCollisions(touch.pageX, touch.pageY);
		if(selectedObjects.length) {
			onDocumentMouseDown(event, true);
			freeze = true;
		}
	} else {
		event.preventDefault();
	}
}

function onDocumentTouchMove(event) {
	if(event.touches && event.touches.length) {
		var delta = touchStartX - event.touches[0].pageX;
		touchStartX = event.touches[0].pageX;
		position.lon += delta;
	}
}

function addSelectedObject(object) {
	selectedObjects = [];
	selectedObjects.push(object);
}

function checkRaycasterCollisions(x, y) {

	var mouse3D = new THREE.Vector3( ( x / window.innerWidth ) * 2 - 1,
									-( y / window.innerHeight ) * 2 + 1,
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
}

// function renderFeatureMesh() {
// 	var feature = $('.feature');

// 	if(feature.find('canvas').length) return;
// 	var scene = new THREE.Scene();
// 	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 	var renderer = new THREE.WebGLRenderer();
// 	renderer.setSize(feature.width(), feature.height());
// 	feature.append(renderer.domElement);

// 	var geometry = new THREE.CubeGeometry(5, 5, 5);
// 	var material = new THREE.MeshLambertMaterial({
// 		color: 0x00fff0
// 	});
// 	var cube = new THREE.Mesh(geometry, material);
// 	scene.add(cube);

// 	camera.position.z = 12;

// 	var pointLight = new THREE.PointLight(0xFFFFFF);

// 	pointLight.position.x = 10;
// 	pointLight.position.y = 50;
// 	pointLight.position.z = 130;

// 	scene.add(pointLight);

// 	var reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

// 	var render = function() {
// 		reqAnimFrame(render);

// 		var delta = Math.random() * (0.06 - 0.02) + 0.02;

// 		cube.rotation.x += delta;
// 		cube.rotation.y += delta;
// 		cube.rotation.z -= delta;

// 		renderer.render(scene, camera);
// 	};

// 	render();
// }


function makeUrlParams(id, subid) {
	let str = '';
	if(id !== undefined || id !== null) {
		str += `?id=${id}`;
	}
	if(!subid) subid = 0;
	str += `&subid=${subid}`;
	return str;
}

function tweenArc(start, end) {
	let relativity;
	let delta = start-end;
	let absDelta = Math.abs(delta);
	if(start < end) {
		relativity = absDelta < 180 ? '+=' : '-=';
	} else {
		relativity = absDelta < 180 ? '-=' : '+=';
	}
	return {value: 360-absDelta < absDelta ? 360-absDelta : absDelta, relativity: relativity};
}

function onDocumentMouseDown(event, isTouch) {
	if(freeze) return;
	isUserInteracting = true;
	mouseStartX = event.clientX;
	if(selectedObjects.length && !showingModal) {
		let so = selectedObjects[0].hotspot;
		let currentLon = position.lon
		let hotspotLon = selectedObjects[0].hotspot.lon
		let data = tweenArc(currentLon, hotspotLon);

		let maxDelta = 40;
		let delta = data.value;
		let maxDura = 550;
		let duration = ((delta/maxDelta)*maxDura)/1000;

		if(isTouch) {
			position.lon = position.lon%360;
			curPosX = position.lon;
			currentHotspot = so
			modal.show(so, 0);
		} else {
			TweenMax.to(position, duration, {lon: `${data.relativity}${data.value}`, onComplete: function() {
				position.lon = position.lon%360;
				curPosX = position.lon;
				currentHotspot = so
				modal.show(so, 0);
			}});
		}
	}
}

function rotateHotspots() {
	hotspots.forEach( hotspot => hotspot.children[0].rotation.z += rotateSpeed * 0.5 );
}

function onDocumentMouseMove(event) {
	if(freeze) return;
	checkRaycasterCollisions(event.clientX, event.clientY);
	if(isUserInteracting && !showingModal) {
		let deltaX = mouseStartX - event.clientX;
		mouseStartX = event.clientX;
		let movementX = 'movementX' in event || 'mozMovementX' in event || 'webkitMovementX' in event ? event.movementX || event.mozMovementX || event.webkitMovementX || 0 : deltaX || 0;
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		curPosX += movementX;
		if(curPosX < 0) {
			curPosX = 360 + curPosX;
		}
		if(curPosX > 360) {
			curPosX = 0;
		}
		position.lon = curPosX;
	}
}

function onDocumentMouseUp( event ) {
	isUserInteracting = false;
	// mouseStartX = 0;
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

	camera.target.x = 1 * Math.sin( phi ) * Math.cos( theta );
	// camera.target.y = 1 * Math.cos( phi );
	camera.target.z = 1 * Math.sin( phi ) * Math.sin( theta );
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

	// evolveSmoke();
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
	
	deviceControls.update()
	
	// deviceControls.connect();
	renderer.render( scene, camera );
	// renderer.render( scene, camera );
	camera.updateProjectionMatrix();
	composer.render();
	// renderer.autoClear = true;
	// renderer.setClearColor( 0xfff0f0 );
	// renderer.setClearAlpha( 0.0 );
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


// function deviceOrientationListener(event) {
// 	let deg2rad = Math.PI / 180;
// 	camera.rotation.set(
//         !event.beta * deg2rad,
//         !event.gamma ? 0 : event.gamma * deg2rad,
//         !event.alpha ? 0 : event.alpha * deg2rad
//     );
// 	
// 	console.log(event.beta * deg2rad)
// 	console.log(event.gamma * deg2rad)
// 	console.log(event.alpha * deg2rad)
// 	
//         // console.log("Do Stuff With Device", event);
//         // ctx.clearRect(0, 0, c.width, c.height);
//         // ctx.fillStyle = "#FF7777";
//         // ctx.font = "14px Verdana";
//         // ctx.fillText("Alpha: " + Math.Round(event.alpha), 10, 20);
//         // ctx.beginPath();
//         // ctx.moveTo(180, 75);
//         // ctx.lineTo(210, 75);
//         // ctx.arc(180, 75, 60, 0, event.alpha * Math.PI / 180);
//         // ctx.fill();
// 		// 
//         // ctx.fillStyle = "#FF6600";
//         // ctx.fillText("Beta: " + Math.round(event.beta), 10, 140);
//         // ctx.beginPath();
//         // ctx.fillRect(180, 150, event.beta, 90);
// 		// 
//         // ctx.fillStyle = "#FF0000";
//         // ctx.fillText("Gamma: " + Math.round(event.gamma), 10, 270);
//         // ctx.beginPath();
//         // ctx.fillRect(90, 340, 180, event.gamma);
// }

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
