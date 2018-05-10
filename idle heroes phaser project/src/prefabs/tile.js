import * as Util from '../utils/util';

class Tile extends Phaser.Sprite {
	//key = symbols
	//frame = specific symbol name
	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);

		this.anchor.setTo(0.5, 0.5);
	}
	
}

export default Tile;