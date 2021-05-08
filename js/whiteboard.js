paper.install(window);
window.onload = function () {
    paper.setup('whiteboard');
};
let tool = new Tool();

const defaultValues = {
    mode: 'draw',
    color: '#000000',
    width: 6,
    whiteboardSelector: '#whiteboard',
    modeSelector: '#mode',
    colorSelector: '#color',
    widthSelector: '#width',
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
    isBusyHotKey: false,

    reset: function () {
        this.mode = defaultValues.mode;
        $(defaultValues.modeSelector)[0].value = defaultValues.mode;
        this.width = defaultValues.width;
        $(defaultValues.widthSelector)[0].value = defaultValues.width;
        this.color = defaultValues.color;
        $(defaultValues.colorSelector)[0].value = defaultValues.color;
    },

    resetStats: function () {
        if (this.current.path)
            this.current.path.selected = false;
        if (this.current.text) {
            this.current.text.selected = false;
            try {
                tools.text.pushCurrentText();
            } catch (e) { }
        }
        this.isBusy = false;
        this.current.path = null;
        this.current.text = null;
        this.mouse.click = null;
    },

    clear: function () {
        this.items.forEach(function (path) {
            path.remove()
        });
        this.items = [];
    },

    readValues: function () {
        this.mode = $(defaultValues.modeSelector).val();
        this.color = $(defaultValues.colorSelector).val();
        this.width = $(defaultValues.widthSelector).val();

        if (!this.mode)
            this.mode = defaultValues.mode;

        try {
            this.width = Number(this.width);
            if (this.width < 1 || isNaN(this.width)) {
                this.width = defaultValues.width;
            }
        } catch (error) {
            this.width = defaultValues.width;
            console.warn('Couldn\'t read width. Using default: '
                + defaultValues.width.toString());
        }
    },

    deleteItem: function (name) {
        this.items.forEach(function (item, index) {
            if (item.name == name) {
                item.remove();
                whiteboard.items.splice(index, 1);
            }
        });
    },

    getSelectedItems: function () {
        let selectedItems = [];
        this.items.forEach(function (item) {
            if (item.selected) selectedItems.push(item);
        });
        return selectedItems;
    },

    selectActiveLayer: function (value) {
        project.activeLayer.selected = value;
    },


    getCenter: function () {
        return view.center;
    },

    getCenterAsArray: function () {
        return [view.center.x, view.center.y];
    },

    setCenter: function (pos) {
        if (pos instanceof Point) {
            view.center = pos;
        } else if (pos instanceof Array) {
            view.center = new Point(pos[0], pos[1]);
        }
    },

    loadItems: function (text) {
        this.clear();

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

function setUI() { chooseButton(whiteboard.mode); }

function updateSelectedWidth(width) {
    width = (typeof width == 'undefined' || isNaN(width))
        ? whiteboard.width : width;
    if (width < defaultValues.minWidth) width = defaultValues.minWidth;
    if (width > defaultValues.maxValue) width = defaultValues.maxValue;
    whiteboard.getSelectedItems().forEach(function (item) {
        if (item instanceof Path) {
            item.strokeWidth = width;
        } else if (item instanceof PointText) {
            item.fontSize = width + 16;
        }
    });
}

function updateSelectedColor(color) {
    color = (typeof color != 'undefined') ? color : whiteboard.color;
    whiteboard.getSelectedItems().forEach(function (item) {
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

function getEventDistance(event) {
    let touches = event.touches;
    return Math.sqrt(
        Math.pow(touches[0].clientX - touches[1].clientX, 2) +
        Math.pow(touches[0].clientY - touches[1].clientY, 2)
    );
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

var hotKeyPressed = false;
$(window).keydown(function (event) {
    if (event.which == 32 || event.which == 91 || event.which == 19)
        hotKeyPressed = true;
}).keyup(function (event) {
    if (event.which == 32 || event.which == 91 || event.which == 19)
        hotKeyPressed = false;
});

$(defaultValues.whiteboardSelector)[0].addEventListener('wheel',
    function (event) {
        if (hotKeyPressed) {
            let $width = $(defaultValues.widthSelector);
            let width = Number($width.val());

            if (event.deltaY < 0 && width < defaultValues.maxWidth)
                $width.val(width + 1);
            else if (event.deltaY > 0 && width > defaultValues.minWidth)
                $width.val(width - 1);
        } else {
            if (event.deltaY < 0) zoomWhiteboard(1.2, 5);   // Why 5?
            else if (event.deltaY > 0) zoomWhiteboard(0.8, 5);
        }
    }
);

var onPinchDistance = null;
$(defaultValues.whiteboardSelector)[0].addEventListener('touchstart',
    function (event) {
        if (whiteboard.mode == 'move' && event.touches.length > 1) {
            onPinchDistance = getEventDistance(event);
        }
    }
);

$(defaultValues.whiteboardSelector)[0].addEventListener('touchmove',
    function (event) {
        if (whiteboard.mode == 'move' && event.touches.length > 1) {
            event.preventDefault();
            let newPinchDistance = getEventDistance(event);
            zoomWhiteboard(Math.abs(newPinchDistance / onPinchDistance));
            onPinchDistance = newPinchDistance;
        }
    }
);

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
    $(defaultValues.colorSelector)[0].value = defaultValues.color;
    $(defaultValues.widthSelector)[0].value = defaultValues.width;
});
