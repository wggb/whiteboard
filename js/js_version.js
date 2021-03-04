// add global paperjs variables to the scope 
paper.install(window);

/* sample 

window.onload = function() {
	paper.setup('whiteboard');
	// Create a simple drawing tool:
	var tool = new Tool();
	var path;

	// Define a mousedown and mousedrag handler
	tool.onMouseDown = function(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	}

	tool.onMouseDrag = function(event) {
		path.add(event.point);
	}
}
()
*/

// class ToolBox {
// 	constructor() {
// 		this.tools = {
// 			"pen": penTool(),
// 			"eraser": eraserTool()
// 		}
// 	}
// 	pen() {
// 		return this.tools.pen;
// 	}
// 	eraser() {
// 		return this.tools.eraser;
// 	}
// }

// tools = new ToolBox();

function activateTool(tool) {
	var t = new Tool();
	t.onMouseDown = function() {
		tool.onMouseDown();
		readValues();
	}
	t.onKeyDown = function() {
		tool.onKeyDown();
		setValues();
	}
	tool
	tool.activate();

}

const tools = {
	"pen": penTool(),
	"eraser": eraserTool()
}

const modeToToolMapper = {
	'draw': tools.pen,
	'eraser': tools.eraser
}

var defaultValues = {
	mode: 'draw',
	color: '#000000',
	width: 10
}

function readValues() {
	// let mode = document.getElementById('mode').value;
	// let color = document.getElementById('color').value;
	// let width = document.getElementById('width').value;
	let mode = document.getElementById('mode').value;
	let color = document.getElementById('color').value;
	let width = document.getElementById('width').value;

	if (!mode) {
		mode = 'draw';
	}
}

window.onload = function() {
	paper.setup('whiteboard');
	penTool().activate();
	view.onFrame = function() {

		console.log("he he he");
	}
}

function penTool() {
	var tool = new Tool();
	var width = 10;

	var path
	
	tool.onMouseDown = function(event) {
		path = new Path({
			strokeWidth: width,
			strokeColor: 'black'
		});
		path.add(event.point);
	}

	tool.onMouseDrag = function(event) {
		path.add(event.point);
	}

	tool.onKeyDown = function(event) {
		if (event.key == 'k') {
			width += 3;
		} else if (event.key == 'l') {
			width -= 3;
		} else {
			eraserTool().activate();
		}
	}

	return tool;
}

function eraserTool() {
	var tool = new Tool();

	tool.onMouseDrag = function(event) {
		if (event.item) {
			event.item.remove();
		}
	}
	return tool;
}



// window.onload = function() {
//     // Get a reference to the canvas object
//     var canvas = document.getElementById('whiteboard');
//     // Create an empty project and a view for the canvas:
//     paper.setup(canvas);
//     // Create a Paper.js Path to draw a line into it:
//     var path = new paper.Path();
//     // Give the stroke a color
//     path.strokeColor = 'black';
//     var start = new paper.Point(100, 100);
//     // Move to start and draw a line from there
//     path.moveTo(start);
//     // Note that the plus operator on Point objects does not work
//     // in JavaScript. Instead, we need to call the add() function:
//     path.lineTo(start.add([ 200, -50 ]));
//     // Draw the view now:
//     paper.view.draw();
// }

