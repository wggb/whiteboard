function isBrush() {
    return (
        !whiteboard.isBusyHotKey &&
        whiteboard.mode == 'draw'
    );
}

var brush = {
    pressure: 1,
    shadow: false,
    position: null,
    isPenTablet: false,

    setPressure(force) {
        let min = 0.4;
        let max = 2.2;
        this.pressure = min + (max - min) * force;
    },

    startDrawing() {
        whiteboard.isBusy = true;

        let pathName = '#' + whiteboard.path.id++;
        let path = new Path({
            segments: [this.position],
            strokeColor: whiteboard.color,
            strokeWidth: whiteboard.width * brush.pressure,
            strokeCap: 'round',
            strokeJoin: 'round',
            name: pathName
        });
        if (brush.shadow) {
            path.shadowBlur = 9;
            path.shadowOffset = new Point(4, 4);
            path.shadowColor = new Color(0, 0, 0);
        }
        path.add(this.position);
        whiteboard.path.current = path;
    },

    stopDrawing() {
        if (whiteboard.isBusy && whiteboard.path.current) {
            if (whiteboard.path.current.segments.length > 5)
                whiteboard.path.current.simplify(10);
            whiteboard.paths.push(whiteboard.path.current);
            
            resetStats();
        }   
    }
}

events.onMouseDown.push(function(event) { if (isBrush()) {
    brush.startDrawing();
}});

events.onMouseDrag.push(function(event) { if (isBrush()) {
    let current = whiteboard.path.current;
    if (whiteboard.isBusy) current.add(event.point);
    let smoothInterval = 20;
    if (current.segments.length % smoothInterval == 0) {
        let len = current.segments.length;
        let i = 1;
        for (;i <= smoothInterval;i++) {
            current.segments[len-i].smooth();
        }
    }
    brush.position = event.point;
}});

events.onMouseUp.push(function(event) { if (isBrush()) {
    brush.stopDrawing();
}});

events.onMouseMove.push(function(event) { if(isBrush()) {
    brush.position = event.point;
}})

$.pressureConfig({
    polyfill: false,
    only: 'pointer'
});

$('#whiteboard').pressure({
	change: function(force, event){
        brush.isPenTablet = true;
	  // this is called every time there is a change in pressure
	  // force will always be a value from 0 to 1 on mobile and desktop
      brush.stopDrawing();
      brush.setPressure(force);
      brush.startDrawing();
    },
    unsupported: function(){
        brush.isPenTablet = false;
    }
  });