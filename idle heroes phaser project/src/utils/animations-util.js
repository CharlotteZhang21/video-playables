export function onLoop(sprite, animation) {
	if (sprite.loopReverse) {
		sprite.animations.currentAnim.isReversed = true;
	}
	if (sprite.numberOfLoops == 1) {
		if (!sprite.persistent) {
			animation.loop = false;
			sprite.alpha = 0;
		} else {
			animation.loop = false;
		}
	} else if (animation.loopCount != 0 && animation.loopCount === sprite.numberOfLoops - 1){
		if (!sprite.persistent) {
			animation.loop = false;
			sprite.alpha = 0;
		} else {
			animation.loop = false;
		}
	}
}

export function playAnimation (game, sprite, delay, speed, loop, loopReverse) {
	sprite.loopReverse = loopReverse;
	sprite.speed = speed;
	if (sprite.loopReverse) {
		game.time.events.add(delay, function() {
			sprite.alpha = 1;
			sprite.animations.play('animation', speed, false);
			sprite.animations.currentAnim.onComplete.add(onComplete, this);
		});
	} else {
		game.time.events.add(delay, function() {
			console.log("play animation " + loop);
			sprite.alpha = 1;
			sprite.animations.play('animation', speed, loop);
		});
	}
}

export function onComplete(sprite, animation) {
	sprite.animations.currentAnim.isReversed = !sprite.animations.currentAnim.isReversed;
	sprite.animations.play('animation', sprite.speed, false);
}

export function playAnimations(spritesheet, xPositions, yPositions, delays, loops, anchor, speed, scale, persistent, container, game, layer) {
	var containerWidth = container.offsetWidth * window.devicePixelRatio;
	var containerHeight = container.offsetHeight * window.devicePixelRatio;
	var containerX = container.offsetLeft * window.devicePixelRatio;
	var containerY = container.offsetTop * window.devicePixelRatio;

	var hUnit = containerWidth/100;
	var vUnit = containerHeight/100;

	var animations = [];

	for (var i = 0; i < xPositions.length; i++) {
		var sprite = game.add.sprite( containerX + xPositions[i] * hUnit, containerY + yPositions[i] * vUnit, spritesheet);
		layer.add(sprite);
		sprite.anchor.set(anchor);
		sprite.animations.add('animation');
		sprite.alpha = 0;
		sprite.persistent = persistent;
		console.log("calling play animation, with loops " + loops);
		playAnimation(game, sprite, delays[i], speed, loops==1?false:true , false);
		sprite.scale.x = (containerWidth * scale[i] / 100) / sprite.width;
		sprite.scale.y = sprite.scale.x;
		animations.push(sprite);
	}

	return animations;
}