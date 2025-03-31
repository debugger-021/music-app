const audio = new Audio();
let currFOlder;
let songs
let play = document.querySelector('#play');

async function dispAlbums() {
    let resp = await (await fetch(`http://127.0.0.1:5500/spotify/songs/`)).text();
    let html = document.createElement('div');
    html.innerHTML = resp;
    let aS = Array.from(html.getElementsByTagName('a'));
    cardsCont = document.querySelector('.cards-cont');
    for (let index = 0; index < aS.length; index++) {
        if (aS[index].href.includes('/songs/')) {
            let folder = aS[index].href.split('/')[5];
            let output = await (await fetch(`/spotify/songs/${folder}/info.json`)).json();
            cardsCont.innerHTML += `<div class="card flex" data-folder="${folder}">
                            <img src="/spotify/songs/${folder}/cover.jpg"  alt="Happy Hits">
                            <div style = "display: grid;gap: 11px;"><h3 style="color: #e1d9d9f0;">${output.title}</h3>
                            <h5 style="color: #e3e3e3;">${output.description}</h5></div>
                            <button class="playbtn flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path fill="#000000"
                                        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                </svg>
                            </button>
                        </div>`;
        }
    }
}

async function main(folder) {
    songs = [];
    currFOlder = folder;
    let resp = await (await fetch(`http://127.0.0.1:5500/spotify/songs/${currFOlder}/`)).text();
    let html = document.createElement('div');
    html.innerHTML = resp;
    let aS = Array.from(html.getElementsByTagName('a'));
    for (const ele of aS) {
        if (ele.href.endsWith('.mp3')) songs.push(decodeURIComponent(ele.href.split(`/${currFOlder}/`)[1]));
    }
    function playMusic(track, pause = false) {
        audio.src = `/spotify/songs/${currFOlder}/${track}`;
        if (!pause) {
            audio.play();
            play.src = 'pause.svg';
        }
        document.querySelector('.songDur').innerHTML = track;
        document.querySelector('.songTime').innerHTML = '00:00 / 00:00';
    }

    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';

        let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        let seconds = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    playMusic(decodeURIComponent(songs[0]), true);


    let m = document.getElementsByTagName('ul')[0];
    m.innerHTML = '';
    for (const song of songs) {
        m.innerHTML += `<li>
                                <div class="mysong flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                        color="white" fill="none">
                                        <circle cx="6.5" cy="18.5" r="3.5" stroke="currentColor" stroke-width="1.5" />
                                        <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" />
                                        <path
                                            d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16"
                                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="currentColor"
                                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <div class="songinfo">
                                        <p>${song}</p>
                                    </div>
                                    <p>Play now</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                        color="#fff" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                                        <path
                                            d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
                                            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    </svg>
                               </div>
                        </li>`;
    }
    let x = [];
    document.querySelectorAll('.songinfo p').forEach(el => {
        el.addEventListener("click", () => {
            x.push(el.innerText);
            playMusic(el.innerText);
        })
    });
    audio.addEventListener("timeupdate", () => {
        document.querySelector('.songTime').innerHTML = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        document.querySelector('.circle').style.left = (audio.currentTime) / (audio.duration) * 100 + '%';
        if (audio.currentTime >= audio.duration) {
            play.src = 'play.svg';
        }
    });

}

play.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        play.src = 'pause.svg';
    } else {
        audio.pause();
        play.src = 'play.svg';
    }
})

document.querySelector('.seekbar').addEventListener('click', (e) => {
    document.querySelector('.circle').style.left = e.offsetX / e.target.getBoundingClientRect().width * 100 + '%';
    audio.currentTime = (audio.duration) * e.offsetX / e.target.getBoundingClientRect().width;
})

document.querySelector('.ham').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
})

document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-125%';
})

document.querySelector('#previous').addEventListener('click', () => {
    let index = songs.findIndex(e => (decodeURIComponent(audio.src.split('/songs/')[1])) == e);
    if (index != -1 && (index - 1) >= 0) playMusic(decodeURIComponent(songs[index - 1]));
})

document.querySelector('#next').addEventListener('click', () => {
    let index = songs.findIndex(e => (decodeURIComponent(audio.src.split('/songs/')[1])) == e);
    if (index != -1 && (index + 1) < songs.length) playMusic(decodeURIComponent(songs[index + 1]));
})

document.querySelector('.volume input').addEventListener('input', (e) => {
    let vol = document.querySelector('.volume img');
    audio.volume = parseInt(e.target.value) / 100;
    if (audio.volume == 0) {
        vol.src = 'mute.svg';
    } else {
        vol.src = 'volume.svg';
    }
})

let prevVOl = 1;
document.querySelector('.volume img').addEventListener('click', (e) => {
    let vol = document.querySelector('.volume img');
    if (vol.src.includes('volume.svg')) {
        prevVOl = audio.volume;
        vol.src = 'mute.svg';
        document.querySelector('.volume input').value = '0';
        audio.volume = 0;

    } else if (vol.src.includes('mute.svg')) {
        vol.src = 'volume.svg';
        document.querySelector('.volume input').value = prevVOl * 100;
        audio.volume = prevVOl;
        if (play.src.includes('pause.svg')) audio.play();
    }
})

main('mysongs');
async function run() {
    await dispAlbums();
    document.querySelectorAll('.card').forEach(ele => {
        ele.addEventListener('click', e => {
            main(e.currentTarget.dataset.folder);
        })
    })
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            play.src = 'play.svg';
            document.querySelector('.circle').style.left = '0%';
        })
    });
}

run();