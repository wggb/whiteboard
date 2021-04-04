tools.general = {
    isSpecialKeyEnabled: false
};

function drawSelectRectangle(firstPoint, secondPoint) {
    let rectangle = new Rectangle(firstPoint, secondPoint);
    let rectanglePath = new Path.Rectangle(rectangle);
    rectanglePath.fillColor = '#eff9ff40';
    rectanglePath.selected = true;
    rectanglePath.removeOnDrag().removeOnUp();
    return rectanglePath;
}

function selectBox(event) {
    let rect = drawSelectRectangle(whiteboard.mouse.click, event.point);
    whiteboard.items.forEach(function (item) {
        let intersections = rect.getIntersections(
            (item instanceof Path) ? item : new Path.Rectangle(item.bounds)
        );
        item.selected = (intersections.length > 0);
        if (item.isInside(rect.bounds)) item.selected = true;
    });
}

events.onMouseDown.push(function (event) {
    blurSidebar();
    readValues();

    if (whiteboard.mode != 'move' || !Key.isDown('s'))
        selectActiveLayer(false);

    whiteboard.mouse.click = event.point;
    if (!whiteboard.isBusy) whiteboard.isBusyHotKey = (
        Key.isDown('shift') ||
        (whiteboard.mode == 'draw' &&
            (Key.isDown('q') || Key.isDown('w') || Key.isDown('a')))
    );
});

events.onMouseDrag.push(function (event) {
    if (!whiteboard.isBusy && whiteboard.isBusyHotKey) {
        if (Key.isDown('shift')) selectBox(event);
    }
});

events.onMouseMove.push(function (event) {
    whiteboard.mouse.point = event.point;
});

events.onKeyDown.push(function (event) {
    readValues();

    tools.general.isSpecialKeyEnabled = (
        event.key == 'space' ||
        event.keyCode == 19 ||
        event.keyCode == 91
    ) ? true : tools.general.isSpecialKeyEnabled;

    if (tools.general.isSpecialKeyEnabled && !whiteboard.isBusy) {
        let keyMapper = {
            '1': 'move',
            '2': 'draw',
            '3': 'del',
            '4': 'text'
        };
        if (event.key >= '1' && event.key <= '4')
            whiteboard.mode = keyMapper[event.key];
        setUI();
    }

    if (event.key == 'backspace' || event.key == 'delete') {
        if (whiteboard.delete) {
            let removedItemNames = [];
            whiteboard.items.forEach(function (item) {
                if (item.selected) {
                    removedItemNames.push(item.name);
                    item.remove();
                }
            });
            removedItemNames.forEach(function (name) {
                deleteItemFromArray(name);
            });
        }

        // Prevent the key event from bubbling
        return false;
    }
});

events.onKeyUp.push(function (event) {
    if (event.key == 'space' ||
        event.keyCode == 19 ||
        event.keyCode == 91) {
        tools.general.isSpecialKeyEnabled = false;
        if (!whiteboard.isBusy)
            setTimeout(function () { setUI(); }, 0);
    }
});
