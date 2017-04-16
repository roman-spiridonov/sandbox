"use strict";
function TreeDropZone(options) {
  DropZone.apply(this, arguments);
  this._pocketSelector = 'li';
}

extend(TreeDropZone, DropZone);

TreeDropZone.prototype.onDragEnd = function(dragObject, pocket) {
  let title = dragObject.shape.textContent; // переносимый заголовок
  let li = null;

  // get container for li elements in pocket
  let ul = pocket.getElementsByTagName('ul')[0];
  if(!ul) {
    // leaf (no descendants) => add as a child
    ul = document.createElement('ul');
    pocket.appendChild(ul);
  } else {
    // has descendants => add to the list in alphabetical order
    for (let i = 0; i < ul.children.length; i++) {
      li = ul.children[i];
      let childTitle = li.textContent;
      if (childTitle > title) {
        // insert before this element
        break;
      }
      li = null;
    }
  }

  ul.insertBefore(dragObject.shape, li);

};

