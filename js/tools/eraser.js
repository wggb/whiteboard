function eraser() {
    return (
        !whiteboard.isBusyHotKey &&
        whiteboard.mode == 'del'
    );
}

events.onMouseDown.push(function (event) {
    if (eraser()) {
        whiteboard.isBusy = true;
    }
});

events.onMouseDrag.push(function (event) {
    if (eraser()) {
        if (whiteboard.isBusy) {
            if (event.item) {
                deletePathFromArray(event.item.name);
                event.item.remove();
            }
        }
    }
});

events.onMouseUp.push(function (event) {
    if (eraser()) {
        resetStats();
    }
})
