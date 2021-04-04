tools.eraser = {
    check: function () {
        return (
            !whiteboard.isBusyHotKey &&
            whiteboard.mode == 'del'
        );
    }
};

events.onMouseDown.push(function (event) {
    if (tools.eraser.check()) {
        whiteboard.isBusy = true;
    }
});

events.onMouseDrag.push(function (event) {
    if (tools.eraser.check()) {
        if (whiteboard.isBusy && event.item) {
            deleteItemFromArray(event.item.name);
            event.item.remove();
        }
    }
});

events.onMouseUp.push(function (event) {
    if (tools.eraser.check()) {
        resetStats();
    }
})
