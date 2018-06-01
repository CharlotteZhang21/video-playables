
import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';

class CollectibleCounter extends Phaser.Group {

	/*args = counter: {
            tag: 'coin-counter',
            htmlTag: 'coin-counter',
            iconSrc: 'coins',
            backgroundSrc: null, // counter's background source
            style: 'number', //choose among number, rectangle_progressbar, circle_progressbar 
        },
    */
	constructor(game, args) {
		super(game);

		this.currentValue = args.initialValue;
		this.maxValue = args.maxValue;
		this.minValue = args.minValue;

		this.args = args;

		this.getContainerInfo(this.args.htmlTag);

		if(this.args.backgroundSrc != null)
			this.createCounterBackground();


		this.visualStyle = args.style;

		switch(args.style) {
			case 'number':
				this.createNumberCounter();
				break;
			case 'rectangle_progressbar':
				this.createRectProgressBarCounter();
				break;
			case 'circle_progressbar':
				this.createCircleProgressBarCounter();
				break;	
			default:
				console.log("please set the counter style");
		}
				

		this.game.add.existing(this);

	}

	getContainerInfo(containerName){
		this.containerWidth = ContainerUtil.getContainerWidth(containerName);
		this.containerHeight = ContainerUtil.getContainerHeight(containerName);
		this.x = ContainerUtil.getContainerX(containerName);
		this.y = ContainerUtil.getContainerY(containerName);
	}


	createRectProgressBarCounter(){

		this.barFilling = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc + '-fill');
		this.add(this.barFilling);

		this.barFilling.anchor.set(0, .5);

		this.barFilling.x = this.counterBackground.x;
		this.barFilling.y = this.counterBackground.y + this.counterBackground.height/2;
		this.barFilling.scale.x = (this.counterBackground.width - this.barFilling.x) / this.barFilling.width;
		this.barFilling.scale.y = this.counterBackground.height / this.barFilling.height * .75;

		this.fullWidthFilling = this.barFilling.scale.x;

		if(this.maxValue != null)
			this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling;

		if(this.args.iconSrc != null) 
			this.createCounterIcon('outside');

	}


	createCircleProgressBarCounter(){

		this.barFilling = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc + '-fill');
		this.add(this.barFilling);

		this.barFilling.anchor.set(.5);
		this.barFilling.x = this.counterBackground.x + this.counterBackground.width / 2;
		this.barFilling.y = this.counterBackground.y + this.counterBackground.height / 2;
		this.barFilling.scale.x = this.counterBackground.width / this.barFilling.width;
		this.barFilling.scale.y = this.counterBackground.height / this.barFilling.height;

		//set the bar's initial point at "6:00" 
		this.maskAngle = {from: 90, to: 540};
        this.fullWidthFilling = this.maskAngle.to - this.maskAngle.from;

		this.arcMask = this.game.add.graphics(0, 0);

		var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;

        // //  Shapes drawn to the Graphics object must be filled.
        this.arcMask.beginFill(0xffffff);

        this.arcMask.arc(
            this.barFilling.x,
            this.barFilling.y,
            this.barFilling.width/2, 
            this.game.math.degToRad(stopsAngle),//this is the end point of the health bar
            this.game.math.degToRad(this.maskAngle.from), 
            true);

        //  And apply it to the Sprite
        this.barFilling.mask = this.arcMask;

        this.add(this.arcMask);
	}


	createNumberCounter() {

		this.fontSize = this.counterBackground.height * .5;

		var style = {
			font: "bold " + this.fontSize + "px ",
		};

		this.textField = new Phaser.Text(this.game, this.counterBackground.width * .7, this.counterBackground.height / 2, this.currentValue, style);
		this.add(this.textField);
		this.textField.anchor.set(0.5, 0.5);
		this.textField.align = 'center';
		this.textField.padding.set(this.fontSize/2, 0);
		
		if (PiecSettings.fontColor != null) {
			this.textField.stroke = "black";
			this.textField.strokeThickness = 2;
			this.textField.fill = PiecSettings.fontColor;
			this.textField.setShadow(2,3,'rgb(0,0,0)', 0);
		} else {
			this.textField.stroke = "#ff9d1b";
			this.textField.strokeThickness = 5;

			var gradient = this.textField.context.createLinearGradient(0, 0, 0, this.textField.height);
			gradient.addColorStop(0, '#fffea5');
			gradient.addColorStop(1, '#ffab02');

			this.textField.fill = gradient;
		}

		if(this.args.iconSrc != null)
			this.createCounterIcon('contain');
		
	}

	createCounterIcon(iconPos) {


		this.counterIcon = new Phaser.Sprite(this.game, 0, 0, this.args.iconSrc);
		this.add(this.counterIcon);
		this.counterIcon.anchor.set(.5);

		//perhaps needs to change .7 to a value that we can tweak
		

		if(iconPos == 'contain') {
			this.counterIcon.scale.x = this.counterBackground.height * .7 / this.counterIcon.height;
			this.counterIcon.x  = this.counterBackground.x + this.counterIcon.width ;
		}else if (iconPos == 'outside') {

			this.counterIcon.scale.x = this.counterBackground.height * .7 / this.counterIcon.height;
			this.counterIcon.x = this.counterBackground.x - this.counterIcon.width ;

		}

		this.counterIcon.scale.y = this.counterIcon.scale.x;
		this.counterIcon.y  = this.counterBackground.y + this.counterBackground.height / 2;

	
	}

	createCounterBackground() {
		this.counterBackground = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc);
		this.add(this.counterBackground);

		this.counterBackground.scale.x = this.containerWidth / this.counterBackground.width;
		this.counterBackground.scale.y = this.counterBackground.scale.x;		

	}

	changeCounterTo(value, duration) {

		
		var speed = this.calcSpeedFromDuration(value, duration);
		
		switch(this.visualStyle) {
			
			case 'number':

				this.changeNumTo(value, speed);

				/*========= animation effects ==========*/
				
				var scaleEffect = 1.4;

				var tween = this.game.add.tween(this.textField.scale).to( {x: scaleEffect,y: scaleEffect}, duration * 1/5, Phaser.Easing.Linear.None, true, duration * 1/3);
				tween.onComplete.add(function() {
					this.game.add.tween(this.textField.scale).to( {x: 1, y: 1}, duration * 1/5, Phaser.Easing.Linear.None, true, 0);
				}, this);

				/*========= animation effects end ==========*/

				break;
			
			case 'rectangle_progressbar':
				this.changeRectBarTo(value, speed);
				
				break;
			
			case 'circle_progressbar':
				
				this.changeCircleBarTo(value, speed);
				
				break;		
		}

		
	}

	calcSpeedFromDuration(value, duration) {

		return Math.ceil(2.5 * Math.abs(value - this.currentValue)/(duration/10));
	}

	/** Recursive method, increases count until value has been reached every 10 ms, 
	by the amount specified in speed */
	changeNumTo(value, speed) {

		if(value > this.currentValue ){


			if(value >= this.maxValue) {
	            
	            this.currentValue = this.maxValue;  

	            if (PiecSettings.winCounterCommaSeparation != null && PiecSettings.winCounterCommaSeparation)
					this.textField.text = "" + Util.numberWithCommas(this.currentValue);
				else 
					this.textField.text = "" + this.currentValue;	// to be animate
				
	            return;    
	        
	        }
			
			if (this.currentValue < value) {
				this.currentValue += speed;
	
				if (this.currentValue > value)
					this.currentValue = value;
	
				this.game.time.events.add(10, function() {
	
					if (PiecSettings.winCounterCommaSeparation != null && PiecSettings.winCounterCommaSeparation)
						this.textField.text = "" + Util.numberWithCommas(this.currentValue);
					else 
						this.textField.text = "" + this.currentValue;	// to be animate
					
					if (this.currentValue < value) {
						this.changeNumTo(value, speed);
					}
				}, this);
			}

		}else {

			if(value < this.minValue) {
				
	            this.currentValue = this.minValue;  
	            if (PiecSettings.winCounterCommaSeparation != null && PiecSettings.winCounterCommaSeparation)
					this.textField.text = "" + Util.numberWithCommas(this.currentValue);
				else 
					this.textField.text = "" + this.currentValue;	// to be animate
				
	            return;    
	        
	        }

			if (this.currentValue > value) {
				this.currentValue -= speed;
	
				if (this.currentValue < value)
					this.currentValue = value;
	
				this.game.time.events.add(10, function() {
	
					if (PiecSettings.winCounterCommaSeparation != null && PiecSettings.winCounterCommaSeparation)
						this.textField.text = "" + Util.numberWithCommas(this.currentValue);
					else 
						this.textField.text = "" + this.currentValue;	// to be animate
					
					if (this.currentValue < value) {
						this.changeNumTo(value, speed);
					}
				}, this);
			}

		}
	}

	changeRectBarTo(value, speed) {

		if(value > this.currentValue){
				
			if(value > this.maxValue) {
	            
	            this.currentValue = this.maxValue;  
	            this.barFilling.scale.x = this.fullWidthFilling;
	            return;    
	        
	        }
	
			if (this.currentValue < value) {
				
				this.currentValue += speed;
	
				if (this.currentValue > value)
					this.currentValue = value;
	
	
				this.game.time.events.add(10, function() {
	
					this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling; // to be animate
	
					if (this.currentValue < value) {
						this.changeRectBarTo(value, speed);
					}
				}, this);

			}

		}else {

			if(value <= this.minValue) {
	            
	            this.currentValue = this.minValue;  
	            this.barFilling.scale.x = 0;
	            return;    
	        
	        }
	
			if (this.currentValue > value) {

				
				this.currentValue -= speed;
	
				if (this.currentValue < value)
					this.currentValue = value;
	
	
				this.game.time.events.add(10, function() {
	
					this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling; // to be animate
	
					if (this.currentValue < value) {
						this.changeRectBarTo(value, speed);
					}
				}, this);
				
			}

		}
	}

	changeCircleBarTo(value, speed) {

		if(value > this.currentValue){
			
			if(this.maskAngle.from > this.maskAngle.to) {
	                
	            this.barFilling.mask = null;
	            
	            this.arcMask.alpha = 0;
	              
	            this.maskAngle.from = this.maskAngle.to;
	
	            return;  
	        
	        }
	
			if (this.currentValue < value) {
				this.currentValue += speed;
	
				if (this.currentValue > value)
					this.currentValue = value;
	
				var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;
	
				this.game.time.events.add(10, function() { // TO BE ANIMATIED
					this.arcMask.arc(
			            this.barFilling.x,
			            this.barFilling.y,
			            this.barFilling.width/2, 
			            this.game.math.degToRad(stopsAngle),//this is the end point of the health bar
			            this.game.math.degToRad(this.maskAngle.from), 
			            true);
					if (this.currentValue < value) {
						this.changeCircleBarTo(value, speed);
					}
				}, this);
			}
		}else{
			//todo, decrease, so far the arc didn't change
			if (this.currentValue > value) {
				this.currentValue -= speed;
	
				if (this.currentValue < value)
					this.currentValue = value;

	
				var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;

				this.game.time.events.add(10, function() { // TO BE ANIMATIED
					this.arcMask.arc(
			            this.barFilling.x,
			            this.barFilling.y,
			            this.barFilling.width/2, 
			            this.game.math.degToRad(stopsAngle),//this is the end point of the health bar
			            this.game.math.degToRad(this.maskAngle.from), 
			            true);

					if (this.currentValue > value) {
						this.changeCircleBarTo(value, speed);
					}
				}, this);
			}

		}
	}

	hide() {
		this.alpha = 0;
	}

	show() {
		this.alpha = 1;
	}

	getXCoord() {
		//TODO
	}

	getYCoord() {
		//TODO
	}

}

export default CollectibleCounter;