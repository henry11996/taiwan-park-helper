console.log("readme loaded")

$("input[name='chk[]']:checkbox").each(function () {
  if (!$(this).is(":checked")) {
    $(this).parent().next().css("background-color", "yellow")
  }
})


$("<div id='check-all'> 👌 </div>").insertBefore($('td:contains("管理自治條例")'))

$("#check-all").on("click", function () {
  $("input[name='chk[]']:checkbox").each(function () {
    if (!$(this).is(":checked")) {
      $(this).trigger("click")
    }
  })
})