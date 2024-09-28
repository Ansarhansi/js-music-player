const audioPlayer = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

const playlistItems = Array.from(document.getElementById("playlist-items").getElementsByTagName("li"));
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const albumArt = document.getElementById("album-art");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume-slider");
function loadSong(index) {
    const song = playlistItems[index];
    audioPlayer.src = song.dataset.src;
    const titleArtist = song.textContent.split(" - ");
    songTitle.textContent = titleArtist[0];
    songArtist.textContent = titleArtist[1];
    albumArt.src = song.dataset.cover;
    changeBackgroundColor();  
    updatePlaylistActiveItem();
    
    
    progress.style.width = `0%`;
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';}



function changeBackgroundColor() {
    const colors = [
        'rgba(123, 104, 238, 0.8)', 'rgba(177, 68, 143, 0.9)', 'rgba(91, 69, 209, 0.7)', 'rgba(255, 105, 97, 0.8)', 'rgba(64, 224, 208, 0.9)', 'rgba(147, 51, 199, 0.8)', 'rgba(240, 150, 90, 0.9)', 'rgba(80, 191, 255, 0.8)', 'rgba(159, 120, 192, 0.7)', 'rgba(204, 85, 144, 0.9)', 'rgba(110, 55, 189, 0.8)', 'rgba(234, 188, 66, 0.9)', 'rgba(139, 95, 166, 0.7)', 'rgba(255, 80, 107, 0.8)', 'rgba(99, 66, 179, 0.9)', 'rgba(171, 108, 212, 0.8)', 'rgba(245, 140, 100, 0.9)', 'rgba(79, 134, 217, 0.8)', 'rgba(129, 88, 203, 0.7)', 'rgba(200, 120, 180, 0.9)'
    ];

    document.body.style.transition = "background-color 0.5s ease"; 
    document.body.style.backgroundColor = colors[currentSongIndex % colors.length];
}

function updatePlaylistActiveItem() {
    playlistItems.forEach((item) => {
        item.classList.remove("active");
    });
    playlistItems[currentSongIndex].classList.add("active");
}

function playSong() {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
}

function pauseSong() {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlistItems.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlistItems.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTimeEl.textContent = formatTime(currentTime);
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("ended", nextSong);
progressBar.addEventListener("click", setProgress);

volumeSlider.addEventListener("input", (e) => {
    audioPlayer.volume = e.target.value;
});

playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
    });
});

loadSong(currentSongIndex);
