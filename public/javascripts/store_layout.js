Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function drawGrid() {
  var c = $('#canvas_layout');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();
  c.attr('width', $(container).width()); //max width
  c.attr('height', $(container).height()); //max height

  var canvas = document.getElementById("canvas_layout");
  var context = canvas.getContext("2d");
  var origin_x = 0.0;
  var origin_y = 30.0;
  var scale = 50.0;
  var delta = 50.5;
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  var max = Math.max(canvasWidth, canvasHeight);
  var numberOfRules = parseInt(max/scale) + 1;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.beginPath();
  context.lineWidth=0.2;

  for (var i=1;i<=numberOfRules;i++) {
    context.moveTo(delta,0);
    context.lineTo(delta, canvasHeight);

    context.moveTo(0,delta);
    context.lineTo(canvasWidth, delta);

    delta += scale;
  }
  context.stroke();
}


$(document).ready(function() {
  /*
  //Get the canvas &
  var c = $('#canvas_layout');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();
  //Run function when browser resizes
  $($('#canvas_layout').parent()).resize(respondCanvas);

  function respondCanvas(){
    var w = $($('#canvas_layout').parent()).width();
    var h = $($('#canvas_layout').parent()).height();
    c.attr('width', $(container).width()); //max width
    c.attr('height', $(container).height()); //max height
    //Call a function to redraw other content (texts, images etc)
    drawGrid();
  }
  //Initial call
  respondCanvas();

  $('input#deleteCornerButton').click(function (){
    $(this).parent().parent().remove();
  });

  $('button#editLayoutButton').click(function(){
    respondCanvas();
  });
  */
  $('#addCornerButton').click(function (){
    $('#corners').append("<div class='col-lg-12'>"+
      "<div class='col-sm-5' style='margin-bottom:15px;'>"+
        "<div class='input-group'>"+
          "<div class='input-group-addon'>X</div>"+
          "<input type='text' class='form-control' id='x' value='' placeholder='1' name='store_name' required>"+
        "</div>"+
      "</div>"+
      "<div class='col-sm-5' style='margin-bottom:15px;''>"+
        "<div class='input-group'>"+
          "<div class='input-group-addon'>Y</div>"+
          "<input type='text' class='form-control' id='y' value='' placeholder='1' name='store_name' required>"+
        "</div>"+
      "</div>"+
      "<div class='col-sm-2' style='margin-bottom:15px;'>"+
        "<input type='button' class='btn btn-danger' value='Delete' id='deleteCornerButton'>"+
      "</div>"+
    "</div>");
    var buttons = $('input#deleteCornerButton');
    buttons.click(function (){
      $(this).parent().parent().remove();
    });
  });

  $('#editLayoutSubmit').click(function (){
    var url = "";
    var data = new Object();
    var corners = new Array();
    var corners_x = $('input#x').map(function (){
      return $( this ).val();
    }).get();
    var corners_y = $('input#y').map(function (){
      return $( this ).val();
    }).get();
    for (var i=0;i<corners_x.length;i++) {
      var corner = new Object();
      corner.x = corners_x[i];
      corner.y = corners_y[i];
      corners[i] = corner;
    }
    $.ajax({
      url: url,
      type: 'PUT',
      data: {'layout':JSON.stringify(corners)},
      success: function(data) {
        $('layout').append(JSON.stringify(data));
      }
    })
  });

  $('#generateView').click(function(){
    var canvas = document.getElementById("canvas_layout");
    var context = canvas.getContext("2d");
    var origin_x = 30.5;
    var origin_y = 30.5;
    var corners_x = $('input#x').map(function (){
      return parseInt($( this ).val());
    }).get();
    var corners_y = $('input#y').map(function (){
      return parseInt($( this ).val());
    }).get();

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    context.beginPath();
    context.lineWidth=2;
    context.moveTo(origin_x + corners_x[0], origin_y + corners_y[0]);

    var maxX = corners_x.max();
    var maxY = corners_y.max();

    var scale = canvas.height/(2*origin_x + maxX);//1;

    for (var i=1;i<corners_x.length;i++) {
      var x = origin_x + corners_x[i] * scale;
      var y = origin_y + corners_y[i] * scale;
      context.lineTo(x, y);
    }
    context.stroke();

  });
});
