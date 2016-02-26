/**
 * Sortable Ractive Event
 *
 * @param  {Object} node DOM Node
 * @param  {Function} fire Method to fire back data to ractive.on
 * @return {Object} Teardown method
 * @author Bogdan Pop
 * previous work by Nijiko Yonskai, https://github.com/sigod, 
 * @copyright  2016
 */
Ractive.events.sortable = function(node, fire) {

  var props = {
    _draggingElement: null,
    _draggingParent: null,
    _forEach: function(a, callback, index) {
      // iterates Array, Object or FileList
      // TODO - check if index numeric and at least 0
      index = index || 0;
      var objectType = Object.prototype.toString.call(a);
      if (objectType === '[object Object]') {
        var keys = Object.keys(a);
        if (index < keys.length) {
          callback(a[keys[index]], keys[index], index);
          this._forEach(a, callback, index + 1);
        }
      } else if (objectType === '[object Array]' || objectType === "[object FileList]" || objectType === "[object HTMLCollection]") {
        if (index < a.length) {
          callback(a[index], index);
          this._forEach(a, callback, index + 1);
        }
      }
    },
    _dragEvent: function(name) {
      return function(event) {
        if (event.type === "dragstart") {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/html', this.innerHTML);
          props._draggingElement = this;    
          props._draggingParent = this.parentNode;
        }   
        if (event.type==="dragover") {
          event.preventDefault(); // allowing drops https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations
          event.dataTransfer.dropEffect = 'move';
        }
        if (event.type==="dragend") {
          props._draggingElement = null;
          props._draggingParent = null;
        }
        if (event.type==="drop") {                                
          // Stops browsers from redirecting. Disables dragging/dropping sortable element outside of parent
          // if true, elements are simply sortable!
          if (props.stopDropPropagation) event.stopPropagation(); 

          // Don't do anything if dropping the same column we're dragging.
          if (props._draggingElement !== this && this.parentNode === props._draggingParent) {
            // Set the source column's HTML to the HTML of the column we dropped on.
            props._draggingElement.innerHTML = this.innerHTML;
            this.innerHTML = event.dataTransfer.getData('text/html');
            fire({
              node: node,
              name: name,
              type: name.split('_')[1],
              target: this,
              original: event
            });
          }
        }                
      }
    },
    _tearDown: {
      teardown: function() {

        props._forEach(node.children, function(child){  
          child.draggable = false;
          props._forEach(props.events, function(element, key) {
            child.removeEventListener(element, props._dragEvent(element));
          }, 0);
        },0);

      }
    },
    events: ["drag", "dragend", "dragenter", "dragexit", "dragleave", "dragover", "dragstart","drop"],
    stopDropPropagation: node.hasAttribute("data-dropStopPropagation")
  }

  props._forEach(node.children, function(child){  
    child.draggable = true;
    props._forEach(props.events, function(element, key) {
      child.addEventListener(element, props._dragEvent(element));
    }, 0);
  },0);

  return props._tearDown;
};