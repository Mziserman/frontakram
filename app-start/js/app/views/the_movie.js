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