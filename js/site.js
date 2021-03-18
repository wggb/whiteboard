var onClickMode = null

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function isLoad() {
    return $('#save-textarea').hasClass('d-none');
}

function chooseButton(id) {
    resetStats();
    if (!$('#save-load-modal').hasClass('show')) {
        $('.sticky-sidebar button:not(.mode-btn)').blur();
        $('.sticky-sidebar input:not(.mode-btn)').blur();
        ['#move', '#draw', '#del', '#text'].forEach(
            function(mode) { $(mode).removeClass('btn-dark'); });
        $('#' + id).addClass('btn-dark');
        $('#mode')[0].value = id;
    }
}

function blurSidebar() {
    $('.sticky-sidebar *:not(.mode-btn)').blur();
}

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.");
}

$('#draw').click(function() { chooseButton('draw'); });
$('#del').click(function() { chooseButton('del'); });
$('#move').click(function() { chooseButton('move'); });
$('#text').click(function() { chooseButton('text'); });

$('#load-button').click(function() {
    $('.save-item').addClass('d-none');
    $('.load-item').removeClass('d-none');
});

$('#save-button, #save-load').click(function() {
    $('.load-item').addClass('d-none');
    $('.save-item').removeClass('d-none');
    resetStats();
    savePaths();
});

$('#load-json-button').click(function() {
    $('#load-json-file').click();
});

$('#save-json-button').click(function() {
    downloadStringAsJSON(
        $('#save-textarea').val(),
        'Whiteboard'
    );
});

$('#save-jpeg-button').click(function() {
    printCanvas($('#whiteboard')[0]);
});

$('#save-load-done').click(function() {
    if ($('#save-textarea').hasClass('d-none')) {
        let loadText = $('#load-textarea').val().trim();
		if (loadText != '') {
            loadPaths(loadText);
		}
		$('#load-textarea')[0].value = '';
	}
});

$('#whiteboard').bind('contextmenu', function() {
    return false;
});

$('#whiteboard').on('mousedown', function(event) {
    onClickMode = $('#mode').val();
    if (event.which == 2 || event.which == 3){
        event.preventDefault();
        if (event.which == 2) chooseButton('move');
        else if (event.which == 3) chooseButton('del');
    }
});

$('#whiteboard').on('mouseup', function(event) {
    if (event.which == 2 || event.which == 3) chooseButton(onClickMode);
    onClickMode = null;
});

$('#width').on('input', function() {
    try {
		let width = Number($(this).val());
		if
            (isNaN(width)) $(this)[0].value = whiteboard.width;
        else if
            (width < 0) $(this)[0].value = 0;
		else if
            (width > 9999) $(this)[0].value = 9999;
	} catch (error) {
		$(this)[0].value = whiteboard.width;
	}
});

$('#width').change(function () {
    if ($(this).val() < 1) $(this)[0].value = 1;
});

$('#load-json-file').change(function () {
    readStringFromJSONFile(
        $('#load-json-file')[0],
        $('#load-textarea')[0]
    );
});

$('#draw').addClass('btn-dark');
