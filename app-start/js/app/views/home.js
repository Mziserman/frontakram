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