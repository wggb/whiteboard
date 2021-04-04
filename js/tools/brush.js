tools.brush = {
    check: function () {
        return (
            !whiteboard.isBusyHotKey &&
            whiteboard.mode == 'draw'
        );
    }
};

events.onMouseDown.push(function (event) {
    if (tools.brush.check()) {
        whiteboard.isBusy = true;

        let pathName = '#' + whiteboard.current.id++;
        whiteboard.current.path = new Path({
            segments: [event.point],
            strokeColor: whiteboard.color,
            strokeWidth: whiteboard.width,
            strokeCap: 'round',
            name: pathName
        });
        whiteboard.current.path.add(event.point);
    }
});

events.onMouseDrag.push(function (event) {
    if (tools.brush.check()) {
        if (whiteboard.isBusy) whiteboard.current.path.add(event.point);
    }
});

events.onMouseUp.push(function (event) {
    if (tools.brush.check()) {
        if (whiteboard.isBusy && whiteboard.current.path) {
            if (whiteboard.current.path.segments.length > 5) {
                whiteboard.current.path.simplify(10);
            } else if (whiteboard.current.path.segments.length <= 2) {
                whiteboard.current.path.add(event.point.add(0.1));
                whiteboard.current.path.simplify(50);
            }
            whiteboard.items.push(whiteboard.current.path);

            resetStats();
        }
    }
});
