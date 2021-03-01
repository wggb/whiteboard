function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.")
}

$('#draw').click(function() {
    document.getElementById('mode').value = 'draw';
    document.getElementById('draw').classList.add('btn-dark');
    document.getElementById('del').classList.remove('btn-dark');
});

$('#del').click(function() {
    document.getElementById('mode').value = 'del';
    document.getElementById('del').classList.add('btn-dark');
    document.getElementById('draw').classList.remove('btn-dark');
});

document.getElementById('draw').classList.add('btn-dark');
