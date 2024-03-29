var song;
var img;
const blur_image = false;
var fft;

const song_text = 'It Ain\'t Me';
const artists = 'Kygo & Selena Gomez (Codeko Remix)';
// const song_text = 'PLAY';
// const artists = 'Alan Walker, K-391, Tungevaag, Mangoo (Alan Walker x Niya Remix)';
const song_file_name = 'it_aint_me_codeko_nightcore.mp3';
const img_file_name = 'background_pic.jpeg';
// const img_file_name = 'frierenfixed1.png';
const font = 'Avenir Next Ultra Light';

const smoothing = 0.95;
const max_rect_length = 50;
const stretch_factor = 4;
const ellipseScaleY = 0.8;
const height_translate_factor = 1.8;

const consecutive_thresholds = 20;
const error = 5;
const amp_condition_val = 200;
const disable_particles = false;
var num_abovebelow_threshold = 0;
var on_chorus = false;
var particles = [];
var perm_test = [];

const visualizer_setting = 2;  // 0, 1, 2
const rectangular_colour = [255, 255, 255, 255];
const song_text_colour = [255, 255, 255, 255];
const artists_text_colour = [255, 255, 255, 255];

const disable_rectangle = true;
var w;

function spaceOutText(text) {
    var spaced_text = '';
    for (var i = 0; i < text.length; i++) {
        spaced_text += text[i] + ' ';
    }
    return spaced_text;
}

function hann(i, N) {
    return 0.5 * (1 - cos((TWO_PI * i) / (N - 1)));
}

function getBassFrequencies(spectrum, sampleRate, fftSize) {
    // Calculate the frequency resolution of each bin
    let binSize = sampleRate / fftSize;

    // Define the bass frequency range
    let bassMinFreq = 20;
    let bassMaxFreq = 200;

    // Calculate the index range corresponding to bass frequencies
    let bassMinIndex = Math.floor(bassMinFreq / binSize);
    let bassMaxIndex = Math.ceil(bassMaxFreq / binSize);

    // Extract the bass frequencies from the spectrum
    let bassFrequencies = spectrum.slice(bassMinIndex, bassMaxIndex + 1);

    return bassFrequencies;
}

function preload() {
    console.log('preload');
    song = loadSound('assets/' + song_file_name);
    img = loadImage('assets/' + img_file_name);
    console.log('preload done');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    if (visualizer_setting == 0) {
        angleMode(DEGREES);
    }
    imageMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER);
    fft = new p5.FFT(smoothing, 1024);

    if (blur_image) {
        img.filter(BLUR, 5);
    }

    w = width / 128;
}

function draw() {
    background(0);

    if (visualizer_setting != 5) {
        translate(width / 2, height / 2);
        // rotate(-90);
        // scale(0.75, 2.25);

        fft.analyze();
        var amp = fft.getEnergy(20, 200);

        push();
        if (amp > amp_condition_val) {
            rotate(random(-0.005, 0.005));
        }
        image(img, 0, 0, width + 100, height + 100);
        pop();

        // rectangle for text on top
        if (!disable_rectangle) {
            fill(0, 0, 0, 100);
            noStroke();
            rect(-width / 2, -height / 2, width, 65);
        }

        stroke(255, 255, 255);
        noFill();
        strokeWeight(5);
        smooth();
    }

    var waveform = fft.waveform();
    var spectrum = fft.analyze();
    // var amp = fft.getEnergy(20, 200);

    for (var t = -1; t <= 1; t += 2) {
        if (visualizer_setting == 3) {
            // Potentially helpful? https://p5js.org/examples/sound-frequency-spectrum.html
            // OR: https://stackoverflow.com/questions/70928431/how-can-i-add-each-element-of-fourier-getenergy-into-an-array
            strokeWeight(0);
            stroke(255, 255, 255);

            energy = fft.getEnergy("bass")

            // const resultArray = energy.slice(1024);
            var resultArray = [];

            for (let i=0; i<1024; i++) {
                resultArray.push(energy[i]);
            }

            // console.log(resultArray);


            // for (var i = 0; i < spectrum.length; i++) {
            //     var ampy = spectrum[i];

            //     var y = map(ampy, 0, 256, height, height / 2);
            //     // line(i * w, height, i * w, y);
            //     fill(i, 255, 255);
            //     rect(i * w, y, w, (height - y));
            // }

            let spectrum = fft.analyze();
            let bass_stuff = spectrum.slice(0, 1024);
            console.log(bass_stuff);
            // console.log(spectrum);
            let bassEnergy = fft.getEnergy("bass"); // Get current bass energy
            var totalRectangles = 180 / 0.2; // Total number of rectangles you want
            var angleIncrement = TWO_PI / totalRectangles; // Even angular increment
            // Scale the bassEnergy to fit your visualizer's needs
            // Calculate a scaling factor for the bass energy (adjustable as needed)
            let bassScaleFactor = map(bassEnergy, 0, 255, 1, 3); // Example: scales from 1x to 3x

            beginShape();
            for (var i = 0; i < totalRectangles / 2; i++) {
                var angle = i * angleIncrement - (PI / 2);
                // var index = floor(map(angle, 0, TWO_PI, 0, spectrum.length - 1));
                // var amplitude = spectrum[spectrum.length - 1 - index]; // Use the specific amplitude at each index

                // let bass_stuff = getBassFrequencies(spectrum, 48000, 1024);
                var index = floor(map(angle, -PI / 2, TWO_PI - (PI / 2), 0, bass_stuff.length - 1));
                let amplitude = bass_stuff[index]; // Use the specific amplitude at each index
                // console.log(amplitude)

                // Scale the amplitude by the bassScaleFactor
                // amplitude *= bassScaleFactor;

                var baseR = 250;
                // var rectLength = map(amplitude, 0, 256, 0, 3 * max_rect_length); // Adjust rectLength based on scaled amplitude
                var rectLength = amplitude * 0.5;
                var baseX = (baseR * cos(angle)) * t * stretch_factor;
                var baseY = (baseR * sin(angle)) * ellipseScaleY + (height / height_translate_factor);
                // var endX = ((baseR + rectLength) * cos(angle)) * t * stretch_factor;
                // var endY = ((baseR + rectLength) * sin(angle)) * ellipseScaleY + (height / height_translate_factor);

                // Ensure rectLength and positions are calculated correctly
                var rectHeight = -rectLength; // Assuming you want to draw upwards
                fill(rectangular_colour[0], rectangular_colour[1], rectangular_colour[2], rectangular_colour[3]);

                // Use baseX, baseY, and rectHeight to draw the rectangle
                strokeWeight(0);
                // if (perm_test.includes(index)) {
                //     fill(255, 0, 0, 255);
                //     stroke(0, 255, 255);
                // } else {
                //     fill(255, 255, 255);
                //     // stroke(amplitude)
                // }
                // if (amplitude == 255) {
                //     perm_test.push(index);
                // }
                // if (amplitude > 240) {
                //     rectHeight *= 1.75;
                // } else if (amplitude > 200) {
                //     rectHeight *= 1.2;
                // } else if (amplitude > 150) {
                //     rectHeight *= 1.1;
                // }
                // else if (amplitude > 100) {
                //     rectHeight *= 1;
                // }
                // else {
                //     rectHeight *= 0.8
                // }
                rect(baseX, baseY, 2, rectHeight); 

                // line(baseX, baseY, endX, endY);
                fill(0, 0, 0, 127);
                stroke(0, 0, 0, 0);
                vertex(baseX, baseY);
            }
            endShape();
        }
        else if (visualizer_setting == 2) {
            var totalRectangles = 180 / 0.2; // Total number of rectangles you want
            var angleIncrement = TWO_PI / totalRectangles; // Even angular increment

            stroke(rectangular_colour[0], rectangular_colour[1], rectangular_colour[2], rectangular_colour[3]);
            beginShape();
            noFill();
            for (var i = totalRectangles / 2; i < totalRectangles; i++) {
                var angle = i * angleIncrement; // Constant angular increment
                var index = floor(map(angle, 0, TWO_PI, 0, spectrum.length - 1));
                var amplitude = spectrum[index] //* hann(index, spectrum.length); 
                
                var baseR = 250;
                // var rectLength = 25 + exp(amplitude / 0.1); // Consider dynamic adjustment here if needed
                var rectLength = map(amplitude, 0, 256, 0, 3 * max_rect_length); // Consider dynamic adjustment here if needed
                var y = map(amplitude, 0, 256, height, height / 2);

                // Adjusted for ellipse
                var baseX = (baseR * cos(angle)) * t * stretch_factor;
                fill(rectangular_colour[0], rectangular_colour[1], rectangular_colour[2], rectangular_colour[3]);
                var baseY = (baseR * sin(angle)) * ellipseScaleY + (height / height_translate_factor);
                
                var endX = ((baseR + rectLength) * cos(angle)) * t * stretch_factor;
                var endY = ((baseR + rectLength) * sin(angle)) * ellipseScaleY + (height / height_translate_factor);

                // rect(i * w, recLength, w, (height - recLength));
                
                rect(baseX, baseY, 2, -rectLength);

                fill(0, 0, 0, 127);
                stroke(0, 0, 0, 0);
                vertex(baseX, baseY);
            }
            endShape();
        }
        // GOOD ONE BELOW:

        if (visualizer_setting == 1) {
            var totalRectangles = 180 / 0.125; // Total number of rectangles you want
            var angleIncrement = TWO_PI / totalRectangles; // Even angular increment

            stroke(255);
            beginShape();
            noFill();
            for (var i = totalRectangles / 2; i < totalRectangles; i++) {
                var angle = i * angleIncrement; // Constant angular increment
                var index = floor(map(angle, 0, TWO_PI, 0, waveform.length - 1));
                var amplitude = waveform[index];
                
                var baseR = 250;
                // var rectLength = 25 + exp(amplitude / 0.1); // Consider dynamic adjustment here if needed
                var rectLength = map(amplitude, -1, 1, 0, max_rect_length); // Consider dynamic adjustment here if needed

            
                // Adjusted for ellipse
                var baseX = (baseR * cos(angle)) * t * stretch_factor;
                var baseY = (baseR * sin(angle)) * ellipseScaleY + (height / height_translate_factor);
                
                var endX = ((baseR + rectLength) * cos(angle)) * t * stretch_factor;
                var endY = ((baseR + rectLength) * sin(angle)) * ellipseScaleY + (height / height_translate_factor);
                
                // Draw the rectangle (using lines for simplicity)
                push();
                stroke(rectangular_colour[0], rectangular_colour[1], rectangular_colour[2], rectangular_colour[3]);
                rect(baseX, baseY, 2, -rectLength);
                // line(baseX, baseY, endX, endY);
                // vertex(baseX, baseY);
                pop();
                
                stroke(0, 255, 255, 240);
                vertex(endX, endY);

                // stroke(0, 255, 255, 0);
                //rect(endX, endY, 2, -1);
                fill(0, 0, 0, 127);
                stroke(0, 0, 0, 0);
                vertex(baseX, baseY);
            }
            endShape();
        }
        else if (visualizer_setting == 0) {
            beginShape();
            stroke(255);
            fill(0, 0, 0, 200);
            for (var i = 0; i <= 180; i += 0.5) {
                var index = floor(map(i, 0, 180, 0, waveform.length - 1));
                
                var r = floor(map(waveform[index], -1, 1, 150, 350));  // original -1, 1, 150, 350
                // var r = map(floor(sqrt((waveform[10 * floor((index + 1 ) / 10)] + 1) * 100)), 0, 10, 150, 350)  // original -1, 1, 150, 350
                var x = r * sin(i) * t * stretch_factor;  // to stretch
                var y = r * cos(i) + (height / height_translate_factor); // translate down a bit
                // line(i, height, i, height - y)
                vertex(x,y);
            }
            endShape();
            noFill();
            beginShape();
            // light blue color
            stroke(0, 255, 255, 255);
            for (var i = 90; i <= 180; i+= 0.5) {
                var index = floor(map(i, 0, 180, 0, waveform.length - 1));
                
                var r = map(waveform[index], -1, 1, 150, 350);  // original -1, 1, 150, 350
                var x = r * sin(i) * t * stretch_factor;  // to stretch
                var y = r * cos(i) + (height / height_translate_factor); // translate down a bit
                vertex(x,y - 3);
            }
            endShape();
        }
    }
    
    textFont(font, 40);
    strokeWeight(3);
    stroke(song_text_colour[0], song_text_colour[1], song_text_colour[2], song_text_colour[3]);
    fill(song_text_colour[0], song_text_colour[1], song_text_colour[2], song_text_colour[3]);
    text(spaceOutText(song_text), 0, 330);
    textFont(font, 25);
    stroke(artists_text_colour[0], artists_text_colour[1], artists_text_colour[2], artists_text_colour[3]);
    fill(artists_text_colour[0], artists_text_colour[1], artists_text_colour[2], artists_text_colour[3]);
    text(spaceOutText(artists), 0, 385);

    if (disable_particles) return;

    let p = new Particle();
    particles.push(p);

    // if (on_chorus) {
    //     let p2 = new Particle();
    //     particles.push(p2);
    // }

    if (amp < amp_condition_val - error && on_chorus) {
        num_abovebelow_threshold += 1;
        if (num_abovebelow_threshold >= consecutive_thresholds) {
            on_chorus = false;
            num_abovebelow_threshold = 0;
        }
    }
    else if (amp > amp_condition_val + error && !on_chorus) {
        num_abovebelow_threshold += 1;
        if (num_abovebelow_threshold >= consecutive_thresholds) {
            on_chorus = true;
            num_abovebelow_threshold = 0;
        }
    }
    else {  // handles both cases where amp is above or below threshold and they have the correct chorus status
        num_abovebelow_threshold = 0;
    }

    // console.log(amp, on_chorus, num_abovebelow_threshold);

    for (var i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].onEdge()) {
            particles[i].update(amp, amp_condition_val, on_chorus);
            particles[i].show();
        }
        else {
            particles.splice(i, 1);
        }
    }
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play();
        loop();
    }
}


function keyPressed() {
    // spacebar
    if (keyCode === 32) {
        if (song.isPlaying()) {
            song.pause();
            noLoop();
        } else {
            song.play();
            loop();
        }
    }
}


class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250);
        this.velocity = createVector(0, 0);
        this.acceleration = this.pos.copy().mult(random(0.0001, 0.00001));
        this.opacity = random(1, 5) * 51;
        this.w = random(3, 5);

    }

    update(amp, amp_val, main_chorus = false) {
        this.velocity.add(this.acceleration);
        this.pos.add(this.velocity);
        if (amp > amp_val && main_chorus) {
            this.pos.add(this.velocity);
            this.pos.add(this.velocity);
            this.pos.add(this.velocity);
        }
    }

    onEdge() {
        // console.log((-height / 2) * height_translate_factor)
        // console.log(-height / 2)
        return (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < (-height / 2) * height_translate_factor - 100);
    }

    show() {
        noStroke();
        fill(255, 255, 255, this.opacity);
        ellipse(this.pos.x * stretch_factor, this.pos.y + (height / height_translate_factor) + 40, this.w);
    }
}