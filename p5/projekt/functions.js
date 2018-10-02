var mic, fft;
var freq_log = [0,1,2];
var count = 0;
var chords = {'c':  "c",
							'c#': "e",
							'd':  "dm",
							'd#': "dm",
							'e':  "e",
							'f':  "dm",
							'f#': "e",
							'g':  "c",
						  'g#': "e",
							'a':  "am",
							'a#': "c",
							'b':  "e"};

function setup() {
	createCanvas(1024,400);
   noFill();

   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT();
   fft.setInput(mic);
}

function draw() {
	 //Draws background for frequency spectrum
   background(200);
	 //Creates spectrum with 5000 slots, 0-5000 Hz, with amplitude stored
	 var product_spectrum = make_spectrum();
	 //Finds highest amplitude in product spectrum
	 var current_pitch = fundamental(product_spectrum);
	 //Adds current pitch to freq_log
	 history(current_pitch);
	 //Finds amplitude of the current pitch
	 var current_amplitude = product_spectrum[current_pitch];
	 //Identifies which note the current pitch has
	 var identified_note = note(identified_pitch());
	 //Logs to console
   console.log(identified_note + ", " + identified_pitch() + ", " + chords[identified_note]);
	 //Plots freqency spectrum
	 plot(product_spectrum);
	 //Plays chord every x frames if amplitude is great enough
	 if (count == 30) {
		 var threshold = document.getElementById("threshold_slider").value;
		 if (current_amplitude > threshold) {
			 play(chords[identified_note]);
			 document.getElementById("pitch").innerHTML = identified_note;
			 document.getElementById("chord").innerHTML = chords[identified_note];
		 } else {
			 fadeOut(playing);
			 document.getElementById("pitch").innerHTML = "-";
			 document.getElementById("chord").innerHTML = "-";
		 }
		 count = 0;
		 //Changes the HTML

	 }
	 count++;

}

function fundamental(array) {
	 var fundamental = 0;
	 var max = 0;
	 for (i = 0; i < array.length; i++) {
	 		if (array[i] > max) {
			 max = array[i];
			 fundamental = i;
		 }
	 }
	 return fundamental;
}

function history(freq) {
	freq_log.unshift(freq);
	if (freq_log.length > 31){
		freq_log.pop();
	}
}

function identified_pitch() {
	var modes = [];
	modes = mode(freq_log);
	return modes[0];
}

function note(frequency) {
	var notes = {65: 'c',
							 69: 'c#',
						   73: 'd',
							 78: 'd#',
							 82: 'e',
							 87: 'f',
							 93: 'f#',
							 98: 'g',
							 104: 'g#',
							 110: 'a',
							 117: 'a#',
							 123: 'b'};

	while (frequency > 128) {
		frequency = frequency / 2;
	}

	var closest = 110;
	var delta = 1000;
	for (const note in notes) {
		if ((frequency - note)*(frequency - note) < delta) {
			delta = (frequency - note)*(frequency - note);
			closest = note;
		}
	}
	return notes[closest];
}

function plot(spectrum) {
	strokeWeight(3);
	//plot graph for amplitudes
	beginShape();
	for (i = 0; i < spectrum.length; i++) {
		vertex(i, map(spectrum[i], 0, 255, height, 0) );
	}
	endShape();
}

function make_spectrum() {
	var spectrum_original = fft.analyze();
	var highest_amp = 0;
	var freq = 0;

	var spectrum = [];
	//Make a new array with 20000 elements which represent frequency
	for(f = 0; f < 20000; f++)
	{
			 spectrum[f] = fft.getEnergy(f);
	}

	//Samplar ner originalfrekvensen till 1/2 och 1/3 av originalet
	var downsample2 = downSample(spectrum, 2);
	var downsample3 = downSample(spectrum, 3);
	var downsample4 = downSample(spectrum, 4);

	//Gör spectrum multiplication thing badabim boom
	var product_spectrum = [];
	for (i = 0; i < downsample4.length; i++) {
		product_spectrum[i] = spectrum[i]*downsample2[i]*downsample3[i]*downsample4[i];
		//Normerar vektorn
		product_spectrum[i] = product_spectrum[i]/(255*255*255);
	}

	for (i = 0; i < 63; i++){
		product_spectrum[i] = 0;
	}

	return product_spectrum;
}



function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [], count = [], i, number, maxIndex = 0;

    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }

    return modes;
}

function downSample(array, factor){
	var result = [];
	for (i = 0; i < array.length; i = i + factor) {
		mean = 0;
		for (j = 0; j < factor; j++){
			mean += array[i + j] / factor;
		}
		result[i/factor] = mean;
	}
	return result;
}
