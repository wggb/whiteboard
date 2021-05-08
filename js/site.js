var onClickMode = null;

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function isLoad() {
    return $('#save-textarea').hasClass('d-none');
}

function chooseButton(id) {
    whiteboard.resetStats();
    if (!$('#save-load-modal').hasClass('show')) {
        $('.sticky-sidebar button:not(.mode-btn)').blur();
        $('.sticky-sidebar input:not(.mode-btn)').blur();
        ['#move', '#draw', '#del', '#text'].forEach(
            function (mode) { $(mode).removeClass('btn-dark'); });
        $('#' + id).addClass('btn-dark');
        $('#mode')[0].value = id;
    }
}

function blurSidebar() {
    whiteboard.delete = true;
    $('.sticky-sidebar *:not(.mode-btn)').blur();
}

function showZoom() {
    let $countainer = $('#zoom-percent-container');
    $('#zoom-percent').text(Math.floor((view.zoom) * 100));
    $countainer.addClass('show');
    let lastZoom = view.zoom;
    setTimeout(function () {
        if (lastZoom == view.zoom)
            $countainer.removeClass('show');
    }, 600);
}

$('#zoom-percent-container button').mouseenter(function () {
    $(this).toggleClass('top');
});

if (!isCanvasSupported()) {
    alert("Canvas is not supported by your browser.");
}

$('#draw').click(function () { chooseButton('draw'); });
$('#del').click(function () { chooseButton('del'); });
$('#move').click(function () { chooseButton('move'); });
$('#text').click(function () { chooseButton('text'); });

$('#load-button').click(function () {
    $('.save-item').addClass('d-none');
    $('.load-item').removeClass('d-none');
});

$('#save-button, #save-load').click(function () {
    $('.load-item').addClass('d-none');
    $('.save-item').removeClass('d-none');
    whiteboard.resetStats();
    saveItems();
});

$('#load-json-button').click(function () {
    $('#load-json-file').click();
});

$('#save-json-button').click(function () {
    downloadStringAsJSON(
        $('#save-textarea').val(),
        'Whiteboard'
    );
});

$('#save-jpeg-button').click(function () {
    printCanvas($('#whiteboard')[0]);
});

$('#save-load-done').click(function () {
    if ($('#save-textarea').hasClass('d-none')) {
        let loadText = $('#load-textarea').val().trim();
        if (loadText != '') {
            whiteboard.loadItems(loadText);
        }
        $('#load-textarea')[0].value = '';
    }
});

$('#zoom-in').click(function () {
    zoomWhiteboard(1.2);
    showZoom();
});

$('#zoom-out').click(function () {
    zoomWhiteboard(0.8);
    showZoom();
});

$('#whiteboard').bind('contextmenu', function () {
    return false;
});

$('#whiteboard').on('mousedown', function (event) {
    onClickMode = $('#mode').val();
    if (event.which == 2 || event.which == 3) {
        event.preventDefault();
        if (!whiteboard.isBusy) {
            if (event.which == 2) chooseButton('move');
            else if (event.which == 3) chooseButton('del');
        }
    }
});

$('#whiteboard').on('mouseup', function (event) {
    if (event.which == 2 || event.which == 3) {
        if (!onClickMode)
            chooseButton(defaultValues.mode);
        else if (whiteboard.mode != onClickMode)
            chooseButton(onClickMode);
    }
    onClickMode = null;
});

$('#width').on('input', function () {
    try {
        let width = Number($(this).val());
        if (isNaN(width))
            $(this)[0].value = whiteboard.width;
        else if (width < 0)
            $(this)[0].value = 0;
        else if (width > defaultValues.maxWidth)
            $(this)[0].value = defaultValues.maxWidth;
    } catch (error) {
        $(this)[0].value = whiteboard.width;
    }

    whiteboard.readValues();
    updateSelectedWidth();
});

$('#width').change(function () {
    if ($(this).val() < defaultValues.minWidth)
        $(this)[0].value = defaultValues.minWidth;

    whiteboard.readValues();
    updateSelectedWidth();
});

$('#width').focus(function () {
    whiteboard.delete = false;
});

$('#color').on('input', function () {
    whiteboard.readValues();
    updateSelectedColor();
});

$('#color').change(function () {
    whiteboard.readValues();
    updateSelectedColor();
});

$('#color').focus(function () {
    whiteboard.delete = false;
});

$('#load-json-file').change(function () {
    readStringFromJSONFile(
        $('#load-json-file')[0],
        $('#load-textarea')[0]
    );
});

$(defaultValues.whiteboardSelector)[0].addEventListener('wheel',
    function (event) {
        if (!whiteboard.zoomLocked) {
            setTimeout(function () {
                showZoom();
            }, 0);
        }
    }
);

$(defaultValues.whiteboardSelector)[0].addEventListener('touchmove',
    function (event) {
        if (whiteboard.mode == 'move' && event.touches.length > 1) {
            setTimeout(function () {
                showZoom();
            }, 0);
        }
    }
);

$('#save-textarea, #copy-save-textarea-container').hover(
    function () {
        $('#copy-save-textarea-container').addClass('show');
    },
    function () {
        $('#copy-save-textarea-container').removeClass('show');
    }
);

$('#copy-save-textarea').click(function () {
    $('#save-textarea').select();
    document.execCommand('copy');
    if (window.getSelection) window.getSelection().removeAllRanges();
    else if (document.selection) document.selection.empty();

    let $button = $(this)
    $button.text('Copied!');
    setTimeout(function () {
        $button.text($button.attr('default-text'));
    }, 1500);
});

$('#draw').addClass('btn-dark');
