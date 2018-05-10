import * as Util from '../utils/util';
import Tile from '../prefabs/tile';
import Enemy from '../prefabs/enemy';
import ComboMessage from '../prefabs/combo-message';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class GameGrid extends Phaser.Group {
	constructor(game, enemy) {
		super(game);

		this.offsetX = 0;
		this.offsetY = 0;

		this.enemy = enemy;

		this.tiles = [];
		this.waffles = [];
		this.fitInContainer();
		this.addWaffles();
		this.createGameGrid();
		this.createGameGridBackground();
		this.createComboMessage();
		this.createHeros();
	}

	setCta(cta) {
		this.cta = cta;
		this.enemy.setCta(cta);
	}

	createGameGrid() {
		for (var i = 0; i < PiecSettings.grid.length; i++) {
			for (var j = 0; j < PiecSettings.grid[i].length; j++) {
				this.createTile(j,i,PiecSettings.grid[i][j]);
			}
		}
	}

	createGameGridBackground() {
		var container = document.getElementById("grid-background");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		this.heroesYPosition = containerHeight + containerY;

		this.gameGridBackground = this.game.add.sprite(containerX, containerY, 'grid-bg');
		this.gameGridBackground.scale.x = containerWidth / this.gameGridBackground.width;
		this.gameGridBackground.scale.y = this.gameGridBackground.scale.x;
		this.game.world.moveDown(this.gameGridBackground);
		this.gameGridBackground.alpha = 0.8;
	}

	createTile(xIndex,yIndex,tileName) {
		if (tileName != "") {
			var tile = new Tile(
					this.game,
					0,
					0,
					'pieces',
					tileName);

			tile.x = xIndex * PiecSettings.tileWidth + PiecSettings.tileWidth/2;
			tile.y = yIndex * PiecSettings.tileHeight + PiecSettings.tileHeight/2;
			tile.xIndex = xIndex;
			tile.yIndex = yIndex;
			tile.inputEnabled = true;
			tile.input.useHandCursor = true;
			tile.events.onInputDown.add(function() {
				this.game.onInteract.dispatch();
			}, this);

			tile.spriteName = tileName;

			this.tiles.push(tile);

			this.game.global.tileWidthAfterScaling = tile.width * this.scale.x;

			this.add(tile);
		}
	}

	fitInContainer() {

		// Scale to fit
		var containerWidth = document.getElementById("game-grid").offsetWidth;
		this.containerWidth = containerWidth;

		var scaleHorizontal = containerWidth / (PiecSettings.tileWidth * PiecSettings.grid[0].length) * window.devicePixelRatio;

		this.scale.x = scaleHorizontal;
		this.scale.y = scaleHorizontal;

		// Reposition to fit
		this.x = document.getElementById("game-grid").getBoundingClientRect().left * window.devicePixelRatio;
		this.y = document.getElementById("game-grid").getBoundingClientRect().top * window.devicePixelRatio;
	}

	createComboMessage() {
		this.combo2 = new ComboMessage(this.game, "combo-2");
		this.combo4 = new ComboMessage(this.game, "combo-4");
		this.combo5 = new ComboMessage(this.game, "combo-5");
		this.combo2.x = this.width/2;
		this.combo4.x = this.width/2;
		this.combo5.x = this.width/2;
		this.combo2.y = this.y;
		this.combo4.y = this.y;
		this.combo5.y = this.y;
		this.combo2.scale.x = (this.containerWidth * window.devicePixelRatio/2.5)/this.combo2.width;
		this.combo2.scale.y = this.combo2.scale.x;
		this.combo4.scale.x = (this.containerWidth * window.devicePixelRatio/2.5)/this.combo4.width;
		this.combo4.scale.y = this.combo4.scale.x;
		this.combo5.scale.x = (this.containerWidth * window.devicePixelRatio/2.5)/this.combo5.width;
		this.combo5.scale.y = this.combo5.scale.x;
	}

	createHeros() {
		console.log(this.gameGridBackground.height / window.devicePixelRatio);
		this.heroes = [];
		for (var i = 1; i <= 5; i++) {
			var hero = this.game.add.sprite(0,0,'hero-' + i);
			this.add(hero);
			hero.scale.x = (this.gameGridBackground.width) / (hero.width * this.scale.x) / 5;
			hero.scale.y = hero.scale.x;
			hero.x = (i - 1) * hero.width;
			hero.y = (this.gameGridBackground.height / this.scale.y) +
			(this.gameGridBackground.height / this.scale.y) * 0.07 ;
			this.heroes[i-1] = hero;
		}
	}

	destroyHeros() {
		for (var i = 0; i < this.heroes.length; i++) {
			this.heroes[i].destroy();
		}
	}

	addWaffles() {
		for (var i = 0; i < PiecSettings.waffles.length; i++) {
			var waffle = new Tile(
					this.game,
					0,
					0,
					'pieces',
					"waffle");
			waffle.xIndex = PiecSettings.waffles[i][0];
			waffle.yIndex = PiecSettings.waffles[i][1];
			waffle.scale.x = (PiecSettings.tileWidth * 1.1)/waffle.width;
			waffle.scale.y = waffle.scale.x;
			waffle.x = PiecSettings.tileWidth * PiecSettings.waffles[i][0] + PiecSettings.tileWidth/2 ;
			waffle.y = PiecSettings.tileHeight * PiecSettings.waffles[i][1] + PiecSettings.tileHeight/2;
			this.waffles.push(waffle);
			this.add(waffle);
		}
		
	}

	/*
	 * This function switches the two tiles specified in the settings file to create the final win
	*/
	solveGrid() {
		var newTile1XPos = -1;
		var newTile1YPos = -1;
		var newTile2XPos = -1;
		var newTile2YPos = -1;

		var tile1, tile2;

		var tile1Index, tile2Index;

		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].xIndex == PiecSettings.gridSolution.firstPiece[0] &&
				this.tiles[i].yIndex == PiecSettings.gridSolution.firstPiece[1]) {
				newTile2XPos = this.tiles[i].x;
				newTile2YPos = this.tiles[i].y;
				tile1 = this.tiles[i];
				tile1Index = i;
			}
			if (this.tiles[i].xIndex == PiecSettings.gridSolution.secondPiece[0] &&
				this.tiles[i].yIndex == PiecSettings.gridSolution.secondPiece[1]) {
				newTile1XPos = this.tiles[i].x;
				newTile1YPos = this.tiles[i].y;
				tile2 = this.tiles[i];
				tile2Index = i;
			}
		}

		this.tiles[tile1Index].xIndex = PiecSettings.gridSolution.secondPiece[0];
		this.tiles[tile1Index].yIndex = PiecSettings.gridSolution.secondPiece[1];

		this.tiles[tile2Index].xIndex = PiecSettings.gridSolution.firstPiece[0];
		this.tiles[tile2Index].yIndex = PiecSettings.gridSolution.firstPiece[1];

		if (newTile1XPos != -1 && newTile1YPos != -1 && newTile2XPos != -1 && newTile2YPos != -1) {
			var tile1Tween = this.game.add.tween(tile1).to({x: newTile1XPos, y: newTile1YPos}, 700, Phaser.Easing.Back.InOut, true, 0);
			var tile2Tween = this.game.add.tween(tile2).to({x: newTile2XPos, y: newTile2YPos}, 700, Phaser.Easing.Back.InOut, true, 0);
		} else {
			console.log("Grid Solution settings are wrong!");
		}

		// Solving grid!

		this.game.time.events.add(600, function() {
			this.explode(2,0);
			this.explode(2,1);
			this.explode(2,2);
			this.explode(3,1);
			this.explode(4,1);
			this.explode(5,1);

			this.sendUnits(2,0);
			this.game.time.events.add(50, function() {
				this.sendUnits(2,1);
				this.sendUnits(3,1);
				this.sendUnits(4,1);
				this.sendUnits(5,1);
			}, this);
			this.game.time.events.add(100, function() {
				this.sendUnits(2,2);
				this.game.world.bringToTop(this.combo2);
				this.combo2.animateIn();
			}, this);

			this.game.time.events.add(250, function() {
				this.dissapear(2,0);
				this.dissapear(2,1);
				this.dissapear(2,2);
				this.dissapear(3,1);
				this.dissapear(4,1);
				this.dissapear(5,1);
			}, this);
			this.game.time.events.add(1000, function() {
				this.createAndDrop("red", 2, 3, 0);
				this.game.time.events.add(100, function() {
					this.drop(3,2,1);
					this.drop(4,2,1);
					this.drop(5,2,1);
					this.createAndDrop("yellow", 2, 3, 1);
				}, this);
				this.game.time.events.add(200, function() {
					this.createAndDrop("purple", 2, 3, 2);
					this.createAndDrop("red", 3, 3, 2);
					this.createAndDrop("blue", 4, 3, 2);
					this.createAndDrop("red", 5, 3, 2);
					this.bringHerosToTop();
				}, this);
			}, this);
			this.game.time.events.add(2000, function() {
				this.explode(1,1);
				this.explode(2,1);
				this.explode(3,1);
				this.explode(4,0);
				this.explode(4,1);
				this.explode(4,2);

				this.sendUnits(4,0);
				this.game.time.events.add(50, function() {
					this.sendUnits(1,1);
					this.sendUnits(2,1);
					this.sendUnits(3,1);
					this.sendUnits(4,1);
				}, this);
				this.game.time.events.add(100, function() {
					this.sendUnits(4,2);
					this.game.world.bringToTop(this.combo4);
					this.combo4.animateIn();
				}, this);
				this.game.time.events.add(250, function() {
					this.dissapear(1,1);
					this.dissapear(2,1);
					this.dissapear(3,1);
					this.dissapear(4,0);
					this.dissapear(4,1);
					this.dissapear(4,2);
				}, this);
				this.game.time.events.add(1000, function(){
					this.createAndDrop("yellow",4,3,0);
					this.game.time.events.add(100, function() {
						this.drop(1,2,1);
						this.drop(2,2,1);
						this.drop(3,2,1);
						this.createAndDrop("blue",4,3,1);
					}, this);
					this.game.time.events.add(200, function() {
						this.createAndDrop("red", 4,3,2);
						this.createAndDrop("red", 3,3,2);
						this.createAndDrop("green", 2,3,2);
						this.createAndDrop("blue", 1,3,2);
						this.bringHerosToTop();
					}, this);
				}, this);
			}, this);
			this.game.time.events.add(3900, function() {
				this.explode(3,2);
				this.explode(4,2);
				this.explode(5,2);
				this.sendUnits(3,2);
				this.sendUnits(4,2);
				this.sendUnits(5,2);
				this.game.world.bringToTop(this.combo5);
				this.combo5.animateIn();
				this.game.time.events.add(250, function() {
					this.dissapear(3,2);
					this.dissapear(4,2);
					this.dissapear(5,2);
				}, this);
				this.game.time.events.add(1000, function() {
					this.createAndDrop("blue", 3,3,2);
					this.createAndDrop("purple", 4,3,2);
					this.createAndDrop("yellow", 5,3,2);
					this.bringHerosToTop();
				}, this);
			}, this);
		}, this);

	}

	explode(xIndex,yIndex){
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].xIndex == xIndex &&
				this.tiles[i].yIndex == yIndex) {
				// this.tiles[i].alpha = 0;
				var explosion = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[2], this);
				explosion.scale.x = PiecSettings.tileWidth * 1.8 / explosion.width;
				explosion.scale.y = explosion.scale.x;
				explosion.x = this.tiles[i].x - (explosion.width * 0.8)/2;
				explosion.y = this.tiles[i].y - (explosion.height * 0.8)/2;
			}
		}		
	}

	dissapear(xIndex, yIndex) {
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].xIndex == xIndex &&
				this.tiles[i].yIndex == yIndex) {
				var shieldAnim;
				switch(this.tiles[i].spriteName){
					case "blue":
						shieldAnim = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[4], this);
						break;
					case "red":
						shieldAnim = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[5], this);
						break;
					case "yellow":
						shieldAnim = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[6], this);
						break;
					default:
						shieldAnim = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[4], this);
						break;
				}
				shieldAnim.scale.x = this.tiles[i].scale.x;
				shieldAnim.scale.y = shieldAnim.scale.x;
				var newScaleFactor = 1.2;
				var newScale = newScaleFactor * shieldAnim.scale.x;
				shieldAnim.x = this.tiles[i].x - shieldAnim.width/2;
				shieldAnim.y = this.tiles[i].y - shieldAnim.height/2;
				var newPosX = this.tiles[i].x - (shieldAnim.width * newScaleFactor)/2;
				var newPosY = this.tiles[i].y - (shieldAnim.height * newScaleFactor)/2;

				var scaleTween = this.game.add.tween(shieldAnim.scale).to(
					{x: newScale, y: newScale},
					500,Phaser.Easing.Quadratic.Out, true, 0);
				var positionTween = this.game.add.tween(shieldAnim).to(
					{x: newPosX, y: newPosY},
					500,Phaser.Easing.Quadratic.Out, true, 0);
				var alphaTween = this.game.add.tween(shieldAnim).to(
					{alpha: 0},
					5000, Phaser.Easing.Quadratic.InOut, true, 1000);

				this.tiles[i].destroy();
				this.tiles.splice(i,1);
			}
		}
	}

	drop (xIndex, yIndex, newYIndex) {
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].xIndex == xIndex &&
				this.tiles[i].yIndex == yIndex) {
				var dropTween = this.game.add.tween(this.tiles[i]).to(
					{y: newYIndex * PiecSettings.tileHeight + PiecSettings.tileHeight/2}, 
					600, Phaser.Easing.Quadratic.Out, true, 0);
				this.tiles[i].yIndex = newYIndex;
			}
		}
	}

	createAndDrop(tileName, xIndex, yIndex, newYIndex) {
		var tile = new Tile(
					this.game,
					0,
					0,
					'pieces',
					tileName);

		tile.x = xIndex * PiecSettings.tileWidth + PiecSettings.tileWidth/2;
		tile.y = yIndex * PiecSettings.tileHeight + PiecSettings.tileHeight/2;
		tile.xIndex = xIndex;
		tile.yIndex = yIndex;
		tile.inputEnabled = true;
		tile.input.useHandCursor = true;
		tile.spriteName = tileName;

		this.game.global.tileWidthAfterScaling = tile.width * this.scale.x;

		this.tiles.push(tile);
		this.add(tile);
		this.drop(xIndex, yIndex, newYIndex);
	}

	bringHerosToTop() {
		this.destroyHeros();
		this.createHeros();
		for (var i = 0; i < this.heroes.length ; i++) {
			console.log(this.heroes[i]);
			this.game.world.bringToTop(this.heroes[i]);
		}
	}

	sendUnits(xIndex,yIndex){
		//Send blue units
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].xIndex == xIndex && this.tiles[i].yIndex == yIndex) {
				var units;
				switch (this.tiles[i].spriteName) {
					case "blue":
						units = this.game.add.sprite(0,0,'blue-units');	
						break;
					case "red":
						units = this.game.add.sprite(0,0,'red-units');	
						break;
					case "yellow":
						units = this.game.add.sprite(0,0,'yellow-units');	
						break;
					default:
						units = this.game.add.sprite(0,0,'blue-units');	
						break;
				}
				units.scale.x = 1.3 * (PiecSettings.tileWidth * this.scale.x)/units.width;
				units.scale.y = units.scale.x;
				var finalScale = units.scale.x;

				units.scale.x = 0.8 * units.scale.x;
				units.scale.y = units.scale.x;

				units.x = this.tiles[i].world.x - units.width/2;
				units.y = this.tiles[i].world.y - units.height/2;

				var finalPosX = this.tiles[i].world.x - units.width/2/0.8;
				var finalPosY = this.tiles[i].world.y - units.height/2/0.8;

				units.alpha = 0;
				var alphaTween = this.game.add.tween(units).to({alpha:1}, 200, Phaser.Easing.Quadratic.InOut, true, 400);
				var scaleTween = this.game.add.tween(units.scale).to({x:finalScale, y:finalScale}, 200, Phaser.Easing.Quadratic.InOut, true, 400);

				var positionFirstTween = this.game.add.tween(units).to({x: finalPosX, y: finalPosY}, 200, Phaser.Easing.Linear.None, true, 400);

				positionFirstTween.onComplete.add(function() {
					if (this.game.global.windowHeight > this.game.global.windowWidth) {
						this.game.add.tween(units).to({y: this.enemy.getEnemyYCenterPosition()}, 700, Phaser.Easing.Quadratic.In, true, 0);
					} else {
						this.game.add.tween(units).to({x: this.enemy.getEnemyXCenterPosition()}, 700, Phaser.Easing.Quadratic.In, true, 0);
					}
					this.game.time.events.add(700, function() {
						this.enemy.attacked();
					}, this);
				}, this);

				alphaTween.onComplete.add(function() {
					this.game.add.tween(units).to({alpha:0}, 200, Phaser.Easing.Quadratic.InOut, true, 700);
				}, this);
			}
		}

	}

	animate() {
		var tween = this.game.add.tween(this).to({y: this.game.global.windowHeight * window.devicePixelRatio + this.height}, 700, Phaser.Easing.Quadratic.InOut, true, 0);
		var tween = this.game.add.tween(this.gameGridBackground).to({y: this.game.global.windowHeight * window.devicePixelRatio + this.gameGridBackground.height}, 700, Phaser.Easing.Quadratic.InOut, true, 10);
	}

}

export default GameGrid;