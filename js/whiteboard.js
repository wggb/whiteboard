var defaultValues = {
	mode: 'draw',
	color: '#000000',
	width: 10
}

var mode = defaultValues.mode;
var color = defaultValues.color;
var width = defaultValues.width;

var path;

var check = false;

function updateValues() {
	mode = document.getElementById('mode').value;
	color = document.getElementById('color').value;
	width = document.getElementById('width').value;

	if (mode != 'draw' && mode != 'del') {
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

function onMouseDown(event) {
	if (path) {
		path.selected = false;
	}

	updateValues();

	if (mode == 'draw') {
		path = new Path({
			segments: [event.point],
			strokeColor: color,
			strokeWidth: Number(width),
			strokeCap: 'round',
			name: 'test'
			// fullySelected: true
		});
	} else {
		project.activeLayer.selected = false;
	}
}

function onMouseDrag(event) {
	if (mode == 'draw') {
		path.add(event.point);
	} else {
		if (event.item) {
			event.item.remove();
		}
	}
}

function onMouseUp(event) {
	if (mode == 'draw') {
		path.simplify(10);
	}

	// path.fullySelected = true;

	// var personJSONString = JSON.stringify(path);
	// console.log(personJSONString);
}
