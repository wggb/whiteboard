tools.text = {
    shift: false,
    createTextElement: function (id) {
        this.removeTextElement(id);
        let element = document.createElement('textarea');
        element.id = id;
        element.oninput = this.readTextElement;
        element.style.width = 0;
        element.style.height = 0;
        element.style.opacity = 0;
        element.style.position = 'fixed';
        document.body.appendChild(element);
        return element;
    },
    removeTextElement: function (id) {
        try {
            document.body.removeChild(
                document.getElementById(id));
        } catch (e) { }
    },
    readTextElement: function () {
        if (whiteboard.isBusy) whiteboard.current.text.content =
            $('#whiteboard-text-element').val();
    },
    pushCurrentText: function () {
        if (whiteboard.current.text.content.trim() != '') {
            whiteboard.current.text.name = '#' + whiteboard.current.id++;
            whiteboard.items.push(whiteboard.current.text);
        }
    },
    check: function () {
        return (
            !whiteboard.isBusyHotKey &&
            whiteboard.mode == 'text'
        );
    }
};

events.onMouseDown.push(function (event) {
    if (tools.text.check()) {
        if (whiteboard.current.text) tools.text.pushCurrentText();
        whiteboard.isBusy = true;
        whiteboard.current.text = new PointText({
            content: '',
            point: whiteboard.mouse.click,
            fillColor: whiteboard.color,
            fontSize: whiteboard.width + 16,    // TODO: Change this
            selected: true
        });
        tools.text.createTextElement('whiteboard-text-element').focus();
    }
});

events.onKeyDown.push(function (event) {
    if (tools.text.check()) {
        if (event.key == 'shift') tools.text.shift = true;
        if (whiteboard.isBusy && event.key == 'enter' && !tools.text.shift) {
            whiteboard.current.text.selected = false;
            tools.text.removeTextElement('whiteboard-text-element');
            whiteboard.resetStats();
        }
    }
});

events.onKeyUp.push(function (event) {
    if (event.key == 'shift') tools.text.shift = false;
});
