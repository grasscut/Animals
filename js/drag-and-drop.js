var curBackground = '';
var curBackgroundUrl = '';

var windowWidth = $(window).width();
var windowHeight = $(window).height();
var windowRatio = windowHeight/windowWidth;

var screenshot = true;

$(document).ready(function() {

	var tipAdd = false;
	var tipScreenshot = false;
	var tipNoScreenshot = false;

	$('#main').css('width', windowWidth);
	$('#main').css('height', windowHeight);
	
	$('#tip').modal();
	
	$('#tipClose button').click(function() {
		$('#toolsHeader').popover({content: 'Click here to start your artwork', placement: 'bottom'});
		$('#toolsHeader').popover('show');
	});
	
	var background = $("#background").val();
	$('#main').html('<img id="backgroundImg" src="img/backgrounds/'+background+'.jpg" />');
	$('#background').change(function() {
		background = $(this).val();
		if (background != 'custom') {
			curBackground = background;
			curBackgroundUrl = 'img/backgrounds/'+curBackground+'.jpg';
			$('#backgroundImg').attr('src', curBackgroundUrl);
			$('#screenshot img').css('opacity', '1.0');
			$('#screenshot').css('cursor', 'pointer');
			screenshot = true;
		} else {
			$('#addBackgroundModal').modal();
		}
	});
	
	
	
	$('#toolsHeader').click(function() {
		$(this).popover('destroy');
		
		var tools = $('#tools').css('top');
		if (tools == '0px') {
			$('#tools').animate({ "top": "-70%" }, "slow", function() {
				if (!tipScreenshot && screenshot) {
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
	
	$(document).mousedown(function() {
		if (tipAdd) {
			$('#tools').popover('destroy');
		}
		if ((tipScreenshot && tipNoScreenshot) || (tipScreenshot && screenshot) || (tipNoScreenshot)) {
			console.log('here');
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
	}, tolerance: "pointer"});
	
	$("#animals img").click(function () {
	
		$('#main').append($(this));
		$(this).css('z-index', '100');
		$(this).draggable({ containment: "body", scroll: false });
		$("#main img").mousedown(function () {
			$(this).css('background', 'rgba(245, 245, 245, 0.3)');
		});
		$("#main img").mouseup(function (event) {
			$(this).css('background', '');		
		});
	});
		
	$('#screenshot').click(function() {
		if (screenshot == true) {
			html2canvas($('#main'), {
				onrendered: function(canvas) {
					$('#screenshotTaken .modal-body').prepend(canvas);
					$('#screenshotTaken').modal();
				}
			});
		} else {
			$('#screenshot').popover({content: 'Feature not available with custom background', placement: 'bottom'});
			$('#screenshot').popover('show');
			tipNoScreenshot = true;
		}
	});

	$('#addBackground').click(function() {
		$('#addBackgroundModal').modal();
	});

	$('#addBackgroundModal').on('hidden.bs.modal', function () {
		$('input[name="url"]').val('');
		$('#addBackgroundAlert').css('display', 'none');
    	$('#backgroundImg').attr('src', curBackgroundUrl);
    	$('#background').val(curBackground);
	});

	$("#addBackgroundModal form").submit(function(event) {
 		event.preventDefault();
	});
});

function submitNewBackground() {
	var url = $('input[name="url"]').val();
	loadImage(url, function() {
		var imageWidth = this.width;
		var imageHeight = this.height;
		var aspectRatio = imageHeight/imageWidth;

		if (imageHeight >= 700 && imageWidth >= 1500) {
			if (aspectRatio > windowRatio) {
				$('#addBackgroundAlert').css('display', 'block');
				$('#addBackgroundAlert').html("The aspect ratio of your image is not suitable for your display. Try uploading a <b>wider</b> image.");
			} else {
				curBackground = 'custom';
				curBackgroundUrl = url;
				$('#addBackgroundModal').modal('hide');
				$('#screenshot img').css('opacity', '0.2');
				$('#screenshot').css('cursor', 'auto');
				screenshot = false;
			}
		} else {
			$('#addBackgroundAlert').css('display', 'block');
			$('#addBackgroundAlert').html("Your image is too small. The minimum dimensions allowed are <b>700&times;1500</b> px.");
		}
	}, function() {
		$('#addBackgroundAlert').css('display', 'block');
		$('#addBackgroundAlert').html("The URL you provided is invalid.");
	});
};

function loadImage(src, callback, error) {
    var image = new Image();
    image.onload = callback;
    image.onerror = error;
    image.src = src;
}