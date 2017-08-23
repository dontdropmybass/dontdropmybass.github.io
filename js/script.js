function showMoreInfo(language) {
    $("#"+language+"-info").slideToggle();
}

$(function() {
    $("a").click(function(e) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
});