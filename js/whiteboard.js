function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
if (!isCanvasSupported()) alert("Canvas is not supported by your browser.");

var whiteboard = new Drawgon("whiteboard", {
    backgroundColor: "#ffffff",
    mode: "draw",
    strokeColor: "#000000",
    strokeCap: "round",
    strokeWidth: 6,
    minStrokeWidth: 1,
    maxStrokeWidth: 9999,
    baseFontSize: 15,
    pathSmoothing: 10,
    cornerSmoothing: 4,
    zoom: 1,
    maxZoom: 16,
    minZoom: 0.4,
});

whiteboard.toolNames = DrawgonTool.getInstanceNames();
