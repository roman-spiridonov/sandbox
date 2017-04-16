"use strict";

/**
 * Drag Object for tree lists.
 * @param options
 * @extends DragObject
 * @constructor
 */
function TreeDragObject(options) {
  DragObject.apply(this, arguments);

  this.separatorBefore = null;  // separator before the shape used as a pocket for ordering
}

extend(TreeDragObject, DragObject);

TreeDragObject.prototype.createAvatarFromShape = function () {
  let li = this.shape.cloneNode(true);

  if (this.shape.previousElementSibling && this.shape.previousElementSibling.isSeparator) {
    // make sure there is no repetitive separator while dragging
    this.separatorBefore = this.shape.previousElementSibling;
    if(!this.dragClone) {
      this.separatorBefore.style.display = 'none';
    }
  }

  return li;
};

TreeDragObject.prototype.remove = function () {
  DragObject.prototype.remove.apply(this, arguments);
  if (!this.many) {
    this.separatorBefore.remove();
    this.separatorBefore = null;
  }
};

TreeDragObject.prototype.restore = function () {
  DragObject.prototype.restore.apply(this, arguments);
  this.separatorBefore && (this.separatorBefore.style.display = '');
};

TreeDragObject.prototype.hide = function () {
  DragObject.prototype.hide.apply(this, arguments);
  this.separatorBefore && (this.separatorBefore.style.display = 'none');
};


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
TreeDragObject.prototype.appendLiToUl = function (li, ul, mode = 'end') {
  let title = li.textContent; // list title being dragged
  let targetLi = null;

  switch (mode) {
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


/**
 * Place the element inside of the pocket.
 * @param e - mouse event
 * @param pocket {HTMLElement}
 */
TreeDragObject.prototype.onDragEnd = function (e, pocket) {
  if (pocket.isSeparator) {
    // insert element in place of a separator
    pocket.parentNode.insertBefore(this.shape, pocket);

    // make sure it is wrapped around with separators
    if (this.separatorBefore) {
      pocket.parentNode.insertBefore(this.separatorBefore, this.shape);
    }

    return;
  }

  // pocket is not a separator (not reordering)
  // get container for li elements in pocket
  let ul = pocket.querySelector('ul');

  if (!ul) {
    // leaf (no descendants) => add as a child
    ul = document.createElement('ul');
    pocket.appendChild(ul);
    ul.appendChild(this.shape);
  } else {
    // has descendants => add to the list in alphabetical order
    this.appendLiToUl(this.shape, ul, 'end');
  }

  // if dragging with separator => insert separator
  if (this.separatorBefore) {
    ul.insertBefore(this.separatorBefore, this.shape);
  }
};



