
function processRequestData(data) {
  var request;
  $("#beaconTableBody").empty()
  for (var i = 0; i < data.length; i++) {
    request = data[i];
    var date = new Date(request.date);
    $("#beaconTableBody").append('<tr><th>'+request.client.name+
    '</th><th>'+request.store.store_name+
    '</th><th>'+request.beacon.beacon_name+
    '</th><th>'+request.rssi+
    '</th><th>'+date.toUTCString()+
    '</th><th></th><th>'+request.device_os+
    '</th><th>'+request.device_uuid+
    '</th></tr>');
  }
}

function loadAllRequest(fromDate, toDate) {
  var url = '/request/all';
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      processRequestData(data);
    }
  });
}

$(document).ready(function() {
  loadAllRequest();

  $('input#deleteBeaconButton').click(function (){
    $(this).parent().parent().remove();
  });

  $('#addBeaconButton').click(function (){
    $('#beacons').append("<div>"+
      "<div class='col-lg-8'>"+
        "<input type='text' class='form-control' placeholder='FULL UUID' value='11111111-1111-1111-1111-111111111111-1-1' id='full_uuid'>"+
      "</div>"+
      "<div class='col-lg-2'>"+
        "<input type='text' class='form-control' placeholder='RSSI' value='-75' id='rssi'>"+
      "</div>"+
      "<div class='col-lg-2'>"+
        "<input type='button' class='btn btn-danger' value='Delete' id='deleteBeaconButton'>"+
      "</div>"+
    "</div>");
    var buttons = $('input#deleteBeaconButton');
    buttons.click(function (){
      $(this).parent().parent().remove();
    });
  });

  $('#sendButton').click(function (){
    var url = '/api/v1/'+$('input#url').val();
    var data = new Object();
    var beacons = new Array();
    var uuids = new Array();
    data.device_os = $('input#device_os').val();
    data.device_uuid = $('input#device_uuid').val();
    data.test = $('input#test').val();
    var full_uuids = $('input#full_uuid').map(function (){
      return $( this ).val();
    }).get();
    var rssi_beacons = $('input#rssi').map(function (){
      return $( this ).val();
    }).get();
    for (var i=0;i<full_uuids.length;i++) {
      var new_beacon = new Object();
      new_beacon.full_uuid = full_uuids[i];
      new_beacon.rssi = rssi_beacons[i];
      beacons[i] = new_beacon;
      uuids[i] = full_uuids[i];
    }
    data.beacons = beacons;
    data.uuids = uuids;
    //data.rssis = rssis;
    var string = JSON.stringify(data);
    $.post(url,{'data':JSON.stringify(data)},function(data){
      $('code').empty().append(JSON.stringify(data));
      loadAllRequest();
    },'json');
  });
});
