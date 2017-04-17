"use strict";

/**
 * jQuery UI widget wrapper for DropZone.
 */
$.widget("rs.dropzone", {
  _create: function() {
    new DragZone({
      container: this.element[0],  // sending vanilla DOM object
      pocketSelector: this.options.pocketSelector,
    });
  },

});
