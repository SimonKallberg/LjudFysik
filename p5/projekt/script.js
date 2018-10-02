var playing = 0;
var label;

function init() {
  setInterval(keepPlaying, 10);
}

function play(chord) {
  if (playing != 0) fadeOut(playing);
  var audio = new Audio('sound/' + chord + '.wav');
  playing = audio;
  fadeIn(audio);
}

function keepPlaying() {
  if (playing.paused)
    playing.play();
}

function fadeOut(sound) {
  var fader = setInterval(function(){
    if (sound.volume > 0.1) {
      sound.volume -= 0.005;
    } else {
      sound.volume = 0;
    }
  }, 5);
  setTimeout(function(){clearInterval(fader);}, 1000)
}

function fadeIn(sound) {
  sound.play()
  sound.volume = 0;
  var fader = setInterval(function(){
    if (sound.volume < 0.9) {
      sound.volume += 0.005;
    } else {
      sound.volume = 1;
    }
  }, 5);
  setTimeout(function(){clearInterval(fader);}, 1000)
}
