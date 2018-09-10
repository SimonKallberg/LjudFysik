var mic, fft;

function setup() {
	createCanvas(1024,400);
   noFill();
   
   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT();
   fft.setInput(mic);

}
/*
function draw() {
   background(200);

   var spectrum = fft.analyze();

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) );
   }
   endShape();
}
*/

function draw() {
   background(200);

   var spectrum = fft.analyze();
   fft.smooth();
   var highest_amp = 0;
   var freq = 0;

   //Find the highest amplitude and the corresponding frequency
	for (i = 0; i<spectrum.length; i++) {
		if(highest_amp < fft.getEnergy(i)) {
			highest_amp = fft.getEnergy(i);
			freq = i;
		}
	}

	//Print dot on screen for strongest amplitude
   	strokeWeight(3);
	beginShape(POINTS);
	vertex(freq, map(highest_amp, 0, 255, height, 0));
	endShape();

/*
	// Print frequency and amplitude to console
   setInterval(function() {
   	console.log(highest_amp + ", " + freq);

   }, 1000);
*/

      beginShape();
      for (i = 20; i < 20000; i += 10) {
      	vertex(i, map(fft.getEnergy(i), 0, 255, height, 0) );
      /*
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) ); */
   }
   endShape();
}