function shape() {
    return (
        !whiteboard.isBusy &&
        whiteboard.mode == 'draw'
    );
}

events.onMouseDrag.push(function(event) { if (shape()) {
    let clickPoint = whiteboard.click.point;
    if (Key.isDown('q')) {
        let rect = new Rectangle(clickPoint, event.point);
        // 6 being the smoothing amount
        whiteboard.path.current = new Path.Rectangle(rect, 6);
    } else if (Key.isDown('w')) {
        if (Key.isDown('e')) {
            whiteboard.path.current = new Path.Circle({
                center: new Point(
                    clickPoint.x - ((clickPoint.x - event.point.x) / 2),
                    clickPoint.y - ((clickPoint.y - event.point.y) / 2)
                ),
                radius: new Point(
                    (clickPoint.x - event.point.x) / 2,
                    (clickPoint.y - event.point.y) / 2
                )
            });
        } else {
            let r = (clickPoint.subtract(event.point)).length / 2;
            whiteboard.path.current = new Path.Circle({
                center: new Point(
                    clickPoint.x - ((clickPoint.x - event.point.x) / 2),
                    clickPoint.y - ((clickPoint.y - event.point.y) / 2)
                ),
                radius: r
            });
        }
    }

    if (Key.isDown('q') || Key.isDown('w')) {
        whiteboard.path.current.strokeColor = whiteboard.color;
        whiteboard.path.current.strokeWidth = whiteboard.width;
        whiteboard.path.current.removeOnDrag();
    }
}});

events.onMouseUp.push(function(event) { if (shape) {
    if (Key.isDown('q') || Key.isDown('w')) {
        if (whiteboard.path.current) {
            whiteboard.path.current.name = '#' + whiteboard.path.id++;
            whiteboard.paths.push(whiteboard.path.current);
            savePaths();
        }
        resetStats();
    }
}});
