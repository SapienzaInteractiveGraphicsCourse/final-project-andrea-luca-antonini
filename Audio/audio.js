var audio = [];

var audioInitializer = () => {
    'use strict';
    audio[0] = new Audio();

    //Source
    audio[0].src = "musics/pacman_remix.mp3";

    // Loop
    audio[0].loop = true;

    // Pause
    audio[0].pause();

    // Volume
    audio[0].volume = 0.2;

    var playPauseButton = document.getElementById("playPauseButton");
    var muteButton = document.getElementById("muteButton");
    var volumeSlider = document.getElementById("volumeSlider");
    volumeSlider.value = 20;



    // Event handling
    playPauseButton.onclick = () => {
        if (audio[0].paused) {
            audio[0].play();
            playPauseButton.style.background = "url(images/pause.png) no-repeat";
        }
        else {
          audio[0].pause();
          playPauseButton.style.background = "url(images/play.png) no-repeat";
        }
    };

    muteButton.onclick = () => {
        if (audio[0].muted) {
            audio[0].muted = false;
            muteButton.style.background = "url(images/volume-high.png) no-repeat";
        }
        else {
          audio[0].muted = true;
            muteButton.style.background = "url(images/muted.png) no-repeat";
        }
    };

    volumeSlider.onchange = () => {
        audio[0].volume = volumeSlider.value / 100;
    };
    return audio;
};

var settings = false, stopped = false;

var settingsInitializer = () => {
    var settingsButton = document.getElementById("settings");
    var settingsTable = document.getElementById("container");
    var backButton = document.getElementById("back");
    settingsButton.onclick = () => {
        settings = true;
        settingsTable.style.display = 'initial';
        if (!audio[0].paused) {
            audio[0].pause();
            stopped = true;
        }
    }
    backButton.onclick = () => {
        settingsTable.style.display = 'none';
        if(stopped){
            audio[0].play();
            stopped = false;
        }
        settings = false;
    }
}

export {
    settingsInitializer,
    settinged,
    stopped,
}

export {
    audioInitializer,
    audio
};
