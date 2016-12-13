'use strict';

var siteConfig = {
	siteURL: 'http://numinoustechnologies.com/animus/',
	shareText: 'Welcome to the Animus. Enter the 360º experience and discover the weapons and armor of the Assassins and Templars.',
	siteTweet: 'Welcome to the Animus. Enter the 360º experience and discover the weapons and armor of the Assassins and Templars. #AssassinsCreed [URL]',
	assetShare: 'I entered the 360º Animus and discovered the [Object Name], an ancient artifact of Assassins\' lore. Enter the Animus now to uncover ancient Assassins and Templar relics.',
	assetTweet: 'I entered the 360º Animus and discovered the [Object Name].'
};

var position = {
	lon: 30
};
var curPosX = 30;
var fovMin = 75;
var fovMax = 50;
var onPointerDownPointerX = void 0;
var onPointerDownLon = void 0;
var blocked = false;

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

// let audio = document.createElement('audio');
// let source = document.createElement('source');
// source.src = 'audio/AC-Trailer.mp3';
// audio.appendChild(source);
// audio.play();

function Modal(hotspot) {
	var _this = this;

	this.modal = $('.modal');
	this.item = this.modal.find('.item');
	this.content = this.modal.find('.content');
	this.description = this.modal.find('.description');
	this.title = this.modal.find('.title');
	this.facebookShare = this.modal.find('.button-outer.fb');
	this.twitterShare = this.modal.find('.button-outer.twitter');
	this.nextButton = this.modal.find('.next');
	this.prevButton = this.modal.find('.prev');
	$('.modal-container .close').on('click', function () {
		_this.hide();
	});
	$('.overlay').on('click', this.hide);
	this.bindEvents();
}

Modal.prototype = {
	bindEvents: function bindEvents() {
		var _this2 = this;

		this.nextButton.on('click', function () {
			_this2.next();
		});

		this.prevButton.on('click', function () {
			_this2.prev();
		});
		this.facebookShare.on('click', function () {
			_this2.shareFacebook();
		});
		this.twitterShare.on('click', function () {
			_this2.shareTwitter();
		});
	},
	prev: function prev() {
		var _this3 = this;

		var content = this.content;
		var duration = this.duration;
		TweenMax.to(content, duration, { autoAlpha: 0, onComplete: function onComplete() {
				_this3.offset = _this3.offset === 0 ? _this3.hotspot.slides.length - 1 : _this3.offset - 1;
				_this3.setModalValues(_this3.hotspot.slides[_this3.offset]);
				TweenMax.to(content, duration, { autoAlpha: 1 });
			} });
	},
	next: function next() {
		var _this4 = this;

		var content = this.content;
		var duration = this.duration;
		TweenMax.to(content, duration, { autoAlpha: 0, onComplete: function onComplete() {
				_this4.offset = _this4.offset + 1 === _this4.hotspot.slides.length ? 0 : _this4.offset + 1;
				_this4.setModalValues(_this4.hotspot.slides[_this4.offset]);
				TweenMax.to(content, duration, { autoAlpha: 1 });
			} });
	},

	// share: {
	shareFacebook: function shareFacebook() {
		console.log(this, this.hotspot, this.offset);
		var slide = this.hotspot.slides[this.offset];
		var href = '' + siteConfig.siteURL + makeUrlParams(this.hotspot.id, this.offset);
		var picture = '' + siteConfig.siteURL + slide.image;
		console.log('p', picture);
		console.log('href', href);
		FB.ui({
			method: 'share',
			href: href,
			title: slide.title,
			picture: picture,
			// caption: 'your_caption',
			description: siteConfig.assetShare.replace('[Object Name]', slide.title)
		}, function (response) {
			// your code to manage the response
		});
	},
	shareTwitter: function shareTwitter() {

		var params = encodeURIComponent(makeUrlParams(this.hotspot.id, this.offset));
		var url = '' + siteConfig.siteURL + params;
		var slide = this.hotspot.slides[this.offset];
		var text = siteConfig.assetTweet.replace('[Object Name]', slide.title);
		// .replace('[URL]', `${url}${params}`);
		var hashtags = 'AssassinsCreed';
		window.open('http://twitter.com/intent/tweet?url=' + url + '&text=' + text + '&hashtags=' + hashtags);
	},

	// },
	duration: 0.35,
	offset: 0,
	setModalValues: function setModalValues(hotspot) {
		this.description.text(hotspot.description);
		this.title.text(hotspot.title);
		this.item.attr('src', hotspot.image);
		this.modal.attr('class', 'modal ' + hotspot.key);
	},
	showSliderControls: function showSliderControls() {
		$('.modal .controls').fadeIn();
	},
	hide: function hide() {
		this.modal.attr('class', 'modal');
		for (var i in buttons) {
			buttons[i].set(0);
		}
		var duration = 550 / 1000;
		showingModal = false;
		// pointerLock();
		TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 0 });
		TweenMax.to(camera, duration, { fov: fovMin, onComplete: function onComplete() {
				blocked = false;
			} });
		$(document).off('keydown');
	},
	show: function show(hotspot, subid) {
		this.hotspot = hotspot;
		this.subid = subid;
		this.offset = 0;
		// let urlParams = makeUrlParams(hotspot.id);
		// history.replaceState(null, null, urlParams);
		var duration = 550 / 1000;
		showingModal = true;
		if (hotspot.slides && hotspot.slides.length > 0) {
			this.showSliderControls();
			this.activeSlide = hotspot.slides[this.offset];
			this.setModalValues(this.activeSlide);
		}
		TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 1 });
		TweenMax.to(camera, duration, { fov: fovMax, onComplete: function onComplete() {
				$('.modal-container').css({ top: 0 });
				$(document).on('keydown', function (event) {
					if (event.keyCode === 27) {
						modal.hide();
					}
				});
			} });
	}
};
var modal = new Modal();
modal.bindEvents();

var audio = new Audio('audio/AC-Trailer.mp3');
// audio.play();

var playAudio = true;

// herp derp

$(document).ready(function () {

	$('.button-outer').each(function (index, el) {
		var $el = $(el);
		var key = $el.attr('key');
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

	$('.button-outer').on('click', function (event) {
		var key = $(event.currentTarget).attr('key');
		handleButtonClick(key);
	});

	var offLine = $('.sound line');
	var container = offLine.parents('svg');
	$('.sound').on('click', function () {
		if (playAudio) {
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

var camera = void 0,
    container = void 0,
    color = void 0,
    controls = void 0,
    clock = void 0,
    delta = void 0,
    deviceControls = void 0,
    h = void 0,
    hotspot = void 0,
    info = void 0,
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
    scene = void 0,
    size = void 0,
    smokeParticles = [],
    spotLight = void 0,
    spotLightHelper = void 0,
    sprite = void 0,
    stats = void 0;
var layer = false;
var hsParticles = [];
var rotateSpeed = 0.03;
var hotspots = [];
var hotspotObjects = [{
	id: 0,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png',
		key: 'bladed-spear'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png',
		key: 'vambrace'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png',
		key: 'halberd'
	}],
	lon: 19,
	position: [450, 0, 150]
}, {
	id: 1,
	lon: 39,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [370, 0, 280]
}, {
	id: 2,
	lon: 87.5,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [25, 0, 400]
}, {
	id: 3,
	lon: 106,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [-115, 0, 400]
}, {
	id: 4,
	lon: 153,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [-400, 0, 205]
}, {
	id: 5,
	lon: 175,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [-445, 0, 30]
}, {
	id: 6,
	lon: 236,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [-265, 0, -380]
}, {
	id: 7,
	lon: 262.5,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [-60, 0, -455]
}, {
	id: 8,
	lon: 286.5,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [125, 0, -455]
}, {
	id: 9,
	lon: 332,
	slides: [{
		title: 'BLADED SPEAR de BILBOA',
		description: 'This bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.',
		image: 'textures/bladed-spear.png'
	}, {
		title: 'LEATHER ASSASSIN VAMBRACE',
		description: 'the leather vambrace as an essential piece of every assassin’s armor. this blade- concealing armor both proects from attacks and gives the assassin access to a hidden blade with a simple flick of the wrist.',
		image: 'textures/vambrace.png'
	}, {
		title: 'CóRDOBAN HALBERD',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.',
		image: 'textures/halberd.png'
	}],
	position: [400, 0, -205]
}];
var onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

container = document.getElementById('container');

var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;

var selectedObjects = [];
var loader = void 0;
var renderPass = void 0;
var outlinePass = void 0;
var composer = void 0;
var effectFXAA = void 0;
// let controlsEnabled = true;
var showingModal = false;
var initialOrientation = void 0;
var isUserInteracting = false;

var projector = new THREE.Projector();
var mouseVector = new THREE.Vector3();

var currentHotspot = void 0;

var touchDevice = void 0;
if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
	touchDevice = true;
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
		map: new THREE.TextureLoader().load('textures/AnimusPanorama_V2.jpg'),
		fog: true
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'scene';
	scene.add(mesh);

	stats = initStats();

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


	clock = new THREE.Clock();

	// postprocessing
	composer = new THREE.EffectComposer(renderer);
	renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);
	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

	outlinePass.edgeStrength = 0.5;
	outlinePass.edgeGlow = 5.0;
	outlinePass.edgeThickness = 1.0;
	outlinePass.pulsePeriod = 0.5;
	outlinePass.visibleEdgeColor = { r: 255, g: 255, b: 255 };

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
	// container.addEventListener("mousemove", getPosition, false);


	// @todo: event aliasing
	// document.addEventListener(touchDevice ? 'touchstart' : 'mousedown', onDocumentMouseDown, false );
	// document.addEventListener(touchDevice ? 'touchmove' : 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener(touchDevice ? 'touchend' : 'mouseup', onDocumentMouseUp, false );

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);

	document.addEventListener('touchstart', onDocumentTouchStart, false);
	// document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	window.addEventListener('resize', onWindowResize, false);

	initRain();
	// buildSmoke();
	orientCamera();

	document.body.appendChild(renderer.domElement);
}

function getUrlParams() {
	var urlParams,
	    match,
	    pl = /\+/g,
	    // Regex for replacing addition symbol with a space
	search = /([^&=]+)=?([^&]*)/g,
	    decode = function decode(s) {
		return decodeURIComponent(s.replace(pl, " "));
	},
	    query = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query)) {
		urlParams[decode(match[1])] = decode(match[2]);
	}return urlParams;
}

function orientCamera() {
	var urlParams = getUrlParams();
	if (urlParams.id) {
		(function () {
			var id = parseInt(urlParams.id);
			var hotspot = hotspotObjects.filter(function (hotspot) {
				return id === hotspot.id;
			});
			if (hotspot) {
				hotspot = hotspot[0];
				initialOrientation = hotspot.lon;
				currentHotspot = hotspot;
				modal.show(hotspot);
			}
		})();
	}
}

var buttonClicks = {
	// 'ig-header'() {
	// 	console.log('igHeader');
	// },
	// fb() {
	// 	// modal.share('fb');
	// }
};
function handleButtonClick(key) {
	if (key in buttonClicks) buttonClicks[key]();
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('js/ac-badge-big.js', function (geometry) {
		// loader.load('js/ac-badge.js', function(geometry) {
		// loader.load('js/ac-logo.js', function(geometry) {
		hotspots = hotspotObjects.map(function (hotspotObject, index) {
			geometry.center();

			// previous ac-logo.js scale
			// let scale = 10;

			var scale = 45;

			// let newMat = new THREE.MeshPhongMaterial( { 
			// 	color: 0x996633, 
			// 	specular: 0x050505,
			// 	shininess: 100
			// } ) 

			var oldMat = new THREE.MeshBasicMaterial({ color: '#cccccc', opacity: 1 });

			var hotspot = new THREE.Mesh(geometry, oldMat);
			hotspot.name = 'hotspot-' + index;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale;
			hotspot.rotation.x = .5 * Math.PI;
			hotspot.hotspot = hotspotObject;

			var hitboxGeo = new THREE.BoxBufferGeometry(box.getSize().x * scale * 1.2, box.getSize().x * scale * 1.2, box.getSize().x * scale * 1.2);
			var hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
			// {wireframe: true}
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
	selectedObjects = [];
	selectedObjects.push(object);
}

function checkRaycasterCollisions(event) {

	var mouse3D = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
	raycaster.setFromCamera(mouse3D, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	var items = intersects.filter(function (intersect) {
		return intersect.object.name.match(/hitbox/);
	});
	if (items.length) {
		items.forEach(function (item) {
			var target = item.object.parent.children[0];
			if (selectedObjects.indexOf(target) === -1) {
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
	var str = '';
	if (id !== undefined || id !== null) {
		str += '?id=' + id;
	}
	if (!subid) subid = 0;
	str += '&subid=' + subid;
	console.log('makeUrlParams', id, subid, str);
	return str;
}

function tweenArc(start, end) {
	var relativity = void 0;
	var delta = start - end;
	var absDelta = Math.abs(delta);
	if (start < end) {
		relativity = absDelta < 180 ? '+=' : '-=';
	} else {
		relativity = absDelta < 180 ? '-=' : '+=';
	}
	return { value: 360 - absDelta < absDelta ? 360 - absDelta : absDelta, relativity: relativity };
}

function onDocumentMouseDown(event) {
	isUserInteracting = true;
	if (selectedObjects.length && !showingModal) {
		(function () {
			var so = selectedObjects[0].hotspot;
			var currentLon = position.lon;
			var hotspotLon = selectedObjects[0].hotspot.lon;
			var data = tweenArc(currentLon, hotspotLon);
			TweenMax.to(position, 550 / 1000, { lon: '' + data.relativity + data.value, onComplete: function onComplete() {
					position.lon = position.lon % 360;
					curPosX = position.lon;
					currentHotspot = so;
					modal.show(so, 0);
				} });
		})();
	}
}

function rotateHotspots() {
	hotspots.forEach(function (hotspot) {
		return hotspot.children[0].rotation.z += rotateSpeed * 0.5;
	});
}

function onDocumentMouseMove(event) {
	checkRaycasterCollisions(event);
	if (isUserInteracting && !showingModal) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		curPosX += movementX;
		if (curPosX < 0) {
			curPosX = 360 + curPosX;
		}
		if (curPosX > 360) {
			curPosX = 0;
		}
		position.lon = curPosX;
	}
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
	// console.log('initialOrientation', lon, initialOrientation)
	// console.log('update', lon)
	if (initialOrientation) {
		position.lon = initialOrientation;
		initialOrientation = null;
	}

	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(position.lon);

	camera.target.x = 1 * Math.sin(phi) * Math.cos(theta);
	// camera.target.y = 1 * Math.cos( phi );
	camera.target.z = 1 * Math.sin(phi) * Math.sin(theta);
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
	renderer.render(scene, camera);
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
function setupControllerEventHandlers(controls) {

	var controllerEl = document.querySelector('#controllername');
	var controllerDefaultText = controllerEl.textContent;
	var controllerSelectorEl = document.querySelector('#controllertype');
	var compassCalibrationPopupEl = document.querySelector('#calibrate-compass-popup');

	// Listen for manual interaction (zoom OR rotate)	
	controls.addEventListener('userinteractionstart', function () {
		renderer.domElement.style.cursor = 'move';
		controllerSelectorEl.style.display = 'none';
	});

	controls.addEventListener('userinteractionend', function () {
		renderer.domElement.style.cursor = 'default';
		controllerSelectorEl.style.display = 'inline-block';
	});

	// Listen for manual rotate interaction	
	controls.addEventListener('rotatestart', function () {
		controllerEl.innerText = 'Manual Rotate';
	});

	controls.addEventListener('rotateend', function () {
		controllerEl.innerText = controllerDefaultText;
	});

	// Listen for manual zoom interaction
	controls.addEventListener('zoomstart', function () {
		controllerEl.innerText = 'Manual Zoom';
	});

	controls.addEventListener('zoomend', function () {
		controllerEl.innerText = controllerDefaultText;
	});

	// Allow advanced switching between 'Quaternions' and 'Rotation Matrix' calculations
	controllerSelectorEl.addEventListener('click', function (event) {
		event.preventDefault();

		if (controls.useQuaternions === true) {
			controllerSelectorEl.textContent = 'Rotation Matrix';
			controls.useQuaternions = false;
		} else {
			controllerSelectorEl.textContent = 'Quaternions';
			controls.useQuaternions = true;
		}
	}, false);
}
//# sourceMappingURL=app.js.map
