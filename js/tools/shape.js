tools.shape = {
    check: function () {
        return (
            !whiteboard.isBusy &&
            whiteboard.mode == 'draw'
        );
    }
};

events.onMouseDrag.push(function (event) {
    if (tools.shape.check()) {
        let clickPoint = whiteboard.mouse.click;
        if (Key.isDown('q')) {
            let rect = new Rectangle(clickPoint, event.point);
            // 6 being the smoothing amount
            whiteboard.current.path = new Path.Rectangle(rect, 6);
        } else if (Key.isDown('w')) {
            if (Key.isDown('e')) {
                whiteboard.current.path = new Path.Circle({
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
                whiteboard.current.path = new Path.Circle({
                    center: new Point(
                        clickPoint.x - ((clickPoint.x - event.point.x) / 2),
                        clickPoint.y - ((clickPoint.y - event.point.y) / 2)
                    ),
                    radius: r
                });
            }
        } else if (Key.isDown('a')) {
            whiteboard.current.path = new Path({
                segments: [clickPoint],
                strokeJoin: 'round',
                strokeCap: 'round'
            });
            if (Key.isDown('s') && Key.isDown('d')) {
                let d = Math.min((event.point.x - clickPoint.x),
                    (event.point.y - clickPoint.y));
                whiteboard.current.path.add(
                    new Point(clickPoint.x + d, clickPoint.y + d));
            } else if (Key.isDown('s')) {
                whiteboard.current.path.add(
                    new Point(event.point.x, clickPoint.y));
            } else if (Key.isDown('d')) {
                whiteboard.current.path.add(
                    new Point(clickPoint.x, event.point.y));
            } else {
                whiteboard.current.path.add(event.point);
            }
        }

        if (Key.isDown('q') || Key.isDown('w') || Key.isDown('a')) {
            whiteboard.current.path.strokeColor = whiteboard.color;
            whiteboard.current.path.strokeWidth = whiteboard.width;
            whiteboard.current.path.removeOnDrag();
        }
    }
});

events.onMouseUp.push(function (event) {
    if (tools.shape.check()) {
        if (Key.isDown('q') || Key.isDown('w') || Key.isDown('a')) {
            if (whiteboard.current.path) {
                whiteboard.current.path.name = '#' + whiteboard.current.id++;
                whiteboard.items.push(whiteboard.current.path);
            }
            whiteboard.resetStats();
        }
    }
});

events.onKeyUp.push(function (event) {
    if (tools.shape.check()) {
        if (event.key == 'q' || event.key == 'w' || event.key == 'a') {
            if (whiteboard.current.path) whiteboard.current.path.remove();
        }
    }
});
