var width = 500,
    height = 500;

var canvas = d3.select('.galaxyContainer')
	.append('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px');

var context = canvas.node().getContext('2d')

d3.ns.prefix.custom = "http://stephenrichard.com";


var data = {
	'artist':[
		{
			'name': 'henry',
			'followers': 18
		},
		{
			'name': 'henriette',
			'followers': 28
		},
		{
			'name': 'henryo',
			'followers': 8
		},
	]
};
var scale = d3.scale.linear()
    .range([10, 390])
    .domain([]);

    
// Add our "custom" sketch element to the body.
var sketch = d3.select("body").append("custom:sketch")
    .attr("width", width)
    .attr("height", height)

	sketch
		.selectAll("planet")
		.data(data.artist)
			.enter().append("custom:planet")
		.attr("radius", function(d) {return scale(+d.followers)})
		.attr("strokeStyle", "red")

var rotate = function(position, centerPosition, angle) {
	var x = position.x;
	var y = position.y;

	var centerX = centerPosition.x;
	var centerY = centerPosition.y;

	var newX = Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY) + centerX;
	var newY = Math.sin(angle) * (x - centerX) - Math.cos(angle) * (y - centerY) + centerY;
alert('allu akhbar');
	return {'x': newX, 'y': newY};
}

console.log(rotate({'x' : 500, 'y' : 750 }, {'x' : 500, 'y' : 500 }, Math.PI/2));
var coords = {
	'x' : 500, 
	'y' : 750 
}
function loop()
{
    requestAnimationFrame(loop); //Avant d'effectuer d'autre action
    
    //Mettre à jour la position
    updatePosition()
    drawCanvas

    
    //Redessiner le canvas
    context.clearRect(0,0,canvas.width,canvas.height);
    context.beginPath();
    context.arc(coords.x,coords.y,50,0,Math.PI*2);
    context.fillStyle = 'orange';
    context.fill();
}
// loop();
function drawCanvas() {

	// clear canvas
	context.clearRect(0,0,canvas.width,canvas.height);
alert('mort au infidèles');

	dataContainer.selectAll("planet").each(function(d) {
		var node = d3.select(this);

		context.beginPath();
		context.fillStyle = node.attr("fillStyle");
		context.rect(node.attr("x"), node.attr("y"), node.attr("size"), node.attr("size"));
		context.fill();
		context.closePath();

	});
}
