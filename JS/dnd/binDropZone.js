"use strict";
function BinDropZone(options) {
  DropZone.apply(this, arguments);
}

extend(BinDropZone, DropZone);

BinDropZone.prototype.onDragEnd = function(dragObject, pocket) {
  dragObject.remove();
};