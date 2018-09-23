// Desktop and tablet
$('.browse')
  .popup({
    inline     : true,
    hoverable  : true,
    position   : 'bottom center',
    delay: {
      show: 300,
      hide: 300
    }
  })
;

// Mobile
$(document).ready(function(){
	$(".right.menu.open").on("click",function(e){
        e.preventDefault();
		$(".ui.vertical.menu").transition("fade", function(){
      $(this).toggle();
    })
	});
    
	$(".ui.dropdown").dropdown();
});

$("#first-button").delay(500).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
$("#second-button").delay(600).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
$("#third-button").delay(700).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});

$(".ui.vertical.menu").toggle();

$('.flash-segment').delay(5000).css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.0});
$('.staff-role-popup').popup({on: 'hover'});