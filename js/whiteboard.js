var defaultValues = {
	mode: 'draw',
	color: '#000000',
	width: 10
}

var time = new Date();
var clickPoint;

var canvas = new Canvas();
var pen = new Pen(defaultValues);
var isBusy = false;

// var events = {
// 	PEN_DOWN : onMouseDown,
// 	PEN_UP : onMouseUp,
// 	ADD_POINT : null
// }

function Canvas() {
	// private variable
	var pathMap = new Map();
	var pathCounter = 0;
	var startTime = Date.now();

	// return all paths
	this.paths = function() {
		return pathMap.values();
	}
	// iterate over values
	this.iterate = function(f) {
		pathMap.forEach(function(v,k) { f(v); });
	};
	// clear whitebaord
	this.clear = function() {
		this.paths().forEach(
			function(path) { path.remove(); }
		);
		pathMap.clear();
	}
	// return path with a specific id
	this.get = function(pathId) {
		return pathMap.get(pathId);
	}
	// remove path 
	this.remove = function(pathId) {
		this.get(pathId).remove();
		pathMap.delete(pathId);
	}
	// get time since start
	this.getTime = function() {
		return Date.now() - startTime;
	}
	// add path
	this.add = function(path) { 
		path.name = pathCounter;
		pathCounter++;
		path.time = this.getTime();
		pathMap.set(id, path);
	}
}

function Pen(values) {
	var path;

	this.setValues = function(mode, color, width) {
		this.mode = mode;
		this.color = color;
		this.width = width;
	}
	this.newPath = function() {
		path = new Path({
			strokeColor: color,
			strokeWidth: width,
			strokeCap: 'round'
		})
		canvas.add(path);
	}
	this.addPoint = function(point) {
		path.add(point);
	}
	this.path = function() {
		return path;
	}

	// initialize
	this.setValues(values.mode, values.color, values.width);
}

function deselectAll() {
	console.log(canvas.paths());
	canvas.iterate(
		function(path) { path.selected = false; }
	);
}

function selectAll() {
	canvas.iterate(
		function(path) { path.selected = false; }
	);
}

function updateValues() {
	var mode = document.getElementById('mode').value;
	var color = document.getElementById('color').value;
	var width = document.getElementById('width').value;

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
	
	pen.setValues(mode, color, width);
}

function loadPaths(text) {
	canvas.clear();
	
	try {
		var loadedPaths = JSON.parse(text);
		while (loadedPaths.length > 0) {
			canvas.add(new Path(loadedPaths.shift()[1]));
		}
		alert('Text can\'t be parsed.');
	} catch (error) { }
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
	canvas.iterate(function(path) {
		path.selected = rect.getIntersections(path).length > 0 || rect.bound.contains(path.interiorPoint)
	});
}

function click(point) {
	clickPoint = point;
}

function onMouseDown(event) {
	deselectAll();
	click(event.point);
	updateValues();
	
	if (Key.isDown('shift')) {
		// Nothing
	} else {
		isBusy = true;
		if (mode == 'draw') {
			pen.newPath();
			pen.addPoint(event.point);
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
			pen.addPoint(event.point);
		} else if (mode == 'del') {
			if (event.item) {
				canvas.remove(event.item.name);
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
			var path = pen.path();
			if(path.segments.length > 5) {
				path.simplify(10);
			}
			canvas.add(path);
		}
	}

	isBusy = false;
	clickPoint = null;

	document.getElementById('save-textarea').value = JSON.stringify(canvas.paths());
}

tool.onKeyDown = function(event) {
	if (event.key == 'backspace' || event.key == 'delete') {
		canvas.iterate(function(path) {
			if (path.selected) {
				canvas.remove(path.name);
			}
		});
        // Prevent the key event from bubbling
        return false;
    }
}

// setting up onDoneButtonClick (for Save/Load)
{
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
}

/* 
todo: have array of selected
	  add constructor functions
*/
