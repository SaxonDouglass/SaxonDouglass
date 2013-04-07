var ATRIUM_VOLUME = 30
var VENTRICLE_VOLUME = 40
var ATRIUM_RATE = ATRIUM_VOLUME * 3 / 1000
var VENTRICLE_RATE = VENTRICLE_VOLUME * 3 / 1000
var HALF_LIFE = 125
var REFILL_FACTOR = Math.log(1/2)/HALF_LIFE
var OXYGEN_MAX = 500
var OXYGEN_PER_PUMP_A = 5
var OXYGEN_PER_PUMP_V = 30
var OXYGEN_DECAY_PER_SEC = 2

// Volume = max_volume*(1 - exp(refill_factor*time))

cowop.Heart = enchant.Class.create(enchant.Sprite, {
    initialize: function(width, height, image, game, loseScene, oxyMeter, arteries) {
        enchant.Sprite.call(this, width, height);
        this.aorta = arteries.aorta;
        this.image = image;
        this.frame = 0;
        this.apumping = true;
        this.vpumping = true;
        this.alive = true;
        this.avol = 0;
        this.vvol = 0;
        this.ovol = OXYGEN_MAX - 100;
        this.pumpAtrium = function() {
            if (!this.apumping) {
                this.apumping = true;
                this.ovol -= OXYGEN_PER_PUMP_A;
                if (this.vpumping) {
                    this.frame = 3;
                } else {
                    this.frame = 2;
                }
            }
        }
        this.pumpVentricle = function() {
            if (!this.vpumping) {
                this.vpumping = true;
                this.ovol -= OXYGEN_PER_PUMP_V;
                if (this.apumping) {
                    this.frame = 3;
                } else {
                    this.frame = 1;
                }
            }
        }
        var that = this
        cowop.keyPressListeners.push(function(key) {
            if (key == "8") {
                that.pumpAtrium();
            } else if (key == "9") {
                that.pumpVentricle();
            }
        });
        this.addEventListener(enchant.Event.ENTER_FRAME, function(e) {
            this.ovol -= e.elapsed/1000 * OXYGEN_DECAY_PER_SEC;

            //Kill the heart if oxygen volume <= 0
            if (this.ovol <= 0 && this.alive) {
                game.pushScene(loseScene);
                this.alive = false;
            }

            //Limit the oxygen the heart can contain
            if (this.ovol > OXYGEN_MAX) {
                this.ovol = OXYGEN_MAX
            }

            //Update the oxygen bar
            oxyMeter.update(this.ovol/OXYGEN_MAX)

            this.frame = 0;
            if (this.apumping) {
                this.frame += 2;
                if (this.avol > ATRIUM_RATE*e.elapsed) {
                    if (!this.vpumping) {
                        this.vvol += ATRIUM_RATE*e.elapsed;
                    }
                    this.avol -= ATRIUM_RATE*e.elapsed;
                } else {
                    if (!this.vpumping) {
                        this.vvol += this.avol;
                    }
                    this.avol = 0;
                    this.apumping = false;
                }
            }
            if (this.vpumping) {
                this.frame += 1;
                if (this.vvol > VENTRICLE_RATE*e.elapsed) {
                    this.vvol -= VENTRICLE_RATE*e.elapsed;
                    this.ovol += VENTRICLE_RATE*e.elapsed;
                    this.aorta.supply(VENTRICLE_RATE*e.elapsed);
                } else {
                    this.ovol += this.vvol;
                    this.aorta.supply(this.vvol);
                    this.vvol = 0;
                    this.vpumping = false;
                }
            }
            if (!this.apumping) {
                this.avol -= REFILL_FACTOR*e.elapsed * (ATRIUM_VOLUME - this.avol);
            }
            if (!this.vpumping && this.vvol/VENTRICLE_VOLUME < this.avol/ATRIUM_VOLUME) {
                this.vvol -= REFILL_FACTOR*e.elapsed * (VENTRICLE_VOLUME - this.avol);
            }
            //console.log(Math.floor(this.avol), Math.floor(this.vvol), Math.floor(this.ovol));
        });
    },
});
