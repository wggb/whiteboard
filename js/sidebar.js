var sidebar = {
    buttonIds: ['draw', 'del', 'move', 'text'],
    setActiveButton: function (buttonId) {
        this.buttonIds.forEach(function (id) {
            if (buttonId == id) {
                $('#' + id).addClass('btn-dark');
                whiteboard.changeMode(id);
            } else $('#' + id).removeClass('btn-dark');
        });
    }
};

$('#color').on('input', function () {
    whiteboard.changeStrokeColor($(this).val());
});

$('#width').on('input', function () {
    whiteboard.changeStrokeWidth($(this).val());
});

$('#width').change(function () {
    $(this).val(whiteboard.changeStrokeWidth($(this).val()));
});

$('#zoom-in').click(function () {
    whiteboard.zoomCanvas(1.2);
    // showZoom();
});

$('#zoom-out').click(function () {
    whiteboard.zoomCanvas(0.8);
    // showZoom();
});

$(document).ready(function () {
    sidebar.setActiveButton('draw');

    sidebar.buttonIds.forEach(function (id) {
        $('#' + id).click(function () {
            sidebar.setActiveButton(id);
        });
    });
});
