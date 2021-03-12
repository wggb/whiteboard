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
    } else if (Key.isDown('a')) {
        whiteboard.path.current = new Path({
            segments: [clickPoint],
            strokeCap: 'round'
        });
        if (Key.isDown('s') && Key.isDown('d')) {
            let d = Math.min((event.point.x - clickPoint.x),
                (event.point.y - clickPoint.y));
            whiteboard.path.current.add(
                new Point(clickPoint.x + d, clickPoint.y + d));
        } else if (Key.isDown('s')) {
            whiteboard.path.current.add(
                new Point(event.point.x, clickPoint.y));
        } else if (Key.isDown('d')) {
            whiteboard.path.current.add(
                new Point(clickPoint.x, event.point.y));
        } else {
            whiteboard.path.current.add(event.point);
        }
    }

    if (Key.isDown('q') || Key.isDown('w') || Key.isDown('a')) {
        whiteboard.path.current.strokeColor = whiteboard.color;
        whiteboard.path.current.strokeWidth = whiteboard.width;
        whiteboard.path.current.removeOnDrag();
    }
}});

events.onMouseUp.push(function(event) { if (shape()) {
    if (Key.isDown('q') || Key.isDown('w') || Key.isDown('a')) {
        if (whiteboard.path.current) {
            whiteboard.path.current.name = '#' + whiteboard.path.id++;
            whiteboard.paths.push(whiteboard.path.current);
        }
        resetStats();
    }
}});

events.onKeyUp.push(function(event) { if (shape()) {
    if (event.key == 'q' || event.key == 'w' || event.key == 'a') {
        if (whiteboard.path.current) {
            whiteboard.path.current.remove();
        }
    }
}});
