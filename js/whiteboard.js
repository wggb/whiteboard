paper.install(window);
window.onload = function() {
	paper.setup('whiteboard');
}
let tool = new Tool();

const defaultValues = {
	mode: 'draw',
	color: '#000000',
	width: 6
}

var whiteboard = {
    mode: defaultValues.mode,
	color: defaultValues.color,
	width: defaultValues.width,
    paths: [],
    path: {
        id: 0,
        current: null,
        selected: null
    },
    click: {
        point: null
    },
    isBusy: false,
	isBusyHotKey: false
}

var events = {
	onMouseDown: [],
	onMouseDrag: [],
	onMouseMove: [],
	onMouseUp: [],
	onKeyDown: [],
	onKeyUp: []
}

function clearWhiteboard() {
    whiteboard.paths.forEach(function(path) {
        path.remove() });
	whiteboard.paths = [];
}

function readValues() {
    whiteboard.mode = $('#mode')[0].value;
	whiteboard.color = $('#color')[0].value;
	whiteboard.width = $('#width')[0].value;

	if (!whiteboard.mode)
        whiteboard.mode = defaultValues.mode;

	try {
		whiteboard.width = Number(whiteboard.width);
		if (whiteboard.width < 1 || isNaN(whiteboard.width)) {
			whiteboard.width = defaultValues.width;
			console.warn('Couldn\'t read width. Using default: '
				+ defaultValues.width.toString());
		}
	} catch (error) {
		whiteboard.width = defaultValues.width;
		console.warn('Couldn\'t read width. Using default: '
			+ defaultValues.width.toString());
	}
}

function setUI() { chooseButton(whiteboard.mode); }

function deletePathFromArray(name) {
    whiteboard.paths.forEach(function(path, index) {
        if (path.name == name)
            whiteboard.paths.splice(index, 1);
    });
}

function loadPaths(text) {
	clearWhiteboard();
	
	try {
		let loadedPaths = JSON.parse(text);
		while (loadedPaths.length > 0)
			whiteboard.paths.push(
                new Path(loadedPaths.shift()[1]));
	} catch (error) {
		alert('Text can\'t be parsed.');
	}
}

function savePaths() {
	$('#save-textarea')[0].value = JSON.stringify(
		whiteboard.paths);
}

function selectActiveLayer(value) {
	project.activeLayer.selected = value;
}

function resetStats() {
	whiteboard.isBusy = false;
    whiteboard.path.current = null;
    whiteboard.click.point = null;
}

tool.onMouseDown = function(event) {
	events.onMouseDown.forEach(function(func) {
		func(event);
	});
}

tool.onMouseDrag = function(event) {
	events.onMouseDrag.forEach(function(func) {
		func(event);
	});
}

tool.onMouseMove = function(event) {
	events.onMouseMove.forEach(function(func) {
		func(event);
	});
}

tool.onMouseUp = function(event) {
	events.onMouseUp.forEach(function(func) {
		func(event);
	});
}

tool.onKeyDown = function(event) {
	events.onKeyDown.forEach(function(func) {
		func(event);
	});
}

tool.onKeyUp = function(event) {
	events.onKeyUp.forEach(function(func) {
		func(event);
	});
}

$(function () {
    chooseButton(defaultValues.mode);
    $('#color')[0].value = defaultValues.color;
    $('#width')[0].value = defaultValues.width;
});
