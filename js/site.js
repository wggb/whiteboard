function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.")
}
