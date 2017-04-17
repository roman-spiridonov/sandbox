"use strict";

/**
 * jQuery UI widget wrapper for DragZone.
 */
$.widget("rs.dragzone", {
  options: {
    allowedDropZones: []
  },

  _create: function() {
    new DragZone({
      container: this.element[0],  // sending vanilla DOM object
      many: this.options.many,
      shapeSelector: this.options.shapeSelector,
      shapeManySelector: this.options.shapeManySelector,
      shapeNotManySelector: this.options.shapeNotManySelector
    });

    this.options.allowedDropZones.forEach((dropZone) => {
      this.addDropZone(dropZone);
    });
  },

  addDropZone: function(dropZone) {
    if(dropZone === undefined) {
      return null;
    }
    return this.element[0].dragZone.addDropZone(dropZone);
  },

  removeDropZone: function(dropZone) {
    if(dropZone === undefined) {
      return null;
    }
    return this.element[0].dragZone.removeDropZone(dropZone);
  },

  clearDropZones: function() {
    this.element[0].dragZone.clearDropZones();
  }

});
