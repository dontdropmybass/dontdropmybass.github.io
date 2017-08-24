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

});