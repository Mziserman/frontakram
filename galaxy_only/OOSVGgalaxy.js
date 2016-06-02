var Galaxy = function(data) {

	this.init(data);

};

Galaxy.prototype.init = function(data) {

	this.data = this.formatData(data);

	this.width = 500;
	this.height = 500;

	this.centerPosition = {
		'x': this.width/2,
		'y': this.height/2
	}

	this.sortStatistic = "worksCount";

	this.scale = {};
	this.setScale(this.data);

	this.svg = d3.select('.galaxyContainer')
		.append('svg')
		.attr('width', this.width)
		.attr('height', this.height);

	this.drawGalaxy(this.data);

};

Galaxy.prototype.swapSortStatistic = function(sortStatistic) {

	this.sortStatistic = sortStatistic;
	this.setScale(this.data);
	$('svg').empty();
	this.drawGalaxy(this.data);

};

Galaxy.prototype.filter = function(filter) {

	var filterData = []

	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].theme == filter) {
			filterData.push(this.data[i])
		}
	}

	this.filterData = filterData;

	this.setScale(this.filterData);
	$('svg').empty();
	this.drawGalaxy(this.filterData)
}

Galaxy.prototype.updateData = function(data) {

	this.data = this.formatData(data);
	this.setScale(this.data);
	$('svg').empty();
	this.drawGalaxy(this.data)

};

Galaxy.prototype.formatData = function(data) {

	var formattedData = []

	for (var key in data) {
		if (data.hasOwnProperty(key)){
			formattedData.push({})
			formattedData[formattedData.length - 1].name = key

			for (var i = 0; i < data[key].works.length; i++) {
				if (i > 0) {
					if (data[key].works[i].year > lastWork) {
						lastWork = data[key].works[i].year;
					}
				} else {
					var lastWork = data[key].works[i].year;
				}
			}

			formattedData[formattedData.length - 1].lastWork = lastWork;
			formattedData[formattedData.length - 1].allWorksCount = data[key].worksCount;
			formattedData[formattedData.length - 1].worksCount = data[key].works.length;
			formattedData[formattedData.length - 1].theme = data[key].theme;
		}
	}
	
	for (var i = 0; i < formattedData.length; i++) {

		if (i == 0) {

			var yearMap = [];
			yearMap[formattedData[i].lastWork] = 1;

		} else {

			if (yearMap[formattedData[i].lastWork]) {

				yearMap[formattedData[i].lastWork]++

			} else {

				yearMap[formattedData[i].lastWork] = 1

			}
		}
	}

	for (var i = 0; i < formattedData.length; i++) {

		if (i == 0) {

			var angle = []
			var count = []

			angle[formattedData[i].lastWork] = 360 / yearMap[formattedData[i].lastWork];
			formattedData[i].position = 0;
			count[formattedData[i].lastWork] = 1;

		} else {

			if (!angle[formattedData[i].lastWork]) {

				angle[formattedData[i].lastWork] = 360 / yearMap[formattedData[i].lastWork];
				formattedData[i].position = 0;
				count[formattedData[i].lastWork] = 1;

			} else {

				formattedData[i].position = count[formattedData[i].lastWork] * angle[formattedData[i].lastWork]
				count[formattedData[i].lastWork]++

			}

		}
	}

	return formattedData
}

Galaxy.prototype.setScale = function(data) {

	var self = this;

	this.scale.planetRadius = d3.scale.linear()
		.domain([0, this.getMax(data, this.sortStatistic)])
		.range([2, (this.width/2)/15]);

};

Galaxy.prototype.drawGalaxy = function(data) {

	var self = this;

	this.drawOrbits();

	this.svg
		.append('circle')
		.attr("r", 3)
		.attr("cx", function(d) {return self.centerPosition.x})
		.attr("cy", function(d) {return self.centerPosition.y})

	this.svg
		.selectAll(".planet")
		.data(data)
			.enter().append("circle")
		.attr("class", "planet")
		.attr("r", function(d) {return self.scale.planetRadius(d[self.sortStatistic])})
		.attr("cx", function(d) {return self.centerPosition.x})
		.attr("cy", function(d) {return self.centerPosition.y - (d.lastWork - 2007) * (self.width/2)/6})
		.attr("fill", "blue")
		.attr("stroke", "black")
		.attr("stroke-width", 3)
		.attr("transform", function(d) {return "rotate(" +d.position+ " " +self.centerPosition.x+ " " +self.centerPosition.y+ ")"})

};

Galaxy.prototype.drawOrbits = function() {

	var self = this;
	for (var i = 5; i >= 0; i--) {
		this.svg
			.append('circle')		
			.attr("class", "orbit")
			.attr("r", i * (self.width/2)/6)
			.attr("cx", self.centerPosition.x)
			.attr("cy", self.centerPosition.y)
			.attr("stroke", "black")
			.attr("stroke-width", 1)
	}
	
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

var data = {
    "Robert Ball": {
        "id": 4,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "robertmball.com"
        ],
        "presentation": "Graphiste le jour et supergeek la nuit, Robert Ball vit et travaille à Londres. Passionné dès son plus jeune âge par Star Wars ainsi que par les comics de Marvel et de 2000 AD, il met depuis son style graphique géométrique au service de ses héros favoris.",
        "quote": "J'ai vu Star Wars pour la première fois au cinéma à l'âge de 5 ans. À partir de ce moment je suis devenu geek.",
        "works": [
            {
                "url": "robertball/batbloke.jpg",
                "year": 2008,
                "name": "Batbloke"
            },
            {
                "url": "robertball/captainamerica.jpg",
                "year": 2011,
                "name": "Captain America"
            },
            {
                "url": "robertball/dalek.jpg",
                "year": 2012,
                "name": "Dalek"
            },
            {
                "url": "robertball/superbloke.jpg",
                "year": 2011,
                "name": "Superbloke"
            },
            {
                "url": "robertball/fiftybaddies.jpg",
                "year": 2011,
                "name": "Fifty Baddies"
            },
            {
                "url": "robertball/fiftygoodies.jpg",
                "year": 2011,
                "name": "Fifty Goodies"
            }
        ]
    },
    "Nicky Barkla": {
        "id": 5,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "nickybarkla.deviantart.com"
        ],
        "presentation": "Jeune artiste autralienne de vingt ans, Nicky Barkla est fachée avec le noir et le blanc. Elle apprécie particulièrement les personnages méchants et bizarre du Geekdom, car elle peut, à sa manière, les rendre un peu moins sombres...\" Pour moi, utiliser ces personnages iconiques n'a rien à voir avec le plagiat ; il s'agit de rendre hommage et de faire évoluer de manière créative des icônes qui vivront pour toujours.",
        "quote": "C'est comme poser un chapeau de clown sur la tête de Dark Vador et lui demander de s'amuser un peu.",
        "works": [
            {
                "url": "nickybarkla/aclownmess.jpg",
                "year": 2011,
                "name": "A clown mess"
            },
            {
                "url": "nickybarkla/darthmaul.jpg",
                "year": 2012,
                "name": "Darth Maul"
            },
            {
                "url": "nickybarkla/edwardscissorhands.jpg",
                "year": 2011,
                "name": "Edwars Scissorhands"
            },
            {
                "url": "nickybarkla/emmettdocbrown.jpg",
                "year": 2011,
                "name": "Superbloke"
            },
            {
                "url": "nickybarkla/gollum.jpg",
                "year": 2011,
                "name": "Gollum"
            },
            {
                "url": "nickybarkla/incrediblehulk.jpg",
                "year": 2011,
                "name": "Fifty Goodies"
            },
            {
                "url": "nickybarkla/thejoker.jpg",
                "year": 2012,
                "name": "The Joker"
            },
            {
                "url": "nickybarkla/voldemort.jpg",
                "year": 2012,
                "name": "Voldemort"
            }
        ]
    },
    "Beyx": {
        "id": 6,
        "worksCount": 136,
        "theme": "videogames",
        "url": [
            "beyx.tumblr.com"
        ],
        "presentation": "Beyx a grandi dans le Connecticut où son amour pour les jeux vidéos et le cinéma a définitivement forgé son caractère geek. Il réside aujourd'hui à New York.",
        "quote": "En grandissant, je me suis rendu compte qu'il n'y avait rien de mieux qu'une histoire bien écrite, accompagnée d'un univers et de personnages complexes et profonds. La marque de fabrique des univers geek.",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "Batman"
            },
            {
                "url": "",
                "year": 2011,
                "name": "TMNT"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Wallmaster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Pika surf"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Boo!"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Mario Suits"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Bubble Bobble"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Sonic Dudes"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Luchadores"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Clown Car"
            },
        ]
    },
    "Steve Bialik": {
        "id": 7,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "stevapalooza.blogspot.com"
        ],
        "presentation": "Résidant à New York, Steve Bialik a deux passions: Star Wars et l'art asiatique. Quand on sait que Georges Lucas a été influencé visiblement et narrativement par les films de samurais des années 1950-1960, l'art de Steve prend tout son sens...",
        "quote": "Comics, jeux vidéo, fantasy, SF... Maintenant que ces univers ont cessé d'être considérés comme enfantins, nous sommes enfin libres de les apprécier à leur juste valeur.",
        "works": [
            {
                "url": "",
                "year": 2010,
                "name": "The Gangster"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Invasion of the Death Palace"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Admiral"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Emperor"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Smuggler"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Robots"
            },
            {
                "url": "",
                "year": 2011,
                "name": "SpaceWalker"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Master"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Akuma"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Hermit"
            },
        ]
    },
    "Barrett Biggers": {
        "id": 8,
        "worksCount": 136,
        "theme": "videogames",
        "url": [
            "barrettbiggers.com"
        ],
        "presentation": "Barrett Biggers est un artiste autodidacte diplômé de Biologie. Très influencé par les animes japonais et les jeux 8-bits, il cite comme proncipales influences H.R Giger, Yoshitaka Amano et Hayao Miyazaki. Il travaille et réside en Floride aux États-Unis.",
        "quote": "Quelque part en chacun de nous se cache un geek.",
        "works": [
            {
                "url": "",
                "year": 2012,
                "name": "Proud Link Geek"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Here Lies Mario"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Lupus Hylian"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Samus Aran and the Metroid"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Triforce"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Hylian Shields"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Pride of the Forest"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Red Potion"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Tingle's The Rupees of Hyrule Kingdom"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Save Zebes! Metroid Propaganda."
            },
            {
                "url": "",
                "year": 2012,
                "name": "Midna"
            }
        ]
    },
    "Boneface": {
        "id": 9,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "bone-face.blogspot.com",
            "boneface.co.uk"
        ],
        "presentation": "Boneface raconte qu'il vient d'une autre dimension, et que son repaire secret se trouve quelque part sous les terres désolées de Liverpool. Son travail a fait le tour du monde, de San Francisco à Sydney, et s'inspire des schémas",
        "quote": "Ne demandez pas ce qui se cache sous les masques.",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "Crack"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Zing"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Smack!"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Soc!"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Thudd!"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Whump!"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Over my Dead Body"
            },
            {
                "url": "",
                "year": 2011,
                "name": "I have the power"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Ghostbusters 2"
            },
        ]
    },
    "Franco Brambilla": {
        "id": 10,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "francobrambilla.com"
        ],
        "presentation": "Illustrateur italien vivant à Milan, Franco Brambilla produit chaque année des dizaines d'illustrations centrées sur la science-fiction. Passionné par la SF sous toutes ses formes, son travail le plus remarqué sur le net est sa série \"Invading the Vintage\", dans lequel des héros et des icônes de cet univers envahissent de vieilles cartes postales.",
        "quote": "J'ai grandi dans les années 1970-1980...La science-fiction était partout.",
        "works": [
            {
                "url": "",
                "year": 2008,
                "name": "Our Lord of Darkness"
            },
            {
                "url": "",
                "year": 2008,
                "name": "Imperial Rodeo"
            },
            {
                "url": "",
                "year": 2009,
                "name": "AT-AT Lido Cup!"
            },
            {
                "url": "",
                "year": 2008,
                "name": "We sell Used Cars and Droids"
            },
            {
                "url": "",
                "year": 2009,
                "name": "Dagobaths au Printemps"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Changing of the guard"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Millennium Honeymoon Florence"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Millennium Honeymoon Benevento"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Imperial Minigolf Final Exam"
            },
            {
                "url": "",
                "year": 2011,
                "name": "I hate summer"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The galactic Tea of love"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Hoth Pleasures... Last ski run"
            }
        ]
    },
    "Brazer Liam": {
        "id": 11,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "liambrazier.com"
        ],
        "presentation": "Dessinateur depuis son plus jeune âge, Liam Brazier est ravi que tous ses gribouillis d'enfants lui permettent aujourd'hui de vivre de son art. Inspiré par ses souvenirs et la culture populaire, il espère pouvoir continuer ainsi très longtemps. Liam Brazier vit à Londres.",
        "quote": "Je dessine ce que j'aime : c'est plus simple, plus amusant, et basé sur plus de trente ans de souvenirs et de bonheur.",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "Guard"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Cave Man"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Dark Lord"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Man Up"
            },
            {
                "url": "",
                "year": 2012,
                "name": "Man made"
            },
            {
                "url": "",
                "year": 2012,
                "name": "R & R"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Bounty Hunter"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Mad Man"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Golden One"
            }
        ]
    },
    "Brogan Glen": {
        "id": 12,
        "worksCount": 136,
        "theme": "videogames",
        "url": [
            "albinoraven.com"
        ],
        "presentation": "Glen Brogan est un illustrateur américain vivant à Huntington, en Virginie-Occidentale. Son travail tourne essentiellement autour des icônes de la culture populaire, qu'il aime retravailler avec son propre style inspiré des cartoons. Il est régulièrement exposé dans des galeries du monde entier.",
        "quote": "La plupart des gens finissent par se dire qu'ils sont trop vieux pour les cartoons. Je n'en suis pas encore là.",
        "works": [
            {
                "url": "",
                "year": 2010,
                "name": "As days go by"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Are you getting enough oxygen?"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Bottle Fairy"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Daylight Come"
            },
            {
                "url": "",
                "year": 2011,
                "name": "The great shelled dragon"
            },
            {
                "url": "",
                "year": 2010,
                "name": "Super Hellboy Bros"
            },
            {
                "url": "",
                "year": 2010,
                "name": "KFC Mario"
            },
            {
                "url": "",
                "year": 2010,
                "name": "The Blue Door"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Big Apple, 3am"
            },
            {
                "url": "",
                "year": 2011,
                "name": "The legend of Zelda"
            },
            {
                "url": "",
                "year": 2010,
                "name": "A True Peace in Space"
            },
            {
                "url": "",
                "year": 2011,
                "name": "April Fools"
            }
        ]
    },
    "Brunet Jérémie": {
        "id": 13,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "behance.net/imerj"
        ],
        "presentation": "Citant comme source d'inspiration le design Nordique, le graphisme des années 1960 et le mouvement minimaliste, Jérémy Brunet est un directeur artistique français vivant à PAris. Créatif dans la publicité, il profite de son temps libre pour mêler sa passion pour le graphisme et les univers du Geekdom.",
        "quote": "Le Geek-Art est pour moi le moyen de continuer à m'amuser avec les personnages qui m'ont accompagné toute mon enfance.",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Dardevil"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Iron Man"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Superman"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Batman"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Cyclops"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Venom"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Human Torch"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Mister Fantastic"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - The Thing"
            },
            {
                "url": "",
                "year": 2011,
                "name": "FLAT HEROES - Invisible Woman"
            },
        ]
    },
    "James Burlinson": {
        "id": 14,
        "worksCount": 136,
        "theme": "videogames",
        "url": [
            "burlisaurus.co.uk",
            "burlisaurus.trumblr.com"
        ],
        "presentation": "James Burlinson est un illustrateur et graphiste britannique vivant à Brighton. Aussi loin que remontent ses souvenirs, il a toujours eu un crayon à la main, dessinant très jeune ses héros préférés, ou recopiant les personnages de boîtes de céréales. Aujourd'hui, son style reconnaissable entre mille lui permet d'assouvir ses pulsions de fanboy tout en continuant à vivre de son art...",
        "quote": "Un geek, c'est quelqu'un qui est passionné par quelque chose... Sauf qu'il s'agit souvent d'une chose que peu de gens connaissent !",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "MOgwai (Gremlins)"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Pug Fuel (Men in Black)"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Workplace Rivalry"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Mario Machine (Super Mario)"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Z (Legend of Zelda)"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Dance, Magic, Dance (Labyrinth)"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Time for Adventure (Adventure TIme)"
            }
        ]
    },
    "Emma Butler": {
        "id": 15,
        "worksCount": 136,
        "theme": "film",
        "url": [
            "emma-butler.com"
        ],
        "presentation": "Née en Nouvelle-Zélande, Emma Butler, designer et graphiste, vit au Canada. Attirée par la typographie et notamment par le travail de Jessica Hirsche, Jay Roeder et l'incontournable Saul BAss, Emma décide de se lançer : après avoir observé en spectatrice la mode des posters minimalistes sur le net, elle apporte sa propre contribution à l'édifice avec des posters à la gloire de ses films préférés.",
        "quote": "Après avoir trouvé le style graphique de la série, il m'a fallu trouver les objets cultes et propres à chaque film sur lequel je voulais travailler, ce qui s'est avéré la partie la plus amusante !",
        "works": [
            {
                "url": "",
                "year": 2011,
                "name": "Back to the Future Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Forest Gump Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Jurassic Park Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Mighty Ducks Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Anchorman Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Juno Movie Parts Poster"
            },
            {
                "url": "",
                "year": 2011,
                "name": "Top Gun Movie Parts Poster"
            }
        ]
    }
}
var data2 = {
    "Ingrid Aspöck": {
        "id": 1,
        "worksCount": 1,
        "theme": "film",
        "url": [
            "ingrid-aspoeck.at",
            "i-doodles.blogspot.com"
        ],
        "presentation": "Diplômée des Arts Appliqués de Vienne, en Autriche, où elle réside, Ingrid Aspöck est une illustratrice et graphiste freelance. Fortement ispirée par la culture populaire des années 1980 et par les heures passées devant son ordinateur, elle rend hommage à cette époque avec les cartes de voeux de fin d'année destinées à ses clients.",
        "quote": "Les passions de notre enfance finissent par ressurgir à l'âge adulte",
        "works": [
            {
                "url": "ingridaspock/christmas01.jpg",
                "year": 2010,
                "name": "Christmas Peace"
            },
            {
                "url": "ingridaspock/christmas02.jpg",
                "year": 2010,
                "name": "Christmas Peace"
            },
            {
                "url": "ingridaspock/christmas03.jpg",
                "year": 2010,
                "name": "Christmas Peace"
            },
            {
                "url": "ingridaspock/christmas04.jpg",
                "year": 2010,
                "name": "Christmas Peace"
            },
            {
                "url": "ingridaspock/christmas05.jpg",
                "year": 2010,
                "name": "Christmas Peace"
            }
        ]
    },
    "Avanaut": {
        "id": 2,
        "worksCount": 1,
        "theme": "film",
        "url": [
            "flickr.com/photos/avanaut"
        ],
        "presentation": "Avanaut nous vient d'Helsinki, en Finlande, et c'est naturellement qu'il s'est intéréssé à la planète Hoth. Graphiste freelance depuis quelques années, passionné de photographie et de l'univers de Star Wars, son travail sur la gamme LEGO dédiée à la saga de Georges Lucas est devenu un incontournable du Geek-Art. Son secret pour rendre l'atmosphère de cette planète ? Photographier ses sujets dans un aquarium !",
        "quote": "J'ai récemment retrouvé une photo vieille de trente ans : celle d'un Y-Wing que j'avais construit moi-même avec des LEGO, étant enfant. J'imagine que je suis Geek depuis cette époque...",
        "works": [
            {
                "url": "avanaut/breakinginthetauntaun.jpg",
                "year": 2010,
                "name": "Breaking in the Tauntaun"
            },
            {
                "url": "avanaut/briefingonhoth.jpg",
                "year": 2009,
                "name": "Briefing on Hoth"
            },
            {
                "url": "avanaut/damnit.jpg",
                "year": 2009,
                "name": "Damn it, Marcus ! This ain't the map of Nepal"
            },
            {
                "url": "avanaut/guyswearelost.jpg",
                "year": 2009,
                "name": "Guys, I think we took a wrong turn somewhere"
            },
            {
                "url": "avanaut/stormstrooperperpetualwinter.jpg",
                "year": 2009,
                "name": "Stormtroopers' Perpetual Winter"
            },
            {
                "url": "avanaut/thearrivalofastardestroyer.jpg",
                "year": 2011,
                "name": "The Arrival of a Star Destroyer"
            },
            {
                "url": "avanaut/thederelict.jpg",
                "year": 2011,
                "name": "The Derelict"
            },
            {
                "url": "avanaut/theinconvenientflaw.jpg",
                "year": 2009,
                "name": "The inconvenient flaw of a Y-Wing"
            },
            {
                "url": "avanaut/thelongandwindingdays.jpg",
                "year": 2009,
                "name": "The long and winding days on echo station 3-T-8"
            }
        ]
    },
    "Andy Awesome": {
        "id": 3,
        "worksCount": 1,
        "theme": "series",
        "url": [
            "andyawesome.com",
            "3x9.org"
        ],
        "presentation": "Andy Awesome, de son véitable nom Jan Schlösser, vit à Munich, en Allemagne. Il partage son enfance entre les Tortues Ninja et sa Game Boy, et multiplie les séjours artistiques organiséspar sa mère à Paris et en Italie. Il prend aujourd'hui un malin plaisir à mettre son style graphique au service des héros de son enfance.",
        "quote": "J'aime à penser que mon travail fait remonter nos souvenirs d'enfance à la surface",
        "works": [
            {
                "url": "awesomeandy/seriesid01.jpg",
                "year": 2009,
                "name": "Series 01-ID01"
            },
            {
                "url": "awesomeandy/seriesid02.jpg",
                "year": 2009,
                "name": "Series 01-ID02"
            },
            {
                "url": "awesomeandy/seriesid03.jpg",
                "year": 2009,
                "name": "Series 01-ID03"
            },
            {
                "url": "awesomeandy/seriesid04.jpg",
                "year": 2009,
                "name": "Series 01-ID04"
            },
            {
                "url": "awesomeandy/seriesid05.jpg",
                "year": 2009,
                "name": "Series 01-ID05"
            },
            {
                "url": "awesomeandy/seriesid06.jpg",
                "year": 2009,
                "name": "Series 01-ID06"
            },
            {
                "url": "awesomeandy/seriesid07.jpg",
                "year": 2009,
                "name": "Series 01-ID07"
            },
            {
                "url": "awesomeandy/seriesid08.jpg",
                "year": 2009,
                "name": "Series 01-ID13"
            },
            {
                "url": "awesomeandy/seriesid09.jpg",
                "year": 2009,
                "name": "Series 01-ID16"
            },
            {
                "url": "awesomeandy/seriesid10.jpg",
                "year": 2009,
                "name": "Series 01-ID18"
            },
            {
                "url": "awesomeandy/seriesid11.jpg",
                "year": 2009,
                "name": "Series 01-ID19"
            },
            {
                "url": "awesomeandy/seriesid12.jpg",
                "year": 2009,
                "name": "Series 02-ID09"
            },
            {
                "url": "awesomeandy/seriesid12.jpg",
                "year": 2009,
                "name": "Series 02-ID10"
            }
        ]
    }
}

var galaxy = new Galaxy(data);