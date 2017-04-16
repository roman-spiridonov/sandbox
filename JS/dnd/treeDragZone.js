"use strict";
function TreeDragZone(options) {
  DragZone.apply(this, Object.assign(options, {
    many: false,
  }));

  this._many = false;

}

extend(TreeDragZone, DragZone);