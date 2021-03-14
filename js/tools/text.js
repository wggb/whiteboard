function text() {
    return (
        !whiteboard.isBusyHotKey &&
        whiteboard.mode == 'text'
    );
}

function readTextElement() {
    if (whiteboard.isBusy) whiteboard.text.current.content =
        $('#whiteboard-text-element').val();
}

function createTextElement(id) {
    removeTextElement(id);
    let element = document.createElement('textarea');
    element.id = id;
    element.oninput = readTextElement;
    element.style.width = 0;
    element.style.height = 0;
    element.style.opacity = 0;
    element.style.position = 'fixed';
    document.body.appendChild(element);
    return element;
}

function removeTextElement(id) {
    try {
        document.body.removeChild(
            document.getElementById(id));
    } catch (e) { }
}

function pushCurrentText() {
    if (whiteboard.text.current.content.trim() != '') {
        whiteboard.text.current.name = '#' + whiteboard.path.id++;
        whiteboard.paths.push(whiteboard.text.current);
    }
}

events.onMouseDown.push(function(event) { if (text()) {
    if (whiteboard.text.current) pushCurrentText();
    whiteboard.isBusy = true;
    whiteboard.text.current = new PointText({
        content: '',
        point: whiteboard.click.point,
        fillColor: whiteboard.color,
        fontSize: whiteboard.width + 16,    // TODO: Change this
        selected: true
    });
    createTextElement('whiteboard-text-element').focus();
}});

let shift = false;
events.onKeyDown.push(function(event) { if (text()) {
    if (event.key == 'shift') shift = true;
    if (whiteboard.isBusy && event.key == 'enter') {
        if (!shift) {
            whiteboard.text.current.selected = false;
            removeTextElement('whiteboard-text-element');
            resetStats();
        }
    }
}});

events.onKeyUp.push(function(event) {
    if (event.key == 'shift') shift = false;
});
