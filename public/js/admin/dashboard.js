var statusColor = ['#ffc107', '#007bff', '#28a745', '#dc3545'];

function updateStatus(slug, appointmentId, status, callback) {
    $.ajax({
      url: '/admin/' + slug + '/appointments/' + appointmentId,
      type: 'PATCH',
      cache: false,
      data: {status: status},
    })
    .done(function (res) {
      callback();
    });
  };

$(document).ready(function() {
  $("#flash").delay(3000).slideUp();
  $(".status-select").each(function() {
    $(this).css("background-color",statusColor[$(this).val()]);
  });
});
