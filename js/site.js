function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function isLoad() {
    return $('#save-textarea').hasClass('d-none');
}

function chooseButton(id) {
    ['#move', '#draw', '#del'].forEach(
        mode => $(mode).removeClass('btn-dark'));
    $('#' + id).addClass('btn-dark');
    $('#mode')[0].value = id;
}

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.");
}

$('#draw').click(function() { chooseButton('draw') });
$('#del').click(function() { chooseButton('del') });
$('#move').click(function() { chooseButton('move') });

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
