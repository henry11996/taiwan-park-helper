console.log("readme loaded")

$("input[name='chk[]']:checkbox").each(function () {
  if (!$(this).is(":checked")) {
    $(this).trigger("click")
    $(this).parent().next().css("background-color", "yellow")
  }
})

