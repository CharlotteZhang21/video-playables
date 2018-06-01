import * as ContainerUtil from '../utils/container-util';

class ProjectileGame extends Phaser.Group {
	/*
    args:
     + src: reference to the asset to be used
     + amount: how many projectile are generated 
     + direction: where do they face
     + container: htmlTag of the container to fit the button in
    */

	constructor(game, args) {
		super(game);

		this.initSignals();

		this.MINIMUM_SWIPE_LENGTH = 10;

		this.containerName = args.container;

		this.getContainerInfo();

		this.projectiles = [];

		this.createProjectiles(args.src, args.amount, args.direction);

		this.interactionDuration = args.interactionDuration;	

		this.triggered = false;


		this.createInteractionArea();


		// this.onSuccess.dispatch();
	}

	initSignals() {
		this.onSuccess = new Phaser.Signal();
		this.onFail = new Phaser.Signal();
	}

	getContainerInfo() {
		this.containerWidth = ContainerUtil.getContainerWidth(this.containerName);
		this.containerHeight = ContainerUtil.getContainerHeight(this.containerName);
		this.x = ContainerUtil.getContainerX(this.containerName);
		this.y = ContainerUtil.getContainerY(this.containerName);

	}

	createInteractionArea() {
		var graphics = this.game.add.graphics(0,0);

		graphics.beginFill(0x000000, .3);
		
		graphics.drawRect(
			0,0, 
			this.containerWidth, 
			this.containerHeight);

		this.interactionArea = graphics;

		this.interactionArea.inputEnabled = true;
		this.interactionArea.input.useHandCursor = true;
		
		this.interactionArea.events.onInputDown.add(this.onDown, this);

		//FAKE IT FOR NOW T_T
        this.interactionArea.events.onInputUp.add(this.onUp, this);
        
        //THIS IS THE CORRECT ONE
        // this.game.input.addMoveCallback(function(){
        // 	this.checkCollision(this.projectiles[0]);
        // }, this);

		this.add(this.interactionArea);

	}

	createProjectiles(src, amount, direction) {

		
		for (var i = 0; i < amount; i++) {

			var projectile = new Phaser.Sprite(this.game, 0, 0, src);
			this.add(projectile);

			projectile.scale.x = this.containerWidth / 1.5 / projectile.width;
			projectile.scale.y = projectile.scale.x;

			projectile.x = this.game.global.windowWidth + projectile.width;
			// projectile.x = this.x + this.containerWidth; 

			// var projectile_y = ContainerUtil.getRandomYWithinContainer(this.containerName);
			projectile.y = this.containerHeight/amount * i ;

			switch(direction) {
				case 'inverse':
					projectile.scale.x *= -1;
					break;
				case 'random': 
					projectile.scale.x *= Math.floor(Match.random() * 2 - 1);//generates -1 and 1 randomly
					break;
				case 'same':
					projectile.scale.x *= 1;
				default:
					console.log('please set the projectile direction');

			}

			// this.game.physics.arcade.enable(projectile);

			this.projectiles.push(projectile);


		}
	}

	// 1st parameter determines the distance of the active pointer. My swipe distance trashhold is 150, you can play around with this value
	// in order to get a better feeling.
	// So basicly what you do is look for a certain distance (150) in a given time frame (min 100ms till 250ms).function 
	
	checkCollision(obj) {

		 if(this.startSwipePoint == undefined)
		 	return false;

		var swipeLength;
	    
	    this.endSwipePoint = new Phaser.Point(this.game.input.activePointer.position.x, this.game.input.activePointer.position.y);
	   
	    swipeLength = Phaser.Point.distance(this.endSwipePoint, this.startSwipePoint);

	    if (swipeLength >= this.MINIMUM_SWIPE_LENGTH) { 
	    	this.swipe = new Phaser.Line(this.startSwipePoint.x, this.startSwipePoint.y, this.endSwipePoint.x, this.endSwipePoint.y);
	    	
	    	var l1 = new Phaser.Line(obj.x, obj.y, obj.x + obj.width, obj.y); // - t

	    	var l2 = new Phaser.Line(obj.x, obj.y, obj.x, obj.y + obj.height); // | l

	    	var l3 = new Phaser.Line(obj.x + obj.width, obj.y, obj.x + obj.width, obj.y + obj.height); // | r

	    	var l4 = new Phaser.Line(obj.x, obj.y + obj.height, obj.x + obj.width, obj.y + obj.height); // _ b 
	
			var intersection = this.swipe.intersects(l1, true) || this.swipe.intersects(l2) || this.swipe.intersects(l3) || this.swipe.intersects(l4);
			



			this.game.debug.geom( l1, 'rgba(255,0,0,1)' ) ;
		    this.game.debug.geom( l2, 'rgba(255,255,0,1)' ) ;

		    this.game.debug.lineInfo(l1, 32, 32);
    		this.game.debug.lineInfo(l2, 32, 100);
		    this.game.debug.geom( this.swipe, 'rgba(255,255,255,1)' ) ;

		    console.log(obj);
		    console.log(this.swipe);
	    	// var intersection = this.swipe.intersects(obj);
	    	// this.game.physics.arcade.enable(this.swipe);


	    	// console.log(this.game.physics.arcade.intersects(this.swipe, obj));
	  //   	intersection = obj.overlap(this.swipe);
			console.log(this.swipe.intersects(l1, true)); 
	    }
		
 
	}

	onUp() {

		// var swipeLength, cut;
	    
	 //    this.endSwipePoint = new Phaser.Point(this.game.input.activePointer.position.x, this.game.input.activePointer.position.y);
	 //    swipeLength = Phaser.Point.distance(this.endSwipePoint, this.startSwipePoint);
	 //    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {

	 //        // cut = new objNinja.Cut(this, "cut", {x: 0, y: 0}, {group: "cuts", start: this.start_swipe_point, end: this.end_swipe_point, duration: 0.3, style: cut_style});
	 //        this.swipe = new Phaser.Line(this.start_swipe_point.x, this.start_swipe_point.y, this.end_swipe_point.x, this.end_swipe_point.y);
	 //    }

	    // for (var i = 0; i < this.projectiles.length; i++) {
	    // 	var projectile = this.projectiles[i];
	    // 	intersection = this.swipe.intersects(projectile);	  
	    // }
		  
        if(Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown) > 150 ) {
        	if(this.game.input.activePointer.position.y < this.swipeCoord.y) {
        		this.updateProjectiles('up');
        		this.game.time.events.remove(this.failListener);
        		this.onSuccess.dispatch(this);
        	}else {
        		this.updateProjectiles('down');
        		this.game.time.events.remove(this.failListener);
        		this.onSuccess.dispatch(this);
        	}
        }
	}

	onDown() {

		this.startSwipePoint = new Phaser.Point(this.game.input.activePointer.position.x, this.game.input.activePointer.position.y);

		this.swipeCoord = {
			x: this.game.input.activePointer.position.x,
			y: this.game.input.activePointer.position.y
		}
	}

	updateProjectiles(direction) {
		switch(direction) {

			case 'up' :
				for (var i = 0; i < this.projectiles.length; i++) {
					var projectile = this.projectiles[i];
					var p_angle = this.angle;
					this.game.add.tween(projectile).to({y: -1000, angle: [p_angle += 120]}, 1000, Phaser.Easing.Linear.out, true, 100 * i);
		
				}
				break;
			case 'down' :
				for (var i = 0; i < this.projectiles.length; i++) {
					var projectile = this.projectiles[i];
					var p_angle = this.angle;
					this.game.add.tween(projectile).to({y: this.game.global.windowHeight + 1000 , angle: [p_angle -=120]}, 1000, Phaser.Easing.Linear.out, true, 100 * i);
				}
				
		}
	}
	


	hide() {
    	if (this.alpha > 0)
        	this.alpha = 0;
    }

    show() {
    	if (this.alpha < 1)
    		this.alpha = 1;

    	if(!this.triggered)
    		this.fly();
    }

    fly() {
    	this.triggered = true;

    	var tweens = [];

    	for (var i = 0; i < this.projectiles.length; i++) {

    		var projectile = this.projectiles[i];

    		this.game.add.tween(projectile).to({
    			x: this.x
    		}, this.interactionDuration/2, Phaser.Easing.Linear.In, true, 1000 + 100 * i ).onComplete.add(function (projectile){
    			projectile.alpha = 0;
    		});

    		//play explosion ani when tween finished

    		console.log("interactionDuration" + this.interactionDuration);

    	}

    	this.failListener = this.game.time.events.add(this.interactionDuration * 2, function(){
			this.onFail.dispatch(this);
		},this);

    	// for (var i = 0; i < tweens.length; i++) {
    	// 	tweens[i].onComplete.add(function(){
    	// 		this.projectiles[i].alpha = 0;
    	// 	},this);
    	// }
    	

    }

    disable() {

    	if (this.interactionArea.inputEnabled)
    		this.interactionArea.inputEnabled = false;

    	for (var i = 0; i < this.projectiles.length; i++) {
    		var projectile = this.projectiles[i]

    		if (projectile.inputEnabled)
    			projectile.inputEnabled = false;
    	}

    	this.hide();
    }

    enable() {
    	//area swipable
    	
    	if (!this.interactionArea.inputEnabled)
    		this.interactionArea.inputEnabled = true;

    	// for (var i = 0; i < this.projectiles.length; i++) {
    	// 	var projectile = this.projectiles[i];
    	// 	// if (!projectile.inputEnabled)
    	// 	// 	projectile.inputEnabled = true;
    	// 	this.game.physics.arcade.enable(projectile);
    	// }
    	
    	this.show();
    }

}

export default ProjectileGame;