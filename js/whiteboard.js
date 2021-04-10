paper.install(window);
window.onload = function () {
    paper.setup('whiteboard');
};
let tool = new Tool();

const defaultValues = {
    mode: 'draw',
    color: '#000000',
    width: 6,
    minWidth: 1,
    maxWidth: 9999
};

var whiteboard = {
    mode: defaultValues.mode,
    color: defaultValues.color,
    width: defaultValues.width,
    items: [],
    current: {
        id: 0,
        path: null,
        text: null
    },
    mouse: {
        point: null,
        click: null
    },
    delete: true,
    isBusy: false,
    isBusyHotKey: false
};

var tools = {};

var events = {
    onMouseDown: [],
    onMouseDrag: [],
    onMouseMove: [],
    onMouseUp: [],
    onKeyDown: [],
    onKeyUp: []
};

function resetWhiteboard() {
    whiteboard.mode = defaultValues.mode;
    $('#mode')[0].value = defaultValues.mode;
    whiteboard.width = defaultValues.width;
    $('#width')[0].value = defaultValues.width;
    whiteboard.color = defaultValues.color;
    $('#color')[0].value = defaultValues.color;
}

function clearWhiteboard() {
    whiteboard.items.forEach(function (path) {
        path.remove()
    });
    whiteboard.items = [];
}

function readValues() {
    whiteboard.mode = $('#mode').val();
    whiteboard.color = $('#color').val();
    whiteboard.width = $('#width').val();

    if (!whiteboard.mode)
        whiteboard.mode = defaultValues.mode;

    try {
        whiteboard.width = Number(whiteboard.width);
        if (whiteboard.width < 1 || isNaN(whiteboard.width)) {
            whiteboard.width = defaultValues.width;
        }
    } catch (error) {
        whiteboard.width = defaultValues.width;
        console.warn('Couldn\'t read width. Using default: '
            + defaultValues.width.toString());
    }
}

function setUI() { chooseButton(whiteboard.mode); }

function deleteItemFromArray(name) {
    whiteboard.items.forEach(function (item, index) {
        if (item.name == name)
            whiteboard.items.splice(index, 1);
    });
}

function loadItems(text) {
    clearWhiteboard();

    try {
        JSON.parse(text).forEach(function (item) {
            let mode = item[0].trim().toLowerCase();
            if (mode == 'path')
                whiteboard.items.push(new Path(item[1]));
            else if (mode == 'pointtext')
                whiteboard.items.push(new PointText(item[1]));
        });
    } catch (error) { alert('Text can\'t be parsed.'); }
}

function getSelectedItems() {
    let selectedItems = [];
    whiteboard.items.forEach(function (item) {
        if (item.selected) selectedItems.push(item);
    });
    return selectedItems;
}

function updateSelectedWidth(width) {
    width = (typeof width == 'undefined' || isNaN(width))
        ? whiteboard.width : width;
    if (width < defaultValues.minWidth) width = defaultValues.minWidth;
    if (width > defaultValues.maxValue) width = defaultValues.maxValue;
    getSelectedItems().forEach(function (item) {
        if (item instanceof Path) {
            item.strokeWidth = width;
        } else if (item instanceof PointText) {
            item.fontSize = width + 16;
        }
    });
}

function updateSelectedColor(color) {
    color = (typeof color != 'undefined') ? color : whiteboard.color;
    getSelectedItems().forEach(function (item) {
        if (item instanceof Path) {
            item.strokeColor = color;
        } else if (item instanceof PointText) {
            item.fillColor = color;
        }
    });
}

function saveItems() {
    $('#save-textarea')[0].value = JSON.stringify(whiteboard.items);
}

function selectActiveLayer(value) {
    project.activeLayer.selected = value;
}

function resetStats() {
    if (whiteboard.current.path)
        whiteboard.current.path.selected = false;
    if (whiteboard.current.text) {
        whiteboard.current.text.selected = false;
        try {
            tools.text.pushCurrentText();
        } catch (e) { }
    }
    whiteboard.isBusy = false;
    whiteboard.current.path = null;
    whiteboard.current.text = null;
    whiteboard.mouse.click = null;
}

function zoomWhiteboard(rate, multiply) {
    let minValue = 0.4, maxValue = 16;
    let zoomValue = view.zoom * rate;
    multiply = (typeof multiply != 'undefined') ? multiply : 0;
    if (zoomValue >= minValue && zoomValue <= maxValue &&
        ((view.zoom < maxValue && rate > 1) ||
            (view.zoom > minValue && rate < 1))) {
        let direction = (rate < 1) ? -1 : 1;
        if (multiply > 0)
            view.center = view.center.add(
                whiteboard.mouse.point.subtract(
                    view.center).divide(rate * direction * multiply)
            );
        view.zoom = zoomValue;
    }
}

function getCenter() {
    return view.center;
}

function getCenterAsArray() {
    return [view.center.x, view.center.y];
}

function setCenter(pos) {
    if (pos instanceof Point) {
        view.center = pos;
    } else if (pos instanceof Array) {
        view.center = new Point(pos[0], pos[1]);
    }
}

tool.onMouseDown = function (event) {
    events.onMouseDown.forEach(function (func) {
        func(event);
    });
}

tool.onMouseDrag = function (event) {
    events.onMouseDrag.forEach(function (func) {
        func(event);
    });
}

tool.onMouseMove = function (event) {
    events.onMouseMove.forEach(function (func) {
        func(event);
    });
}

tool.onMouseUp = function (event) {
    events.onMouseUp.forEach(function (func) {
        func(event);
    });
}

tool.onKeyDown = function (event) {
    events.onKeyDown.forEach(function (func) {
        func(event);
    });
}

tool.onKeyUp = function (event) {
    events.onKeyUp.forEach(function (func) {
        func(event);
    });
}

$(function () {
    chooseButton(defaultValues.mode);
    $('#color')[0].value = defaultValues.color;
    $('#width')[0].value = defaultValues.width;
});
