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
        if (whiteboard.isBusy && event.item)
            whiteboard.deleteItem(event.item.name);
    }
});

events.onMouseUp.push(function (event) {
    if (tools.eraser.check()) {
        whiteboard.resetStats();
    }
})
