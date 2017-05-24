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
var touchStartX = void 0;
var mouseStartX = void 0;

//************************************************************************//
//                             Init Loader                                //
//************************************************************************//

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
		title: 'Bladed Spear de Bilboa',
		image: 'textures/weapons/bladed-spear-de-bilboa.png',
		key: 'bladed-spear-de-bilboa',
		description: 'this bladed spear is sure to keep enemies at bay. with a heavy ash base and a finely hewn blade forged by bilboan craftsmen, in the hands of an assassin this weapon can defeat an entire batallion of templar enemies.'
	}, {
		title: 'Assassin\'s Hidden Blade',
		image: 'textures/weapons/assassins-hidden-blade.png',
		key: 'assassins-hidden-blade',
		description: 'this simple leather vambrace as an essential piece of every assassin’s outfit. the blade-concealing armor both proects from attacks and gives the assassin access to a deadly hidden blade with a simple flick of the wrist.'
	}],
	lon: 19,
	position: [450, 0, 150]
}, {
	id: 1,
	lon: 39,
	slides: [{
		title: 'Córdoban Halberd',
		image: 'textures/weapons/cordoban-halberd.png',
		key: 'cordoban-halberd',
		description: 'the córdoban halberd combines the intricate artistrty of the monarchy with the unparalleled killing power of the inquisition. featuring tempered steel and ornate gold gilding in the staff, this weapon is both beautiful and deadly.'
	}],
	position: [370, 0, 280]
}, {
	id: 2,
	lon: 87.5,
	slides: [{
		title: 'Legendary Prowler Hood',
		image: 'textures/weapons/legendary-prowler-hood.png',
		key: 'legendary-prowler-hood',
		description: 'if you’re talking stealth look no further than the legendary prowler hood. this stylish-but-effecient garb features discreet pockets for hidden blades and gives any assassin the ability to disappear into a crowd at a moment’s notice.'
	}, {
		title: 'Assassin\'s Hidden Blade with Grappling Hook',
		image: 'textures/weapons/assassins-hidden-blade-with.png',
		key: 'assassins-hidden-blade-with',
		description: 'these leather killing machines hide a deadly blade on the right wrist and a powerful propulsive grappling hook on the left, creating a gauntlet of pain and dexterity unsurprassed throughout the kingdom.'
	}],
	position: [25, 0, 400]
}, {
	id: 3,
	lon: 106,
	slides: [{
		title: 'Shadow Brigadine',
		image: 'textures/weapons/shadow-brigandine.png',
		key: 'shadow-brigandine',
		description: 'this obsidian chainmail armor gives any assassin the ability to bleed into the shadows undetected, all the better to stalk and eliminate their templar prey.'
	}, {
		title: 'Blade de Barcelona',
		image: 'textures/weapons/blade-de-barcelona.png',
		key: 'blade-de-barcelona',
		description: 'this curved blade was created by the greatest assassin craftsmen of barcelona to withstand blows from the strongest of weaponry. it’s unqiue curved design is designed to deflect direct blows from swords, spears and sabres.'
	}, {
		title: 'Long Sword de Don Quixote',
		image: 'textures/weapons/long-sword-de-don-quixote.png',
		key: 'long-sword-de-don-quixote',
		description: 'this long sword, rumored to be owned by the legendary warrior don quixote, features tempered steel and a gold-infused hilt. just don’t try to fight a windmill with it. things probably won’t work out the way you want them to.'
	}],
	position: [-115, 0, 400]
}, {
	id: 4,
	lon: 153,
	slides: [{
		title: 'Bow de silencio',
		image: 'textures/weapons/bow-de-silencio-revised.png',
		key: 'bow-de-silencio',
		description: 'your enemy will hear naught but the wind rustling through the trees as you release the string on this silent but deadly longbow. using arrows forged from strong spanish oak, this stealth weapon is a key in every assassin’s arsenal.'
	}, {
		title: 'Piece of Eden',
		image: 'textures/weapons/piece-of-eden.png',
		key: 'piece-of-eden',
		description: 'this mysterious orb is rumored by many to unlock the mysteries of mind control, allowing the owner to manipulate freedom of thought. so if you’ve ever felt like an assassin was reading your mind, odds are you’re probably right.'
	}],
	position: [-400, 0, 205]
}, {
	id: 5,
	lon: 175,
	slides: [{
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
	}],
	position: [-445, 0, 30]
}, {
	id: 6,
	lon: 236,
	slides: [{
		title: 'Smoke Bombs',
		image: 'textures/weapons/smoke-bombs.png',
		key: 'smoke-bombs',
		description: 'used for both attack and escape, these pouch bombs use a combination of gunpowder, sulfur, and secret alchemy to create a variety of effects, from explosions to smoke screens. perfect for destraction...or destruction.'
	}, {
		title: 'Pistola de Pyreness',
		image: 'textures/weapons/pistola-de-pyrenees.png',
		key: 'pistola-de-pyrenees',
		description: 'this pistola is an exclellent choice when stealth is no longer an option. perfect for disorienting groups of enemies or eliminating a lone inquisitor, this weapon is essential for every assassin in the field (or the mountains).'
	}
	],
	position: [-265, 0, -380]
}, {
	id: 7,
	lon: 262.5,
	slides: [{
		title: 'Elche de Ballesta',
		image: 'textures/weapons/elche-de-ballesta.png',
		key: 'elche-de-ballesta',
		description: 'this powerful crossbow fires tungsten bolts at a velocity unmatched in ancient times, providing assassins with a silent option for long-range attacks.'
	}],
	position: [-60, 0, -455]
}, {
	id: 8,
	lon: 286.5,
	slides: [{
		title: 'Inquisitors Shield',
		image: 'textures/weapons/inquisitors-shield.png',
		key: 'inquisitors-shield',
		description: 'this standard bronze shield “borrowed” from the spanish inquisition gives assassin’s a powerful defensive tool for use in seige, or a valuable prop when infiltrating a spanish dungeon.'
	}, {
		title: 'Armada Bow',
		image: 'textures/weapons/armada-bow.png',
		key: 'armada-bow',
		description: 'this powerful longbow favored by spanish seamen provides hightened accuracy and increased distance for maximum killing power. if that’s a thing you’re looking for.'
	}],
	position: [125, 0, -455]
}, {
	id: 9,
	lon: 332,
	slides: [{
		title: 'Blade of the Assassin',
		image: 'textures/weapons/blades-of-the-assassin.png',
		key: 'blades-of-the-assassin',
		description: 'whether leaping from a ledge or silently stalking a victim through a crowded marketplace, an assassin is only as good as his blades. featuring a variety of shapes and sizes customizable to its owner, no self-respecting assassin would be caught dead without one of these handy weapons.'
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
var showingModal = false;
var initialOrientation = void 0;
var isUserInteracting = false;
var freeze = void 0;
var projector = new THREE.Projector();
var mouseVector = new THREE.Vector3();
var currentHotspot = void 0;
var touchDevice = void 0;
if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
	touchDevice = true;
}

var showLoader = true;
var playAudio = true;
var splashButton = void 0;
var audio = void 0;
var progressBar = $('.progress');
var numAnim = new CountUp(percent, 0, 0, 0, 0.5, { suffix: '%' });
var filesLoaded = 0;
var totalFiles = 0;


function loadTick() {
	var percent = filesLoaded / totalFiles * 100;
	numAnim.update(percent);
	progressBar.css('width', percent + '%');
	if (percent === 100) {
		(function () {
			var button = $('.splash .button');
			TweenMax.to($('.info'), 550 / 1000, { autoAlpha: 0 });
			TweenMax.to(button, 550 / 1000, { autoAlpha: 1, delay: 600 / 1000, onComplete: function onComplete() {
					button.on('mouseenter', function () {
						splashButton.animate(1);
						playSound('rollover');
					});
					button.on('mouseleave', function () {
						splashButton.set(0);
					});
				}
			});
			button.on('touchstart', function () {
				audioFiles.bgAudio.play();
			});
			button.on('click', function () {
				TweenMax.to($('#preloader'), 750 / 1000, { delay: 550 / 1000, autoAlpha: 0, onComplete: function onComplete() {
						audioFiles.bgAudio.play();
					} });
			});
		})();
	}
}

function createAudioSource(file) {
	totalFiles += 1;
	var audio = new Audio();
	audio.addEventListener('canplaythrough', function () {
		filesLoaded += 1;
		loadTick();
	}, false);
	audio.addEventListener('error', function () {
		filesLoaded += 1;
		loadTick();
	}, false);
	Object.keys(file).forEach(function (key) {
		audio[key] = file[key];
	});
	audio.load();
	return audio;
}

function preloadImages() {
	var slides = hotspotObjects.map(function (hotspotObject) {
		return hotspotObject.slides;
	}).reduce(function (prev, current) {
		return prev.concat(current);
	});
	totalFiles += slides.length;
	slides.forEach(function (slide) {
		var image = new Image();
		image.onload = function () {
			filesLoaded += 1;
			loadTick();
		};
		image.src = slide.image;
	});
}

function preloadAudioFiles(files) {
	console.log(audioFiles);
	var obj = {};
	Object.keys(files).forEach(function (key) {
		obj[key] = createAudioSource(files[key]);
	});
	return obj;
}

var audioFiles = {
	bgAudio: {
		src: 'audio/bg-music.mp3',
		volume: 0.5,
		loop: true
	},
	close: {
		src: 'audio/close.mp3'
	},
	open: {
		src: 'audio/open.mp3'
	},
	rollover: {
		src: 'audio/rollover.wav'
	}
};

if (showLoader) {
	preloadImages();
	audioFiles = preloadAudioFiles(audioFiles);
	THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
		if (loaded === 1) totalFiles += total;
		filesLoaded += 1;
		loadTick();
	};
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
		playSound('rollover');
		var key = $(this).attr('key');
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
	this.controls = this.modal.find('.controls');
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
			playSound('rollover');
			_this2.next();
		});

		this.prevButton.on('click', function () {
			playSound('rollover');
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
		var slide = this.hotspot.slides[this.offset];
		var href = '' + siteConfig.siteURL + makeUrlParams(this.hotspot.id, this.offset);
		var picture = '' + siteConfig.siteURL + slide.image;
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
		this.modal.attr('class', 'modal ' + hotspot.key + ' open');
	},
	hide: function hide() {
		freeze = false;
		this.modal.attr('class', 'modal');
		for (var i in buttons) {
			buttons[i].set(0);
		}
		var duration = 550 / 1000;
		showingModal = false;
		this.controls.hide();
		// pointerLock();
		playSound('close');
		TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 0, onComplete: function () {
				this.modal.removeClass('open');
			}.bind(this)
		});
		TweenMax.to(camera, duration, { fov: fovMin, onComplete: function onComplete() {
				blocked = false;
			} });
		$(document).off('keydown');
		outlinePass.selectedObjects = [];
	},
	show: function show(hotspot, subid) {
		var _this5 = this;

		this.hotspot = hotspot;
		this.subid = subid;
		this.offset = 0;
		// let urlParams = makeUrlParams(hotspot.id);
		var duration = 550 / 1000;
		showingModal = true;
		$('body').removeClass('hot');
		if (hotspot.slides && hotspot.slides.length > 0) {
			if (hotspot.slides.length > 1) this.controls.fadeIn();
			this.activeSlide = hotspot.slides[this.offset];
			this.setModalValues(this.activeSlide);
		}
		TweenMax.to($('.modal-container'), 0.3, { autoAlpha: 1 });
		setTimeout(function () {
			playSound('open');
			_this5.modal.addClass('open');
		}, 200);
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

$(document).ready(function () {

	$(window).blur(function () {
		audioFiles.bgAudio.pause();
	});

	$(window).focus(function () {
		if (playAudio) audioFiles.bgAudio.play();
	});

	splashButton = new ProgressBar.Path($('.splash .outer-path').get(0), {
		easing: 'easeInOut',
		duration: 500
	});

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
		buttons[key].animate(1);
	});

	$('.button-outer').on('mouseleave', function (event) {
		var key = $(event.currentTarget).attr('key');
		buttons[key].set(0);
	});

	$('.button-outer').on('click', function (event) {
		var key = $(event.currentTarget).attr('key');
		handleButtonClick(key);
	});

	var offLine = $('.sound line');
	var container = offLine.parents('svg');
	$('.sound').on('click', function () {
		if (playAudio) {
			audioFiles.bgAudio.pause();
			offLine.show();
			container.attr('class', 'off');
		} else {
			audioFiles.bgAudio.play();
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
	renderer = new THREE.WebGLRenderer({ antialias: false });
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
	renderer.setClearColor(0xa0a0a0);
	renderer.setPixelRatio(1);
	renderer.setSize(width, height);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
	camera.target = new THREE.Vector3(0, 0, 0);
	scene = new THREE.Scene();

	var geometry = new THREE.SphereGeometry(500, 60, 400);
	geometry.scale(-1, 1, 1);

	var material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/AnimusPanorama_v4.jpg'),
		fog: true
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'scene';
	scene.add(mesh);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 5);
	hemiLight.position.set(0, 200, 0);
	scene.add(hemiLight);

	// Build items for raycaster clicks
	buildHotspots();

	// Device Orientation Stuff
	deviceControls = new DeviceOrientationController(camera, renderer.domElement);
	deviceControls.connect();
	setupControllerEventHandlers(deviceControls);

	clock = new THREE.Clock();

	// postprocessing
	composer = new THREE.EffectComposer(renderer);
	renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);
	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

	outlinePass.edgeStrength = 0.5;
	outlinePass.edgeGlow = 1.0;
	outlinePass.edgeThickness = 1.0;
	outlinePass.pulsePeriod = 0.1;
	outlinePass.visibleEdgeColor = { r: 255, g: 255, b: 255 };

	composer.addPass(outlinePass);
	var onLoad = function onLoad(texture) {
		outlinePass.patternTexture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	};
	var lod = new THREE.TextureLoader();
	lod.load(
	'textures/tri_pattern.jpg',
	onLoad);

	effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
	effectFXAA.renderToScreen = true;
	composer.addPass(effectFXAA);

	container.appendChild(renderer.domElement);

	// @todo: event aliasing
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);

	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);
	
	window.addEventListener('resize', onWindowResize, false);

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
	'ig-header': function igHeader() {
		console.log('igHeader');
	},
	fb: function fb() {
		// modal.share('fb');
	}
};
function handleButtonClick(key) {
	if (key in buttonClicks) buttonClicks[key]();
}

function buildHotspots() {
	loader = new THREE.JSONLoader();
	loader.load('js/new-ac-logo-e3.js', function (geometry) {
		hotspots = hotspotObjects.map(function (hotspotObject, index) {
			geometry.center();

			var scale = 5;
			var newMat = new THREE.MeshPhongMaterial({
				color: 0xFFFFFF,
				specular: 0x000000,
				shininess: 1000
			});

			var oldMat = new THREE.MeshBasicMaterial({ color: '#cccccc', opacity: 1 });

			var hotspot = new THREE.Mesh(geometry, newMat);
			hotspot.name = 'hotspot-' + index;
			var box = new THREE.Box3().setFromObject(hotspot);
			hotspot.scale.x = hotspot.scale.y = hotspot.scale.z = scale;
			hotspot.rotation.x = .5 * Math.PI;
			hotspot.hotspot = hotspotObject;

			var hitboxGeo = new THREE.BoxBufferGeometry(box.getSize().x * scale * 1.2, box.getSize().x * scale * 1.2, box.getSize().x * scale * 1.2);
			var hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
			{
				wireframe: true;
			}
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
	if (event.touches && event.touches.length === 1) {
		var touch = event.touches[0];
		touchStartX = touch.pageX;
		checkRaycasterCollisions(touch.pageX, touch.pageY);
		if (selectedObjects.length) {
			onDocumentMouseDown(event, true);
			freeze = true;
		}
	} else {
		event.preventDefault();
	}
}

function onDocumentTouchMove(event) {
	if (event.touches && event.touches.length) {
		var delta = touchStartX - event.touches[0].pageX;
		touchStartX = event.touches[0].pageX;
		position.lon += delta;
	}
}

function addSelectedObject(object) {
	selectedObjects = [];
	selectedObjects.push(object);
}

function playSound(key) {
	if (!playAudio) return;
	var sound = audioFiles[key].cloneNode();
	sound.play();
}

function checkRaycasterCollisions(x, y) {

	window.event.clientY - window.scrollTop;

	var mouse3D = new THREE.Vector3(x / window.innerWidth * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
	raycaster.setFromCamera(mouse3D, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	var items = intersects.filter(function (intersect) {
		return intersect.object.name.match(/hitbox/);
	});
	
	if (items.length) {
		items.forEach(function (item) {
			var target = item.object.parent.children[0];
			if (selectedObjects.indexOf(target) === -1) {
				// $('body').addClass('hot');
				addSelectedObject(target);
				playSound('rollover');
			}
		});
	} else {
		selectedObjects = [];
	}
	outlinePass.selectedObjects = selectedObjects;
}

function makeUrlParams(id, subid) {
	var str = '';
	if (id !== undefined || id !== null) {
		str += '?id=' + id;
	}
	if (!subid) subid = 0;
	str += '&subid=' + subid;
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

function onDocumentMouseDown(event, isTouch) {
	if (freeze) return;
	isUserInteracting = true;
	mouseStartX = event.clientX;
	if (selectedObjects.length && !showingModal) {
		(function () {
			var so = selectedObjects[0].hotspot;
			var currentLon = position.lon;
			var hotspotLon = selectedObjects[0].hotspot.lon;
			var data = tweenArc(currentLon, hotspotLon);

			var maxDelta = 40;
			var delta = data.value;
			var maxDura = 550;
			var duration = delta / maxDelta * maxDura / 1000;

			if (isTouch) {
				position.lon = position.lon % 360;
				curPosX = position.lon;
				currentHotspot = so;
				modal.show(so, 0);
			} else {
				TweenMax.to(position, duration, { lon: '' + data.relativity + data.value, onComplete: function onComplete() {
						position.lon = position.lon % 360;
						curPosX = position.lon;
						currentHotspot = so;
						modal.show(so, 0);
					} });
			}
		})();
	}
}

function rotateHotspots() {
	hotspots.forEach(function (hotspot) {
		return hotspot.children[0].rotation.z += rotateSpeed * 0.5;
	});
}

function onDocumentMouseMove(event) {
	if (freeze || showingModal) return;
	checkRaycasterCollisions(event.clientX, event.clientY);
	if (isUserInteracting && !showingModal) {
		var deltaX = mouseStartX - event.clientX;
		mouseStartX = event.clientX;
		var movementX = 'movementX' in event || 'mozMovementX' in event || 'webkitMovementX' in event ? event.movementX || event.mozMovementX || event.webkitMovementX || 0 : deltaX || 0;
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
	// mouseStartX = 0;
}

// Zoom in & out | Need to limit this to the starting point and a endind point
function onDocumentMouseWheel(event) {
	if (camera.fov > 75) {
		camera.fov = 75;
	} else {
		camera.fov += event.deltaY * 0.02;
		camera.updateProjectionMatrix();
	}

}

function animate() {
	requestAnimationFrame(animate);
	update();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
	if (initialOrientation) {
		position.lon = initialOrientation;
		initialOrientation = null;
	}

	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(position.lon);

	camera.target.x = 1 * Math.sin(phi) * Math.cos(theta);
	camera.target.z = 1 * Math.sin(phi) * Math.sin(theta);
	camera.lookAt(camera.target);
	delta = clock.getDelta();
	rotateHotspots();

	theta += 0.1;
	deviceControls.update();
	renderer.render(scene, camera);
	camera.updateProjectionMatrix();
	composer.render();
}

TweenLite.ticker.addEventListener("tick", render);
// 	stats.domElement.style.left = '0px';
// 	stats.domElement.style.top = '0px';
// 	stats.domElement.style.zIndex = 100;
// 	container.appendChild(stats.domElement);
// 	return stats;
// }


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
