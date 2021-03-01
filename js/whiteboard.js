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

	path = new Path({
		segments: [event.point],
		strokeColor: color,
		strokeWidth: Number(width),
		strokeCap: 'round',
		name: 'test'
		// fullySelected: true
	});
}

function onMouseDrag(event) {
	path.add(event.point);
}

function onMouseUp(event) {
	path.simplify(10);

	// path.fullySelected = true;

	// var personJSONString = JSON.stringify(path);
	// console.log(personJSONString);
}
