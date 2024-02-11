var song;
var img;
const blur_image = false;
var fft;

const stretch_factor = 4;
const height_translate_factor = 1.9;

var num_abovebelow_threshold = 0;
var on_chorus = false;
const consecutive_thresholds = 20;
const error = 5;
const amp_condition_val = 100;
var particles = [];

function preload() {
    console.log('preload')
    song = loadSound('assets/ewt.mp3')
    img = loadImage('assets/ag.png')
    console.log('preload done')
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES)
    imageMode(CENTER)
    ellipseMode(CENTER)
    fft = new p5.FFT()

    if (blur_image) {
        img.filter(BLUR, 5)
    }
}

function draw() {
    background(0)
    
    translate(width / 2, height / 2)
    // rotate(-90)
    // scale(0.75, 2.25);

    fft.analyze()
    amp  = fft.getEnergy(20, 200)

    push()
    if (amp > amp_condition_val) {
        rotate(random(-0.1, 0.1))
    }
    image(img, 0, 0, width + 100, height + 100)
    pop()

    var alpha = map(amp, 0, 255, 180, 150)
    fill(0, alpha)
    noStroke()
    ellipse(0, 259 + 360, width + 1100, height)
    stroke(255)
    noFill()
    strokeWeight(5)
    smooth();

    var waveform = fft.waveform()

    for (var t = -1; t <= 1; t += 2) {
        beginShape()
        stroke(255)
        fill(50)
        for (var i = 90; i <= 180; i += 0.5) {
            var index = floor(map(i, 0, 180, 0, waveform.length - 1))
            
            var r = map(waveform[index], -1, 1, 150, 350)  // original -1, 1, 150, 350
            // var r = map(floor(sqrt((waveform[10 * floor((index + 1 ) / 10)] + 1) * 100)), 0, 10, 150, 350)  // original -1, 1, 150, 350
            
            // if (r < 225) {
            //     r = 350
            // }
            // else {
            //     r = r
            // }

            var x = r * sin(i) * t * stretch_factor  // to stretch
            var y = r * cos(i) + (height / height_translate_factor) // translate down a bit
            // line(i, height, i, height - y)
            vertex(x,y)
        }
        endShape()
        // beginShape()
        // // light blue color
        // stroke(0, 255, 255, 240)
        // for (var i = 90; i <= 180; i++) {
        //     var index = floor(map(i, 0, 180, 0, waveform.length - 1))
            
        //     var r = map(waveform[index], -1, 1, 150, 350)  // original -1, 1, 150, 350

        //     if (r < 225) {
        //         r = 350
        //     }
        //     else {
        //         r = r
        //     }

        //     var x = r * sin(i) * t * stretch_factor  // to stretch
        //     var y = r * cos(i) + (height / height_translate_factor) // translate down a bit
        //     // line(i, height, i, height - y)
        //     vertex(x,y - 3)
        // }
        // endShape()
    }

    var p = new Particle()
    particles.push(p)

    if (amp < amp_condition_val - error && on_chorus) {
        num_abovebelow_threshold += 1
        if (num_abovebelow_threshold >= consecutive_thresholds) {
            on_chorus = false
            num_abovebelow_threshold = 0
        }
    }
    else if (amp > amp_condition_val + error && !on_chorus) {
        num_abovebelow_threshold += 1
        if (num_abovebelow_threshold >= consecutive_thresholds) {
            on_chorus = true
            num_abovebelow_threshold = 0
        }
    }
    else {  // handles both cases where amp is above or below threshold and they have the correct chorus status
        num_abovebelow_threshold = 0
    }

    console.log(amp, on_chorus, num_abovebelow_threshold)

    for (var i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].onEdge()) {
            particles[i].update(amp, amp_condition_val, on_chorus)
            particles[i].show()
        }
        else {
            particles.splice(i, 1)
        }
    }
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}


class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250)
        this.velocity = createVector(0, 0)
        this.acceleration = this.pos.copy().mult(random(0.0001, 0.00001))
        this.opacity = random(1, 5) * 51
        this.w = random(3, 5)

    }

    update(amp, amp_val, main_chorus = false) {
        this.velocity.add(this.acceleration)
        this.pos.add(this.velocity)
        if (amp > amp_val && main_chorus) {
            this.pos.add(this.velocity)
            this.pos.add(this.velocity)
            this.pos.add(this.velocity)
        }
    }

    onEdge() {
        // console.log((-height / 2) * height_translate_factor)
        // console.log(-height / 2)
        return (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < (-height / 2) * height_translate_factor - 100)
    }

    show() {
        noStroke()
        fill(255, 255, 255, this.opacity)
        ellipse(this.pos.x * stretch_factor, this.pos.y + (height / height_translate_factor), this.w)
    }
}