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

function downloadCanvasAsJPEG(canvasid, filename) {
    console.log('hi');
    let canvas = document.getElementById(canvasid);
    let img = canvas.toDataURL('image/jpeg');
    let element = document.createElement('a');
    element.setAttribute('href', img);
    element.setAttribute('download', filename + ' ' + getDateAsString() + '.jpeg');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadStringAsJSON(text, filename) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + ' ' + getDateAsString() + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function readStringFromJSONFile(inputElement, outputField) {
    let file = inputElement.files[0];
    let textType = /json.*/;

    if (file.type.match(textType)) {
        let reader = new FileReader();
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
    let rect = new paper.Path.Rectangle({
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

$('#save-json-button').click(function() {
    downloadStringAsJSON(
        $('#save-textarea')[0].value,
        'Whiteboard'
    );
});

$('#save-jpeg-button').click(function() {
    printCanvas();
});

$('#load-json-file')[0].addEventListener('change', function () {
    readStringFromJSONFile(
        $('#load-json-file')[0],
        $('#load-textarea')[0]
    );
});
