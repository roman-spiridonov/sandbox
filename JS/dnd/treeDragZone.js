"use strict";
function TreeDragZone(options) {
  DragZone.apply(this, arguments);
  this._many = false;
  this._shapeSelector = 'li';
  this._manyOverrideSelector = null;
}

extend(TreeDragZone, DragZone);