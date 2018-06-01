function showMoreInfo(language) {
    $("#"+language+"-info").slideToggle();
}

let delay = 0;

$(function() {

    $("a").click(function(e) {
        if (this.hash !== "") {
            event.preventDefault();
            let hash = this.hash;
            $("#astar-text").slideUp();
            $("#kinshift-text").slideUp();
            $("#robot-text").slideUp();
            $("#warlizard-text").slideUp();
            $("#donation-text").slideUp();
            $(hash).delay(delay).slideDown(400, function() {
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function() {
                    window.location.hash = hash;
                    delay = 400;
                });
            });
        }
    });

    /*
    $("#astar").click(function(){
        $("#astar-text").show();
        $("#kinshift-text").hide();
        $("#robot-text").hide();
        $("#warlizard-text").hide();
    });

    $("#kinshift").click(function(){
        $("#astar-text").hide();
        $("#kinshift-text").show();
        $("#robot-text").hide();
        $("#warlizard-text").hide();
    });

    $("#robot").click(function(){
        $("#astar-text").hide();
        $("#kinshift-text").hide();
        $("#robot-text").show();
        $("#warlizard-text").hide();
    });

    $("#warlizard").click(function(){
        $("#astar-text").hide();
        $("#kinshift-text").hide();
        $("#robot-text").hide();
        $("#warlizard-text").show();
    });
    */
});