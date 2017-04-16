"use strict";

/**
 * Drop zone for tree lists.
 * @extends DropZone
 * @constructor
 */
function TreeDropZone(options) {
  DropZone.apply(this, arguments);
  this._pocketSelector = 'li';
}

extend(TreeDropZone, DropZone);

/**
 * Inserts <li> element to the another list's <ul> level in alphabetical order
 * @param li
 * @param ul
 * @param mode {string} - can be one of the following options.
 * 'end' - insert to the end of ul list (default)
 * 'begin' - insert to the beginning of ul list
 * 'alphabetical' - insert keeping alphabetical in the ul list
 * @returns {*}
 */
TreeDropZone.prototype.appendLiToUl = function (li, ul, mode = 'end') {
  let title = li.textContent; // list title being dragged
  let targetLi = null;

  switch(mode) {
    case 'begin':
      targetLi = ul.children[0];
      break;

    case 'end':
      targetLi = null;
      break;

    case 'alphabetical':
      for (let i = 0; i < ul.children.length; i++) {
        targetLi = ul.children[i];
        let childTitle = targetLi.textContent;
        if (childTitle > title) {
          // insert before this element
          break;
        }
      }
      break;

    default:
      throw new Error(`Incorrect mode parameter specified: ${mode}. Should be one of 'begin', 'end', 'alphabetical'`);
  }

  ul.insertBefore(li, targetLi);
  return li;
};


TreeDropZone.prototype.onDragEnd = function(dragObject, pocket) {
  // get container for li elements in pocket
  let ul = pocket.getElementsByTagName('ul')[0];

  if(!ul) {
    // leaf (no descendants) => add as a child
    ul = document.createElement('ul');
    pocket.appendChild(ul);
    ul.appendChild(dragObject.shape);
  } else {
    // has descendants => add to the list in alphabetical order
    this.appendLiToUl(dragObject.shape, ul, 'alphabetical');
  }
};
