let currentSelectedPath = null;

function hand() {
    return (
        !whiteboard.isBusyHotKey &&
        whiteboard.mode == 'move'
    );
}

events.onMouseDown.push(function (event) {
    if (hand()) {
        whiteboard.isBusy = true;
    }
});

events.onMouseDrag.push(function (event) {
    if (hand()) {
        if (whiteboard.isBusy) {
            if (Key.isDown('s')) {
                getSelectedItems().forEach(function (selected) {
                    if (Key.isDown('w')) {
                        selected.position = selected.position.add(
                            new Point(0, event.delta.y));
                    } else if (Key.isDown('q')) {
                        selected.position = selected.position.add(
                            new Point(event.delta.x, 0));
                    } else {
                        selected.position = selected.position.add(event.delta);
                    }
                });
            } else if (Key.isDown('w')) {
                view.center = view.center.add(
                    new Point(0, whiteboard.mouse.click.y - event.point.y));
            } else if (Key.isDown('q')) {
                view.center = view.center.add(
                    new Point(whiteboard.mouse.click.x - event.point.x, 0));
            } else {
                view.center = view.center.add(
                    whiteboard.mouse.click.subtract(event.point));
            }
        }
    }
});

events.onMouseMove.push(function (event) {
    if (hand()) {
        if (Key.isDown('s')) {
            if (currentSelectedPath)
                currentSelectedPath.selected = false;
            currentSelectedPath = null;
            if (event.item && !event.item.selected) {
                currentSelectedPath = event.item;
                event.item.selected = true;
            }
        }
    }
});

events.onMouseUp.push(function (event) {
    if (hand()) {
        if (!Key.isDown('s')) resetStats();
        whiteboard.isBusy = false;
    }
});

events.onKeyUp.push(function (event) {
    if (event.key == 's' && currentSelectedPath) {
        currentSelectedPath.selected = false;
        currentSelectedPath = null;
    }
});
