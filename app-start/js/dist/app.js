$(document).ready(function() {
	window.homePage = new Home()
	window.homePage.show();
})



var Home = function() {
	this.id = 'home';
	this.domElem = $('#home');
	this.cta = this.domElem.find('.cta');
};
Home.prototype.show = function() {
	this.bind()
	this.domElem.fadeIn();
};
Home.prototype.hide = function() {
	this.domElem.fadeOut();
};
Home.prototype.bind = function() {
	var that = this;
	this.cta.on('click', function(e){
		e.preventDefault();
		that.hide();
		$('#the-movie').fadeIn(function(){
			$('#the-movie .content').addClass('visible');
			setTimeout(function(){
				$('#the-movie .cta').fadeIn();
			}, 200);
		});
	
	})
}
var TheMovie = function() {
	this.id = 'theMovie';
	this.domElem = $('#the-movie');
	this.cta = this.domElem.find('.cta');
}
TheMovie.prototype.show = function() {
	this.bind()
	this.domElem.fadeIn();
};
TheMovie.prototype.hide = function() {
	this.domElem.fadeOut();
};
TheMovie.prototype.bind = function() {
	var that = this;
	this.cta.on('click', function(e){
		e.preventDefault();

		that.domElem.fadeOut();
		$('header').fadeOut()

		$('#trailer').fadeIn(function(){
			$('#trailer video')[0].play();
		});
	})
}
$(document).ready(function(){
	var movie = $('#the-movie');
	var header = $('header');
	var trailer = $('#trailer');
	var video = $('#trailer video')[0];

	function quitVideo(){
		video.pause();
		trailer.fadeOut(function(){
			video.currentTime = 0;
			video.volume = 1;
			$('#trailer .sound').removeClass('mute')
		});
		movie.fadeIn(function(){
			
			header.fadeIn();

		})
	}

	$(window).on('keyup', function(e){
		if (trailer.is(':visible')){
			if (e.keyCode == 27){
				quitVideo()
			} else if (e.keyCode == 37) {
				if (video.currentTime >= video.duration) {
					video.currentTime -= 5;
					video.play()
				} else {
					video.currentTime -= 5;	
				}
			} else if (e.keyCode == 39) {
				video.currentTime += 5;
			} else if (e.keyCode == 40) {
				//baisser le volume
				if (video.volume <= 0.1) {
					video.volume = 0;
					$('#trailer .sound').addClass('mute');
				} else {
					video.volume -= 0.1;	
				}
			} else if (e.keyCode == 38) {
				//hausser le volume
				if (video.volume >= 0.9) {
					video.volume = 1;
				} else if (video.volume == 0) {
					$('#trailer .sound').removeClass('mute');
					video.volume += 0.1;	
				} else {
					video.volume += 0.1;	
				}
			} else if(e.keyCode == 32){
				if (video.paused) {
					video.play();
				} else {
					video.pause();
				}
			}
		}
	})

	$('#trailer .close').on('click', function(e){
		e.preventDefault();
		quitVideo();
	})

	$('#trailer .sound').on('click', function(e){
		e.preventDefault();
		if ($(this).hasClass('mute')){
			$(this).removeClass('mute');
			video.volume = 1;
		} else {
			$(this).addClass('mute');
			video.volume = 0;
		}
		
	})

	$('#trailer video').on('timeupdate', function(e){
		var currentTime = video.currentTime;
		var maxTime = video.duration;
		var percentTimeSpent = currentTime/maxTime * 100;
		$('#trailer .progress').css('width', percentTimeSpent + '%');
	})

	$('#trailer video').on('ended', quitVideo);
})