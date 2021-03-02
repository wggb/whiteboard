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

var isBusy = false;

function clearWhiteboard() {
	for (var i = 0; i < paths.length; i++) {
		paths[i].remove();
	}
	paths = [];
}

function deselectAll() {
	for (var i = 0; i < paths.length; i++) {
		paths[i].selected = false;
	}
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
		alert('Text can\'t be parsed.');
	} catch (error) {
	}
}

function drawSelectRectangle(firstPoint, secondPoint) {
	var rectangle = new Rectangle(firstPoint, secondPoint);
	var path = new Path.Rectangle(rectangle);
	path.fillColor = '#eff9ff40';
	path.selected = true;
	path.removeOnDrag().removeOnUp();
	return path;
}

function selectBox(event) {
	var rect = drawSelectRectangle(clickPoint, event.point);

	for (var i = 0; i < paths.length; i++) {
		var p = paths[i];
		var intersections = rect.getIntersections(p);
		p.selected = (intersections.length > 0);
		if (rect.bounds.contains(p.interiorPoint)) {
			p.selected = true;
		}
	}
}

function onMouseDown(event) {
	deselectAll();
	clickPoint = event.point;

	updateValues();
	
	if (Key.isDown('shift')) {
		// Nothing
	} else {
		isBusy = true;
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
		}
	}
}

function onMouseDrag(event) {
	if (!isBusy && Key.isDown('shift')) {
		selectBox(event);
	} else if (isBusy) {
		if(mode == 'draw') {
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
}

function onMouseUp(event) {
	if (!isBusy && Key.isDown('shift')) {
		// Nothing
	} else if (isBusy) {
		if (mode == 'draw') {
			if(path.segments.length > 5) {
				path.simplify(10);
			}
			paths.push(path);
		}
	}

	isBusy = false;
	clickPoint = null;

	document.getElementById('save-textarea').value = JSON.stringify(paths);
}

tool.onKeyDown = function(event) {
	if (event.key == 'backspace' || event.key == 'delete') {
		for (var i = 0; i < paths.length; i++) {
			if (paths[i].selected) {
				paths[i].remove();
				deletePathFromArray(paths[i]);
			}
		}
        // Prevent the key event from bubbling
        return false;
    }
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

/* 
todo: have array of selected
	  add constructor functions
*/