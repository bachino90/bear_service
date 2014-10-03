$(document).ready(function() {
  $('input#deleteCornerButton').click(function (){
    $(this).parent().remove();
  });

  $('#addCornerButton').click(function (){
    $('#corners').append("<div class='corner'><input type='text' placeholder='x' value='' id='x' class='coordinate'><input type='text' placeholder='y' value='' id='y' class='coordinate'><input type='button' value='Delete Corner' id='deleteCornerButton'></br></div>");
    var buttons = $('input#deleteCornerButton');
    buttons.click(function (){
      $(this).parent().remove();
    });
  });

  $('#sendButton').click(function (){
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
    /*
    $.put(url,{'layout':JSON.stringify(corners)},function(data){
      $('layout').append(JSON.stringify(data));
    },'json');
    */
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
    var origin_x = 30.0;
    var origin_y = 30.0;
    var corners_x = $('input#x').map(function (){
      return $( this ).val();
    }).get();
    var corners_y = $('input#y').map(function (){
      return $( this ).val();
    }).get();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.lineWidth=2;
    context.moveTo(origin_x + parseInt(corners_x[0]), origin_y + parseInt(corners_y[0]));

    for (var i=1;i<corners_x.length;i++) {
      var x = origin_x + parseInt(corners_x[i]);
      var y = origin_y + parseInt(corners_y[i]);
      context.lineTo(x, y);
    }


    context.stroke();

  });
});
