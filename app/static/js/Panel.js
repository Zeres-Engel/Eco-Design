MD.Panel = function(){

  $('#canvas_height').dragInput({ min: 10,   max: null,  step: 10,  callback: editor.canvas.changeSize,   cursor: false, dragAdjust: .1 }); 
  $('#canvas_width') .dragInput({ min: 10,   max: null,  step: 10,  callback: editor.canvas.changeSize,   cursor: false, dragAdjust: .1 });                         
  $('#rect_width')   .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  }); 
  $('#rect_height')  .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#ellipse_cx')   .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#ellipse_cy')   .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#ellipse_rx')   .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#ellipse_ry')   .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $("#image_height") .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#circle_cx')    .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#circle_cy')    .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#circle_r')     .dragInput({ min: 1,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $("#image_height") .dragInput({ min: 0,    max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#selected_x')   .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#selected_y')   .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $("#path_node_x")  .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $("#path_node_y")  .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $("#image_width")  .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#line_x1')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#line_x2')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#line_y1')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#line_y2')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#path_x')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#path_y')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#rect_x')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#rect_y')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#g_x')          .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#g_y')          .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#image_x')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#text_y')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#text_x')       .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#image_y')      .dragInput({ min: null, max: null,  step:  1,  callback: editor.changeAttribute,     cursor: false  });
  $('#rect_rx')      .dragInput({ min: 0,    max: 100,   step:  1,  callback: editor.changeAttribute,     cursor: true   });
  $('#stroke_width') .dragInput({ min: 0,    max: 99,    step:  1,  callback: editor.changeAttribute,     cursor: true, smallStep: 0.1, start: 1.5          });
  $('#angle')        .dragInput({ min: -180, max: 180,   step:  1,  callback: editor.changeRotationAngle, cursor: false, dragAdjust: 0.5      });
  $('#font_size')    .dragInput({ min: 1,    max: 250,   step: 1,   callback: editor.text.changeFontSize, cursor: true, stepfunc: editor.stepFontSize, dragAdjust: .15 });
  $('#group_opacity').dragInput({ min: 0,    max: 100,   step:  5,  callback: editor.changeAttribute,     cursor: true,  start: 100             });
  $('#blur')         .dragInput({ min: 0,    max: 10,    step: .1,  callback: editor.changeBlur,          cursor: true,  start: 0               });

  $('#mk_material').on('click', function() {
    var selectedElements = editor.selected;

    if (selectedElements.length > 0) {
      selectedElements.forEach(element => {
          if (element.tagName === 'rect') {
              editor.changeAttribute('machine', '1', true);
              editor.changeAttribute('padding', '0', true);
              editor.changeAttribute('target', 'bin', true);
              editor.changeAttribute('area', '0', true);
              editor.changeAttribute('objects', '0', true);
          }
      });
      $('#mk_material').hide()
      $('#umk_material').show();
      $('#nest_panel').show();
      $('#align_tools').hide();
      $('#stroke_panel').hide();
    }
});

  $('#umk_material').on('click', function() {
      var selectedElements = editor.selected;

      if (selectedElements.length > 0) {
          selectedElements.forEach(element => {
              if (element.tagName === 'rect') {
                  editor.changeAttribute('machine', '', true);
                  editor.changeAttribute('padding', '', true);
                  editor.changeAttribute('target', '', true);
                  editor.changeAttribute('area', '', true);
                  editor.changeAttribute('objects', '', true);
              }
          });
          $('#mk_material').show()
          $('#umk_material').hide();
          $('#nest_panel').hide();
      }
  });

    // Machine input field
    $('#nmachine').dragInput({
      min: 1,
      max: 100,
      step: 1,
      callback: editor.changeAttribute, // Ensure it updates the attribute properly
      cursor: true,
      smallStep: 0.1, 
      start: 1
  });

  // Padding input field
  $('#add_padding').dragInput({
      min: 0,
      max: null,
      step: 1,
      callback: editor.changeAttribute,
      cursor: true,
      start: 2 
  });

  $('#startnest').on('click', function() {
    const isPremium = Number(localStorage.getItem('isPremium'));
    if (![1,2,3,4,5].includes(isPremium)) {
      showPremiumNeed()
      return;
    }
    var elems = editor.selected;
    if (!elems || elems.length === 0) {
        console.error('No elements selected.');
        return;
    }

    const svgIds = elems.map(elem => elem.getAttribute('id'));
    
    // Tìm phần tử đầu tiên có target == 'bin'
    var binElement = elems.find(elem => elem.tagName === 'rect' && elem.getAttribute('target') === 'bin');
    if (!binElement) {
        console.error('No bin element found.');
        return;
    }

    const machine = binElement.getAttribute('machine'); // Giả sử tất cả đều có cùng machine và padding
    const padding = binElement.getAttribute('padding');

    console.log('Sending IDs:', svgIds);
    console.log('Machine:', machine);
    console.log('Padding:', padding);

    const svgContent = svgCanvas.getSvgString();

    $.ajax({
        url: '/nest',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            svg_ids: svgIds,
            svg_content: svgContent,
            machine: machine,
            padding: padding
        }),
        success: function(response) {
            svgCanvas.setSvgString(response.new_svg_content);

            // Không cần lấy giá trị 'area_useds' và 'objects' nữa, vì nó đã được cập nhật trong SVG content

            elems.forEach((elem) => {
                if (elem.tagName === 'rect' && elem.getAttribute('target') === 'bin') {
                    updateNestPanel(elem);
                }
            });
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
  });


  // Function to update the nesting panel
  function updateNestPanel(elem) {
      if (elem && elem.getAttribute('target') === 'bin') {
          const area = elem.getAttribute('area');
          const objects = elem.getAttribute('objects');
          console.log(`Updating panel: Area used - ${area}, Objects - ${objects}`);
          $('#narea').val(area);
          $('#ncount').val(objects);
      }
  }

  // Align
  $('#position_opts .align_button').on("click", function(){
      $('#align_relative_to').val()
      svgCanvas.alignSelectedElements(this.getAttribute("data-align")[0], 'page');
  });

  $('.align_buttons .align_button').on("click", function(){
      svgCanvas.alignSelectedElements(this.getAttribute("data-align")[0],  $('#align_relative_to').val());
  });

  // Stroke dash
  $('#stroke_style').change(function(){
    svgCanvas.setStrokeAttr('stroke-dasharray', $(this).val());
    $("#stroke_style_label").html(this.options[this.selectedIndex].text);
  });

  // Segment type
  $('#seg_type').change(function() {
    svgCanvas.setSegType($(this).val());
    $("#seg_type_label").html(this.options[this.selectedIndex].text)
  });

  $("#tool_node_clone").on("click", function(){
    if (svgCanvas.pathActions.getNodePoint()) {
      const path = svgCanvas.pathActions.clonePathNode();
      svgCanvas.pathActions.toEditMode(svgedit.path.path.elem);
    }
  });

  $("#tool_node_delete").on("click", function(){
    if (svgCanvas.pathActions.getNodePoint()) {
      svgCanvas.pathActions.deletePathNode();
    }
  });

  $("#tool_openclose_path").on("click", function(){
    svgCanvas.pathActions.opencloseSubPath();
  });

  // Use
  $("#tool_unlink_use").on("click", function(){
    svgCanvas.ungroupSelectedElement();
  });

  $("#canvas_title").on("click", function(){
    $(this).focus();
  });

  $('#button_group').on("click", editor.groupSelected);
  $('#button_ungroup').on("click", editor.ungroupSelected);
  
  function show(elem) {
    $('.context_panel').hide();
    if (elem === "canvas") return $('#canvas_panel').show();
    if (elem === "multiselected") return $('#multiselected_panel').show();

    const tagName = elem.tagName;
    const target = elem.getAttribute('target');

    $("#" + tagName + "_panel").show();

    if (tagName === 'rect' & target === "bin") {
      updateNestPanel(elem);
      $('#umk_material').show()
      $('#mk_material').hide();
      updateNestPanel(elem);
      $('#nest_panel').show();
      $('#align_tools').hide();
      $('#stroke_panel').hide();
    }
    else {
      $('#mk_material').show()
      $('#umk_material').hide();
    }

    const strokeWidth = elem.getAttribute("stroke") && !elem.getAttribute("stroke-width") ? 1 : elem.getAttribute("stroke-width") || 0;
    $('#stroke_width').val(strokeWidth);
    const dash = elem.getAttribute("stroke-dasharray") || "none"
    $('#stroke_style option').removeAttr('selected');
    $('#stroke_style option[value="'+ dash +'"]').attr("selected", "selected");
    $('#stroke_style').trigger('change');

    $.fn.dragInput.updateCursor($('#stroke_width')[0])
    $.fn.dragInput.updateCursor($('#blur')[0])
  }

  function pathEditContext(){
     $('.context_panel').hide();
     $('#path_node_panel').show();
     $('#stroke_panel').hide();
     var point = svgCanvas.pathActions.getNodePoint();
     $('#tool_add_subpath').removeClass('push_button_pressed').addClass('tool_button');
     $('#tool_node_delete').toggleClass('disabled', !svgCanvas.pathActions.canDeleteNodes);
     if(point) {
       var seg_type = $('#seg_type');
       point.x = svgedit.units.convertUnit(point.x);
       point.y = svgedit.units.convertUnit(point.y);
       $('#path_node_x').val(Math.round(point.x));
       $('#path_node_y').val(Math.round(point.y));
       if(point.type) {
         seg_type.val(point.type).removeAttr('disabled');
         $("#seg_type_label").html(point.type === 4 ? "Straight" : "Curve")
       } else {
         seg_type.val(4).attr('disabled','disabled');
       }
     }
     $("#panels").removeClass("multiselected")        
     $("#stroke_panel").hide();
     $("#canvas_panel").hide();
     return;
   }

  function canPutTextOnPath(elems) {
    if (elems.length !== 2) return false;
    const text = elems.find(elem => elem.tagName === "text");
    const path = elems.find(elem => ["ellipse", "circle", "line", "polyline", "polygon", "rect", "path"].indexOf(elem.tagName) > -1);
    return (!!text && !!path);
  }

  function updateContextPanel(elems) {
    if (!elems) elems = editor.selected;
    var elem = elems[0] || editor.selected[0];
    const isNode = svgCanvas.pathActions.getNodePoint()
    // If element has just been deleted, consider it null
    if(!elem || !elem.parentNode) elem = null;

    const multiselected = elems.length > 1;
   
    var currentLayerName = svgCanvas.getCurrentDrawing().getCurrentLayerName();
    var currentMode = svgCanvas.getMode();

    $('.context_panel').hide();
    $("#align_tools").toggle(elem && !multiselected);

    if (currentMode === 'pathedit') return showPathEdit();
   
    var menu_items = $('#cmenu_canvas li');
   
    //hack to show the proper multialign box
    if (multiselected) {
      const multi = elems.filter(Boolean);
      elem = (svgCanvas.elementsAreSame(multi)) ? multi[0] : null
      if (elem) $("#panels").addClass("multiselected");
      const canTextPath = canPutTextOnPath(multi);
      $("#tool_text_on_path").toggle(canTextPath);
    }
    else {
      $("#panels").removeClass("multiselected");
    }

    if (!elem && !multiselected) {      
      $("#stroke_panel").hide();
      $('#nest_panel').hide();
      $('#mk_material').hide()
      $('#umk_material').hide()
      $("#canvas_panel").show();
    }

    if (elem !== null) {
      $("#stroke_panel").show();
      const strokeWidth = elem.getAttribute("stroke") && !elem.getAttribute("stroke-width") ? 1 : elem.getAttribute("stroke-width") || 0;
      $('#stroke_width').val(strokeWidth);
      // stroke style
      const strokeStyle = elem.getAttribute("stroke-dasharray") || "none";
      const strokeStyles = {
        "none": "—",
        "2,2": "...",
        "5,5": "- -",
        "5,2,2,2": "-·-",
        "5,2,2,2,2,2": "-··-"
      };
      $("#stroke_style_label").html(strokeStyles[strokeStyle] || "—");
      var elname = elem.nodeName;
      var angle = svgCanvas.getRotationAngle(elem);
      $('#angle').val(Math.round(angle));
      $('#group_opacity').val(svgCanvas.getOpacity(elem)*100 || 100);
      $.fn.dragInput.updateCursor(document.getElementById("group_opacity"));
      $('#tool_angle_indicator').css("transform", "rotate("+angle+"deg)");
      var blurval = svgCanvas.getBlur(elem);
      $('#blur').val(blurval);
      $.fn.dragInput.updateCursor(document.getElementById("blur"));
      if(!isNode && currentMode !== 'pathedit') {
        $('#selected_panel').show();
        $('.action_selected').removeClass('disabled');
        // Elements in this array already have coord fields
        var x, y
        if(['g', 'polyline', 'path'].indexOf(elname) >= 0) {
          var bb = svgCanvas.getStrokedBBox([elem]);
          if(bb) {
            x = bb.x;
            y = bb.y;
          }
        }
        
        x = svgedit.units.convertUnit(x);
        y = svgedit.units.convertUnit(y);

        $("#" + elname +"_x").val(Math.round(x))
        $("#" + elname +"_y").val(Math.round(y))
        if (elname === "polyline") {
          //we're acting as if polylines were paths
          $("#path_x").val(Math.round(x))
          $("#path_y").val(Math.round(y))
        }
                 
        // Elements in this array cannot be converted to a path
        var no_path = ['image', 'text', 'path', 'g', 'use'].indexOf(elname) === -1;
        if (no_path) $('.action_path_convert_selected').removeClass('disabled');
        if (elname === "path") $('.action_path_selected').removeClass('disabled');
      }
     
      var link_href = null;
      if (el_name === 'a') {
        link_href = svgCanvas.getHref(elem);
        $('#g_panel').show();
      }
     
      if(elem && elem.parentNode.tagName === 'a') {
        if(!$(elem).siblings().length) {
          $('#a_panel').show();
          link_href = svgCanvas.getHref(elem.parentNode);
        }
      }
     
      // Hide/show the make_link buttons
      $('#tool_make_link, #tool_make_link').toggle(!link_href);
     
      if(link_href) {
        $('#link_url').val(link_href);
      }
      
     // update contextual tools here
     var panels = {
      g: [],
      a: [],
      rect: ['rx', 'width', 'height', 'x', 'y'],
      image: ['width', 'height', 'x', 'y'],
      circle: ['cx', 'cy', 'r'],
      ellipse: ['cx', 'cy', 'rx', 'ry'],
      line: ['x1', 'y1', 'x2', 'y2'], 
      text: ['x', 'y'],
      'use': [],
      path : [],
      svg : [],
      };

      var el_name = elem.tagName;
      var target = elem.getAttribute("target");
      if ($(elem).data('gsvg')) {
          $('#g_panel').show();
      }

      if (el_name === "path" || el_name === "polyline") {
          $('#path_panel').show();
      }

      if (panels[el_name]) {
          if (el_name === 'rect' & target === "bin") {
            updateNestPanel(elem);
            $('#umk_material').show()
            $('#mk_material').hide()
            $('#nest_panel').show();
            $('#align_tools').hide();
            $('#stroke_panel').hide();
            
          }
          else {
            $('#mk_material').show()
            $('#umk_material').hide()
          }

          var cur_panel = panels[el_name];
          $('#' + el_name + '_panel').show();
          
          cur_panel.forEach((item, i) => {
              var attrVal = elem.getAttribute(item);
              var name_item = document.getElementById(el_name + '_' + item);

              // Find a textPath to put correct x and y
              if (el_name === "text") {
                  const textPath = elem.querySelector("textPath");
                  if (textPath) {
                      var bb = elem.getBBox();
                      if (bb) attrVal = bb[item];
                  }
              }

              name_item.value = Math.round(attrVal) || 0;
              if (name_item.getAttribute("data-cursor") === "true") {
                  $.fn.dragInput.updateCursor(name_item);
              }
          });

          if (el_name === 'text') {
              // Handle text-specific attributes
          } else if (el_name === 'image') {
              // Handle image-specific attributes
          } else if (el_name === 'g' || el_name === 'use') {
              $('#container_panel').show();
              $('.action_group_selected').removeClass('disabled');
              var title = svgCanvas.getTitle();
          }
      }
      menu_items[(el_name === 'g' ? 'en':'dis') + 'ableContextMenuItems']('#ungroup');
      menu_items[((el_name === 'g' || !multiselected) ? 'dis':'en') + 'ableContextMenuItems']('#group');
    }

if (multiselected) {
  $('#multiselected_panel').show();
  $('.action_multi_selected').removeClass('disabled');
  const validForNesting = ['rect', 'circle', 'ellipse', 'line', 'text', 'polyline', 'path'];

  const canNest = elems.some(el => validForNesting.includes(el.tagName) && el.getAttribute('target') === 'bin');

  if (canNest) {
      $('#nest_panel').show();
      $('#align_tools').hide();
      $('#stroke_panel').hide();
  }

  menu_items.enableContextMenuItems('#group').disableContextMenuItems('#ungroup');
}

if (!elem && !multiselected) {
  menu_items.disableContextMenuItems('#delete,#cut,#copy,#ungroup,#move_front,#move_up,#move_down,#move_back');
  $('.menu_item', '#edit_menu').addClass('disabled');
}

$('.menu_item', '#object_menu').toggleClass('disabled', !elem && !multiselected);

setTimeout(function(){
  $('#tool_paste').toggleClass('disabled', !svgCanvas.clipBoard.length > 0);
}, 10);
$('#tool_undo').toggleClass('disabled', !svgCanvas.undoMgr.getUndoStackSize() > 0);
$('#tool_redo').toggleClass('disabled', !svgCanvas.undoMgr.getRedoStackSize() > 0);

svgCanvas.addedNew = false;

if ((elem && !isNode) || multiselected) {
  $('#selLayerNames').removeAttr('disabled').val(svgCanvas.getCurrentDrawing().getCurrentLayerName());
  $("#cmenu_canvas").enableContextMenuItems('#delete,#cut,#copy,#move_front,#move_up,#move_down,#move_back');
}
}

  $('#cur_context_panel').delegate('a', 'click', function() {
    var link = $(this);
    if(link.attr('data-root')) {
      svgCanvas.leaveContext();
    } else {
      svgCanvas.setContext(link.text());
    }
    svgCanvas.clearSelection();
    return false;
  });

  function showPathEdit(){
     $('#path_node_panel').show();
     $('#stroke_panel').hide();
     var point = svgCanvas.pathActions.getNodePoint();
     $('#tool_node_delete').toggleClass('disabled', !svgCanvas.pathActions.canDeleteNodes);
     if(point) {
       var seg_type = $('#seg_type');
       point.x = svgedit.units.convertUnit(point.x);
       point.y = svgedit.units.convertUnit(point.y);
       $('#path_node_x').val(Math.round(point.x));
       $('#path_node_y').val(Math.round(point.y));
       if(point.type) {
         seg_type.val(point.type).removeAttr('disabled');
         $("#seg_type_label").html(point.type === 4 ? "Straight" : "Curve")
       } else {
         seg_type.val(4).attr('disabled','disabled');
       }
     }
     $("#panels").removeClass("multiselected")        
     $("#stroke_panel").hide();
     $("#canvas_panel").hide();
     return;
   }

  this.show = show;
  this.updateContextPanel = updateContextPanel;
}
function showPremiumNeed(){
  document.getElementById('tooltip').classList.add('tooltipShow')
}