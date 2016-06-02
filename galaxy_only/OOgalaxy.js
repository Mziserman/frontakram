var Galaxy = function(data) {

	this.init(data);

};

Galaxy.prototype.init = function(data) {
	this.data = data.artist;

	this.width = 500;
	this.height = 500;

	this.centerPosition = {
		'x': this.width/2,
		'y': this.height/2
	}

	this.sortStatistic = "followers";

	this.scale = {};
	this.setScales();

	this.canvas = d3.select('.galaxyContainer')
		.append('canvas')
		.attr('width', this.width)
		.attr('height', this.height);
	this.ctx = this.canvas.node().getContext('2d')

	this.interface = d3.select("body").append("custom:interface")
	    .attr("width", this.width)
	    .attr("height", this.height)

	this.createCustomInterface();

};

Galaxy.prototype.setScales = function(accessor) {

	this.scale.planetRadius = d3.scale.linear()
		.domain([0, this.getMax(this.data, this.sortStatistic)])
		.range([0, 100]);

	this.scale.planetOrbit = d3.scale.linear()
		.domain([this.getMin(this.data, this.sortStatistic), this.getMax(this.data, this.sortStatistic)])
		.range([0, this.data.length])


};

Galaxy.prototype.createCustomInterface = function() {

	var self = this;

	this.interface
		.selectAll("planet")
		.data(this.data)
			.enter().append("custom:planet")
		.attr("radius", function(d) {return self.scale.planetRadius(d[self.sortStatistic])})
		.attr("orbit", function(d, i) {return i})

};

Galaxy.prototype.updateInterface = function() {

	var self = this;

	// Scale the range of the data again 

	this.scale.planetOrbit.domain()
	this.scale.planetRadius.domain()

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    
}

Galaxy.prototype.draw = function() {

	var self = this;

	d3.select('interface')
		.selectAll('planet')
		.each(function(e) {
			console.log(this)
			console.log(e)
		})

}

Galaxy.prototype.getMax = function(obj, accessor) {

	for (var i = 0; i < obj.length; i++) {
		if (i > 0) {
			if (obj[i][accessor] > currentMax) {
				currentMax = obj[i][accessor];
			}
		} else {
			var currentMax = obj[i][accessor];
		}
	};
	return currentMax;	
};
Galaxy.prototype.getMin = function(obj, accessor) {
	for (var i = 0; i < obj.length; i++) {
		if (i > 0) {
			if (obj[i][accessor] < currentMin) {
				currentMin = obj[i][accessor]
			}
		} else {
			var currentMin = obj[i][accessor];
		}
	};
	return currentMin;
};
Galaxy.prototype.rotateStar = function(position, angle) {
	var x = position.x;
	var y = position.y;

	var centerX = this.centerPosition.x;
	var centerY = this.centerPosition.y;

	var newX = Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY) + centerX;
	var newY = Math.sin(angle) * (x - centerX) - Math.cos(angle) * (y - centerY) + centerY;

	return {'x': newX, 'y': newY};
};
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
		{
			'name': 'henriete',
			'followers': 218
		},
		{
			'name': 'henro',
			'followers': 80
		},
	]
};
var galaxy = new Galaxy(data);