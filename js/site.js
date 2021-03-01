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
});

$('#del').click(function() {
    $('#mode')[0].value = 'del';
    $('#del').addClass('btn-dark');
    $('#draw').removeClass('btn-dark');
});

$('#load-button').click(function() {
    $('#load-button').addClass('d-none');
    $('#save-button').removeClass('d-none');
    
    $('#save-lable').addClass('d-none');
    $('#load-lable').removeClass('d-none');
    
    $('#save-textarea').addClass('d-none');
    $('#load-textarea').removeClass('d-none');
});

$('#save-button, #save-load-done').click(function() {
    $('#save-button').addClass('d-none');
    $('#load-button').removeClass('d-none');
    
    $('#load-lable').addClass('d-none');
    $('#save-lable').removeClass('d-none');
    
    $('#load-textarea').addClass('d-none');
    $('#save-textarea').removeClass('d-none');
});

$('#draw').addClass('btn-dark');
