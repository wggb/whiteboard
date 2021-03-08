function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function isLoad() {
    return $('#save-textarea').hasClass('d-none');
}

function chooseButton(id) {
    ['#move', '#draw', '#del'].forEach(function(mode) {
        $(mode).removeClass('btn-dark') });
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
    savePaths();
});

$('#load-json-button').click(function() {
    $('#load-json-file').click();
});

$('#save-json-button').click(function() {
    downloadStringAsJSON(
        $('#save-textarea')[0].value,
        'Whiteboard'
    );
});

$('#save-jpeg-button').click(function() {
    printCanvas($('#whiteboard')[0]);
});

$('#save-load-done').click(function() {
    if ($('#save-textarea').hasClass('d-none')) {
        let loadText = $('#load-textarea')[0].value.trim();
		if (loadText != '') {
            loadPaths(loadText);
		}
		$('#load-textarea')[0].value = '';
	}
});

$('#load-json-file').change(function () {
    readStringFromJSONFile(
        $('#load-json-file')[0],
        $('#load-textarea')[0]
    );
});

$('#draw').addClass('btn-dark');
