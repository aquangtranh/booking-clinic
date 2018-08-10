var statusColor = ['#ffc107', '#007bff', '#28a745', '#dc3545'];

function updateAppointmentStatus(slug, appointmentId, status, callback) {
  $.ajax({
    url: '/admin/' + slug + '/appointments/' + appointmentId,
    type: 'PATCH',
    cache: false,
    data: {status: status},
  })
  .done(function (res) {
    callback();
  });
}

function createExamination(slug, data, callback) {
  $.ajax({
    url: '/admin/' + slug + '/examinations',
    type: 'POST',
    cache: false,
    data: data,
  })
  .done(function (res) {
    callback(res);
  });
}

$(".status-select").click(function() {
$(this).css("background-color",statusColor[$(this).val()]);
});

$(document).ready(function() {
  $("#flash").delay(3000).slideUp();
  $(".status-select").each(function() {
    $(this).css("background-color",statusColor[$(this).val()]);
  });
});
