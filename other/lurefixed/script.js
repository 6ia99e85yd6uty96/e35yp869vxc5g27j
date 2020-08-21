/*! lurefixed */
$(document).ready(function () {
    var h = $(".lurefixed").offset().top;
    //var object1 = $("#hdr");
    var object2 = $("#lurebottom");
    var show = false;
    $(window).scroll(function () {
        if ($(window).scrollTop() > h && show === false) {
            //object1.fadeIn();
            object2.fadeIn();
            show = true;
        }
    });
});
