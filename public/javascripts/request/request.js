$(document).ready(function() {
  $('input#deleteBeaconButton').click(function (){
    $(this).parent().remove();
  });

  $('#addBeaconButton').click(function (){
    $('#beacons').append("<div class='beacon'><input type='text' placeholder='FULL ID' value='11111111-1111-1111-1111-111111111111' id='full_uuid'><input type='text' placeholder='Major ID' value='1' id='major_id'><input type='text' placeholder='Minor ID' value='1' id='minor_id'><input type='text' placeholder='RSSI' value='-75' id='rssi'><input type='button' value='Delete Beacon' id='deleteBeaconButton'></br></div>");
    var buttons = $('input#deleteBeaconButton');
    buttons.click(function (){
      $(this).parent().remove();
    });
  });

  $('#sendButton').click(function (){
    var url = '/api/v1/'+$('input#url').val();
    var data = new Object();
    var beacons = new Array();
    var uuids = new Array();
    var rssis = new Array();
    data.device_os = $('input#device_os').val();
    data.device_uuid = $('input#device_uuid').val();
    var uuid_beacons = $('input#full_uuid').map(function (){
      return $( this ).val();
    }).get();
    var majors_ids = $('input#major_id').map(function (){
      return $( this ).val();
    }).get();
    var minors_ids = $('input#minor_id').map(function (){
      return $( this ).val();
    }).get();
    var rssi_beacons = $('input#rssi').map(function (){
      return $( this ).val();
    }).get();
    for (var i=0;i<uuid_beacons.length;i++) {
      var new_beacon = new Object();
      new_beacon.full_uuid = uuid_beacons[i]+'-'+majors_ids[i]+'-'+minors_ids[i];
      new_beacon.rssi = rssi_beacons[i];
      beacons[i] = new_beacon;
      uuids[i] = uuid_beacons[i]+'-'+majors_ids[i]+'-'+minors_ids[i];
      //rssis[i] = rssi_beacons[i];
    }
    data.beacons = beacons;
    data.uuids = uuids;
    //data.rssis = rssis;
    $.post(url,{'data':JSON.stringify(data)},function(data){
      $('code').append(JSON.stringify(data));
    },'json');
  });
});
