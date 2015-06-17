$(document).ready(function() {

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var tipAdd = false;
	var tipScreenshot = false;

	$('#main').css('width', windowWidth);
	$('#main').css('height', windowHeight);
	
	$('#tip').modal();
	
	$('#tipClose button').click(function() {
		$('#toolsHeader').popover({content: 'Click here to start your artwork', placement: 'bottom'});
		$('#toolsHeader').popover('show');
	});
	
	var background = $("#background").val();
	$('#main').html('<img id="backgroundImg" src="img/backgrounds/'+background+'.jpg" />');
	//$('#main').css("background-image", "url('img/backgrounds/"+background+".jpg')");
	//$('#main').css("background-size", "auto 100%");
	//$('#main').css("background-repeat", "no-repeat");
	$('#background').change(function() {
		background = $(this).val();
		$('#backgroundImg').attr('src', 'img/backgrounds/'+background+'.jpg');
		//$('#main').css("background-image", "url('img/backgrounds/"+background+".jpg')");
	});
	
	$('#toolsHeader').click(function() {
		$(this).popover('destroy');
		
		var tools = $('#tools').css('top');
		if (tools == '0px') {
			$('#tools').animate({ "top": "-70%" }, "slow", function() {
				if (!tipScreenshot) {
					$('#screenshot').popover({content: 'Click here to save your artwork to your gallery', placement: 'bottom'});
					$('#screenshot').popover('show');
					tipScreenshot = true;
				}
			});
			$('#toolsHeader').animate({"top": "0"}, "slow");
			$('#toolsHeader span').switchClass("glyphicon-triangle-top", "glyphicon-triangle-bottom");
			$('#screenshot').animate({ "top": "0" }, "slow");
		} else {
			$('#tools').animate({ "top": "0" }, "slow", function() {
				if (!tipAdd) {
					$('#tools').popover({content: 'Here you can change the <b>background</b> and <b>add</b> animals to your artwork by clicking on them. <br/>To <b>remove</b> an animal from your artwork drag it back here', html: true, placement: 'left'});
					$('#tools').popover('show');
					tipAdd = true;
				}
			});
			$('#toolsHeader').animate({"top": "70%"}, "slow");
			$('#toolsHeader span').switchClass("glyphicon-triangle-bottom", "glyphicon-triangle-top");
			$('#screenshot').animate({ "top": "-31px" }, "slow");
		}
	});
	
	$(document).click(function() {
		if (tipAdd || tipScreenshot) {
			$('#tools').popover('destroy');
			$('#screenshot').popover('destroy');
		}
	});
	
	$(window).resize(function() {
		if (tipAdd || tipScreenshot) {
			$('#tools').popover('destroy');
			$('#screenshot').popover('destroy');
		}
	});

	$('#animalsWrapper2').droppable({drop: function(event, ui) {
		$(this).append($(ui.draggable));
		$(ui.draggable).removeAttr('style');
	}});
	
	$("#animals img").click(function () {
	
		$('#main').append($(this));
		//$(this).css('position', 'absolute');
		$(this).css('z-index', '100');
		//$(this).css('left', '0');
		//$(this).css('top', '0');
		$(this).draggable({ containment: "body", scroll: false });
		$("#main img").mousedown(function () {
			$(this).css('background', 'rgba(245, 245, 245, 0.3)');
		});
		$("#main img").mouseup(function (event) {
			$(this).css('background', '');		
		});
	});
		
		
	$('#screenshot').click(function() {
		html2canvas($('#main'), {
			onrendered: function(canvas) {
				$('#screenshotTaken .modal-body').prepend(canvas);
				$('#screenshotTaken').modal();
			}
		});
	});
});