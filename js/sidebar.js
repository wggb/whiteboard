function getDateAsString() {
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) month = '0' + month;
    let day = date.getDate().toString();
    if (day.length < 2) day = '0' + day;
    let hours = date.getHours().toString();
    if (hours.length < 2) hours = '0' + hours;
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) minutes = '0' + minutes;
    let seconds = date.getSeconds().toString();
    if (seconds.length < 2) seconds = '0' + seconds;
    return year + '-' + month + '-' + day + ' ' + hours + '-' + minutes + '-' + seconds;
}

var sidebar = {
    buttonIds: ['draw', 'del', 'move', 'text'],
    setActiveButton: function (buttonId) {
        this.buttonIds.forEach(function (id) {
            if (buttonId == id) {
                $('#' + id).addClass('btn-dark');
                whiteboard.changeMode(id);
            } else $('#' + id).removeClass('btn-dark');
        });
    },
    downloadDataURLAsJPEG: function (data, filename) {
        let element = document.createElement('a');
        element.setAttribute('href', data);
        element.setAttribute('download', filename + ' ' + getDateAsString() + '.jpeg');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    downloadStringAsJSON: function (str, filename) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
        element.setAttribute('download', filename + ' ' + getDateAsString() + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    readStringFromJSONFile: function (inputElement, outputField) {
        let file = inputElement.files[0];
        let textType = /json.*/;

        if (file.type.match(textType)) {
            let reader = new FileReader();
            reader.onload = function () {
                outputField.value = reader.result;
            }
            reader.readAsText(file);
            inputElement.value = '';
        } else {
            alert("File not supported!");
        }
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

$('#save-load').click(function () {
    if (!$('#load-textarea').hasClass('d-none'))
        $('.load-item, .save-item').toggleClass('d-none');
    $('#save-textarea').val(whiteboard.getDataAsJSON());
});

$('#save-jpeg-button').click(function () {
    whiteboard.addBackground();
    setTimeout(function () {
        let data = whiteboard.getDataURLAsJPEG();
        sidebar.downloadDataURLAsJPEG(data, 'Whiteboard');
        whiteboard.removeBackground();
    }, 500);
});

$('#save-json-button').click(function () {
    sidebar.downloadStringAsJSON(whiteboard.getDataAsJSON(), 'Whiteboard');
});

$('#load-json-button').click(function () {
    $('#load-json-file').click();
});

$('#load-json-file').change(function () {
    sidebar.readStringFromJSONFile(
        $('#load-json-file')[0],
        $('#load-textarea')[0]
    );
});

$('#load-button, #save-button').click(function () {
    $('.load-item, .save-item').toggleClass('d-none');
});

$('#save-load-done').click(function () {
    if (!$('#load-textarea').hasClass('d-none')) {
        let json = $('#load-textarea').val().trim();
        if (json != '') {
            whiteboard.setDataFromJSON(json);
        }
        $('#load-textarea')[0].value = '';
    }
});

$(document).ready(function () {
    sidebar.setActiveButton('draw');

    sidebar.buttonIds.forEach(function (id) {
        $('#' + id).click(function () {
            sidebar.setActiveButton(id);
        });
    });
});
