function brush() {
    return (
        !whiteboard.isBusyHotKey &&
        whiteboard.mode == 'draw'
    );
}

events.onMouseDown.push(function (event) {
    if (brush()) {
        whiteboard.isBusy = true;

        let pathName = '#' + whiteboard.path.id++;
        whiteboard.path.current = new Path({
            segments: [event.point],
            strokeColor: whiteboard.color,
            strokeWidth: whiteboard.width,
            strokeCap: 'round',
            name: pathName
        });
        whiteboard.path.current.add(event.point);
    }
});

events.onMouseDrag.push(function (event) {
    if (brush()) {
        if (whiteboard.isBusy) whiteboard.path.current.add(event.point);
    }
});

events.onMouseUp.push(function (event) {
    if (brush()) {
        if (whiteboard.isBusy && whiteboard.path.current) {
            if (whiteboard.path.current.segments.length > 5)
                whiteboard.path.current.simplify(10);
            whiteboard.paths.push(whiteboard.path.current);

            resetStats();
        }
    }
});
