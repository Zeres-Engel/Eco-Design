(function() {

  // This fixes $(...).attr() to work as expected with SVG elements.
  // Does not currently use *AttributeNS() since we rarely need that.
  
  // See http://api.jquery.com/attr/ for basic documentation of .attr()
  
  // Additional functionality: 
  // - When getting attributes, a string that's a number is return as type number.
  // - If an array is supplied as first parameter, multiple values are returned
  // as an object with values for each given attributes

  var proxied = jQuery.fn.attr, svgns = "http://www.w3.org/2000/svg";
  jQuery.fn.attr = function(key, value) {
    var len = this.length;
    if(!len) return proxied.apply(this, arguments);
    for(var i=0; i<len; i++) {
      var elem = this[i];
      // set/get SVG attribute
      if(elem.namespaceURI === svgns) {
        // Setting attribute
        if(value !== undefined) {
          elem.setAttribute(key, value);
        } else if($.isArray(key)) {
          // Getting attributes from array
          var j = key.length, obj = {};

          while(j--) {
            var aname = key[j];
            var attr = elem.getAttribute(aname);
            // This returns a number when appropriate
            if(attr || attr === "0") {
              attr = isNaN(attr)?attr:attr-0;
            }
            obj[aname] = attr;
          }
          return obj;
        
        } else if(typeof key === "object") {
          // Setting attributes form object
          for(var v in key) {
            elem.setAttribute(v, key[v]);
          }
        // Getting attribute
        } else {
          var attr = elem.getAttribute(key);
          if(attr || attr === "0") {
            attr = isNaN(attr)?attr:attr-0;
          }

          return attr;
        }
      } else {
        return proxied.apply(this, arguments);
      }
    }
    return this;
  };
  
}());