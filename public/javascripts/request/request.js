$(document).ready(function() {
  $('#deleteBeaconButton').click(function (){
    $(this).parent().remove();
  });

  $('#addBeaconButton').click(function (){
    $('#beacons').append("<div class='beacon'><input type='text' placeholder='FULL ID' value='11111111-1111-1111-1111-111111111111' name='full_uuid' id='full_uuid'><input type='text' placeholder='RSSI' value='-75' name='rssi' id='rssi'><input type='button' value='Delete Beacon' id='deleteBeaconButton'></br></div>");
  });

  $('#sendButton').click(function (){
    var url = '/api/v1/'+$('input#url').val();
    var data = new Object();
    var beacons = new Array();
    data.device_os = $('input#device_os').val();
    data.device_uuid = $('input#device_uuid').val();
    var uuid_beacons = $('input#full_uuid').map(function (){
      return $( this ).val();
    }).get();
    var rssi_beacons = $('input#rssi').map(function (){
      return $( this ).val();
    }).get();
    for (var i=0;i<uuid_beacons.length;i++) {
      beacons[uuid_beacons[i]]=rssi_beacons[i];
    }
    data.beacons = beacons;

    var request = $.ajax({
      type: 'POST',
      url: url,
      data: data
    });
    request.done(function(data){
      $('code').append(data);
    });

  });
});
