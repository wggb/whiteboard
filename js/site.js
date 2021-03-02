function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function isLoad() {
    return $('#save-textarea').hasClass('d-none');
}

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.");
}

$('#draw').click(function() {
    $('#mode')[0].value = 'draw';
    $('#draw').addClass('btn-dark');
    $('#del').removeClass('btn-dark');
    $('#move').removeClass('btn-dark');
});

$('#del').click(function() {
    $('#mode')[0].value = 'del';
    $('#del').addClass('btn-dark');
    $('#draw').removeClass('btn-dark');
    $('#move').removeClass('btn-dark');
});

$('#move').click(function() {
    $('#mode')[0].value = 'move';
    $('#move').addClass('btn-dark');
    $('#draw').removeClass('btn-dark');
    $('#del').removeClass('btn-dark');
});

$('#load-button').click(function() {
    $('.save-item').addClass('d-none');
    $('.load-item').removeClass('d-none');
});

$('#save-button, #save-load').click(function() {
    $('.load-item').addClass('d-none');
    $('.save-item').removeClass('d-none');
});

$('#load-json-button').click(function() {
    $('#load-json-file').click();
});

$('#draw').addClass('btn-dark');
