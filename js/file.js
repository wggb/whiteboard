function getDateAsString() {
    var date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    if (month.length < 2) month = '0' + month;
    var day = date.getDate().toString();
    if (day.length < 2) day = '0' + day;
    var hours = date.getHours().toString();
    if (hours.length < 2) hours = '0' + hours;
    var minutes = date.getMinutes().toString();
    if (minutes.length < 2) minutes = '0' + minutes;
    var seconds = date.getSeconds().toString();
    if (seconds.length < 2) seconds = '0' + seconds;
    return year + '-' + month + '-' + day + ' ' + hours + '-' + minutes + '-' + seconds;
}

function downloadCanvasAsJPEG(canvasid, filename) {
    var canvas = document.getElementById(canvasid);
    var img = canvas.toDataURL('image/jpeg');
    var element = document.createElement('a');
    element.setAttribute('href', img);
    element.setAttribute('download', filename + ' ' + getDateAsString() + '.jpeg');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadStringAsJSON(text, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + ' ' + getDateAsString() + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function readStringFromJSONFile(inputElement, outputField) {
    var file = inputElement.files[0];
    var textType = /json.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function(e) {
            outputField.value = reader.result;
        }
        reader.readAsText(file);
        inputElement.value = '';
    } else {
        alert("File not supported!");
    }
}

function printCanvas() {
    var rect = new Path.Rectangle({
        point: [
            view.center.x - (view.size.width / 2),
            view.center.y - (view.size.height / 2)
        ],
        size: [view.size.width, view.size.height],
        strokeColor: 'white',
        selected: false
    });
    rect.sendToBack();
    rect.fillColor = '#ffffff';

    setTimeout(function() {
        downloadCanvasAsJPEG('whiteboard', 'Whiteboard');
        rect.remove();
    }, 500);
}

var saveJSON = document.getElementById('save-json-button');
var saveJPEG = document.getElementById('save-jpeg-button');

var loadJSONInput = document.getElementById('load-json-file');

saveJSON.addEventListener('click', function(e) {
    downloadStringAsJSON(
        document.getElementById('save-textarea').value,
        'Whiteboard'
    );
});

saveJPEG.addEventListener('click', function(e) {
    printCanvas();
});

loadJSONInput.addEventListener('change', function () {
    readStringFromJSONFile(
        loadJSONInput,
        document.getElementById('load-textarea')
    );
});
