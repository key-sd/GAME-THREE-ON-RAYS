const music = new Howl({
    src: ['sounds/music.mp3'],
    loop: true
  })
  
  const playButton = document.getElementById('playButton');
  const stopButton = document.getElementById('stopButton');
  const muteButton = document.getElementById('muteButton');
  const volumeUpButton = document.getElementById('volumeUpButton');
  const volumeDownButton = document.getElementById('volumeDownButton');
  
  playButton.addEventListener('click', () => {
    music.play();
  })
  
  stopButton.addEventListener('click', () => {
    music.stop();
  })
  
  muteButton.addEventListener('click', () => {
    music.mute();
  })
  
  volumeUpButton.addEventListener('click', () => {
  
    let volume = music.volume();
    if (volume < 1)
        volume += 0.1;
  
    music.volume(volume)
  })
  
  volumeDownButton.addEventListener('click', () => {
    let volume = music.volume();
    if (volume > 0)
        volume -= 0.1;
  
    music.volume(volume)
  })