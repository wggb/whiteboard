let isSpecialKeyEnabled = false;

function drawSelectRectangle(firstPoint, secondPoint) {
	let rectangle = new Rectangle(firstPoint, secondPoint);
	let rectanglePath = new Path.Rectangle(rectangle);
	rectanglePath.fillColor = '#eff9ff40';
	rectanglePath.selected = true;
	rectanglePath.removeOnDrag().removeOnUp();
	return rectanglePath;
}

function selectBox(event) {
	let rect = drawSelectRectangle(whiteboard.click.point, event.point);
    whiteboard.paths.forEach(function(path) {
        let intersections = rect.getIntersections(path);
		path.selected = (intersections.length > 0);
		if (rect.bounds.contains(path.interiorPoint)) {
			path.selected = true;
		}
    });
}

events.onMouseDown.push(function(event) {
    readValues();
    selectActiveLayer(false);

    whiteboard.click.point = event.point;
    whiteboard.isBusyHotKey = (
        Key.isDown('shift') ||
        Key.isDown('q') ||
        Key.isDown('w')
    );
});

events.onMouseDrag.push(function(event) {
    if (!whiteboard.isBusy && whiteboard.isBusyHotKey) {
        if (Key.isDown('shift')) selectBox(event);
    }
});

events.onKeyDown.push(function(event) {
    readValues();
    
    isSpecialKeyEnabled = (
        event.key == 'space' ||
        event.keyCode == 19 ||
        event.keyCode == 91
    ) ? true : isSpecialKeyEnabled;

    if (isSpecialKeyEnabled && !whiteboard.isBusy) {
        let keyMapper = {
			'1': 'move',
			'2': 'draw',
			'3': 'del'
		};
		if (event.key >= '1' && event.key <= '3')
			whiteboard.mode = keyMapper[event.key];
		setUI();
    }

    if (event.key == 'backspace' || event.key == 'delete') {
		let removedPathNames = [];
        whiteboard.paths.forEach(function(path) {
            if (path.selected) {
                removedPathNames.push(path.name);
                path.remove();
            }
        });
        removedPathNames.forEach(function(name) {
            deletePathFromArray(name);
        });
		savePaths();

        // Prevent the key event from bubbling
        return false;
    }
});

events.onKeyUp.push(function(event) {
    if (event.key == 'space' ||
        event.keyCode == 19 ||
        event.keyCode == 91) {
		isSpecialKeyEnabled = false;
		setTimeout(function() { setUI(); }, 0);
	}
});
