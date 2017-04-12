"use strict";

function DropZone(container) {
  container.dropZone = this;  // save in DOM

  this._container = container;
}

DropZone.prototype.drop = function (e, dragObject) {
  let dropElem = this._findDroppable(e, dragObject);

  if (!dropElem) {
    this.onDragCancel(dragObject);
  } else {
    this.onDragEnd(dragObject, dropElem);
  }

};


DropZone.prototype._findDroppable = function(e, dragObject) {
  // спрячем переносимый элемент (иначе elementFromPoint найдет его)
  dragObject.avatar.hide();

  // получить самый вложенный элемент под курсором мыши
  let elem = document.elementFromPoint(e.clientX, e.clientY);

  // показать переносимый элемент обратно
  dragObject.avatar.show();

  if (elem == null) {
    // такое возможно, если курсор мыши "вылетел" за границу окна
    return null;
  }

  return elem.closest('.droppable');
};


DropZone.prototype.onDragEnd = function(dragObject, dropElem) {  // можно переопределить
};

DropZone.prototype.onDragCancel = function(dragObject) {  // можно переопределить
};
