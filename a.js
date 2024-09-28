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
    changeBackgroundColor();  // Call to change the background color
    updatePlaylistActiveItem();
}

function changeBackgroundColor() {
    const colors = [
        'rgba(255, 0, 150, 0.7)', // Pink
        'rgba(0, 204, 255, 0.7)', // Cyan
        'rgba(0, 255, 128, 0.7)', // Green
        'rgba(255, 255, 51, 0.7)', // Yellow
        'rgba(255, 102, 0, 0.7)', // Orange
        'rgba(153, 0, 255, 0.7)', // Purple
        'rgba(255, 51, 153, 0.7)', // Light Pink
        'rgba(51, 204, 204, 0.7)', // Teal
        'rgba(255, 204, 0, 0.7)', // Gold
        'rgba(102, 0, 204, 0.7)', // Dark Purple
    ];

    document.body.style.transition = "background-color 0.5s ease"; // Smooth transition
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
