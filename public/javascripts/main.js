var sock = new SockJS(window.location.origin + '/channel');

sock.onmessage = function(e) {
  var mock = JSON.parse(e.data);
  $('.view').hide();
  $('.loader').show();
  $('.mock').load(function() {
    $('.loader').hide();
    $('.view').fadeIn();
  });
  populateHotspots(mock.hotspots);
  $('.mock').attr('src', mock.src);
};
sock.onclose = function() {
    console.log('close');
};

$(function() {
  $('.view').on('click', '.hotspot', function(e) {
    sock.send($(this).attr('data-next'));
  });

  $('.back').click(function() {
    sock.send('back');
  });
});

function populateHotspots(hotspots) {
  var i;
  $('.hotspots').empty();
  for (i = 0; i < hotspots.length; i++) {
    $('.hotspots').append(createHotspotEl(hotspots[i]));
  }
}

function createHotspotEl(hotspot) {
  var hotspotEl = $('<div/>').addClass('hotspot').css({
    left: hotspot.x,
    top: hotspot.y,
    height: hotspot.height,
    width: hotspot.width
  }).attr('data-next', hotspot.next);

  return hotspotEl;
}

