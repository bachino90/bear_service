$(document).ready(function() {
  $('input#deleteCornerButton').click(function (){
    $(this).parent().remove();
  });

  $('#addCornerButton').click(function (){
    $('#corners').append("<div class='corner'><input type='text' placeholder='x' value='' id='x'><input type='text' placeholder='y' value='' id='y'><input type='button' value='Delete Corner' id='deleteCornerButton'></br></div>");
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
    }
    $.put(url,{'layout':JSON.stringify(corner)},function(data){
      $('layout').append(JSON.stringify(data));
    },'json');
  });
});
