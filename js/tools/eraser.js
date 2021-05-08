tools.eraser = {
    path: null,
    check: function () {
        return (
            !whiteboard.isBusyHotKey &&
            whiteboard.mode == 'del'
        );
    },
    removeIntersections: function () {
        whiteboard.items.forEach(function (item) {
            let intersections = tools.eraser.path.getIntersections(
                (item instanceof Path) ? item : new Path.Rectangle(item.bounds)
            );
            if (intersections.length > 0) whiteboard.deleteItem(item.name);
        });
    }
};

events.onMouseDown.push(function (event) {
    if (tools.eraser.check()) {
        whiteboard.isBusy = true;

        tools.eraser.path = new Path({
            segments: [event.point],
            strokeWidth: 1
        });
        tools.eraser.path.add(event.point);
        tools.eraser.removeIntersections();
    }
});

events.onMouseDrag.push(function (event) {
    if (tools.eraser.check()) {
        if (whiteboard.isBusy) {
            if (event.item) whiteboard.deleteItem(event.item.name);

            tools.eraser.path.add(event.point);
            tools.eraser.removeIntersections();
        }
    }
});

events.onMouseUp.push(function (event) {
    if (tools.eraser.path) {
        tools.eraser.path.remove();
        tools.eraser.path = null;
    }

    if (tools.eraser.check()) {
        whiteboard.resetStats();
    }
})
