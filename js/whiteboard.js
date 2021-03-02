var defaultValues = {
	mode: 'draw',
	color: '#000000',
	width: 10
}

var mode = defaultValues.mode;
var color = defaultValues.color;
var width = defaultValues.width;

var paths = [];

var pathId = 0;
var path;

var clickPoint;

function clearWhiteboard() {
	for (var i = 0; i < paths.length; i++) {
		paths[i].remove();
	}
	paths = [];
}

function updateValues() {
	mode = document.getElementById('mode').value;
	color = document.getElementById('color').value;
	width = document.getElementById('width').value;

	if (!mode) {
		mode = defaultValues.mode;
	}

	try {
		width = Number(width);
		if (width < 1 || isNaN(width)) {
			width = defaultValues.width;
		}
	} catch (error) {
		width = defaultValues.width;
	}
}

function deletePathFromArray(name) {
	for (var i = 0; i < paths.length; i++) {
		if (paths[i].name == name) {
			paths.splice(i, 1);
		}
	}
}

function loadPaths(text) {
	clearWhiteboard();
	
	try {
		var loadedPaths = JSON.parse(text);
		while (loadedPaths.length > 0) {
			paths.push(new Path(loadedPaths.shift()[1]));
		}
	} catch (error) {
		alert('Text can\'t be parsed.');
	}
	document.getElementById('save-textarea').value = JSON.stringify(paths);
}

function onMouseDown(event) {
	if (path) {
		path.selected = false;
	}

	updateValues();

	if (mode == 'draw') {
		var pathName = '#' + pathId++;
		path = new Path({
			segments: [event.point],
			strokeColor: color,
			strokeWidth: Number(width),
			strokeCap: 'round',
			name: pathName
			// fullySelected: true
		});
		path.add(event.point);
	} else if (mode == 'del') {
		project.activeLayer.selected = false;
	} else if (mode == 'move') {
		// Select a point
		clickPoint = event.point;
	}
}

function onMouseDrag(event) {
	if (mode == 'draw') {
		path.add(event.point);
	} else if (mode == 'del') {
		if (event.item) {
			deletePathFromArray(event.item.name);
			event.item.remove();
		}
	} else if (mode == 'move') {
		// Find distance between current point and that point
		view.center += clickPoint - event.point;
	}
}

function onMouseUp(event) {
	if (mode == 'draw') {
		if(path.segments.length > 5) {
			path.simplify(10);
		}
		paths.push(path);
	}

	// path.fullySelected = true;

	document.getElementById('save-textarea').value = JSON.stringify(paths);
}

var doneButton = document.getElementById('save-load-done');
doneButton.addEventListener('click', function(e) {
	if (document.getElementById('save-textarea').classList.contains('d-none')) {
		var loadText = document.getElementById('load-textarea').value.trim();
		if (loadText != '') {
			loadPaths(loadText);
		}
		document.getElementById('load-textarea').value = '';
	}
});
