$(document).ready(function(){
	TweenMax.to('.rect', 1, {
		transform: 'scale(2)',
		backgroundColor: 'green',
		borderRadius: '50%',
		ease: Quart.easeOut,
		repeat: -1
	})

	TweenMax.fromTo('.round', 1, 
	{
		transform: 'scale(0)',
	},
	{
		transform: 'scale(1) rotate(180deg)',
		repeat: -1,
		borderRadius: 0,
		ease: Quart.easeOut
	})

	var tl = new TimelineMax();

	tl.fromTo('.intro', 0.5, 
	{
		transform: 'scaleX(0)',
		transform: 'scaleY(0.1)'
	},
	{
		transform: 'scaleX(1)'	
	})
})
