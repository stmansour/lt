var smApp = {
    audioUrl: 'Gotta Be Tonight - Promo1 - 44_1.mp3',
    thisURL: `http://stevemansour.com/lt/0001/play.html`,
    thisImg: 'http://stevemansour.com/lt/0001/gbt-640.png',
    thisTitle: "Check out GRAY's new single!",
    thisKeywords: "GRAY Music Factory, new single, music",
    thisDescription: "Listen to GRAY Music Factory's latest single now!",
    audioPlayer: null,
    songLoaded: false,
    canPlay: false,
    songIsLoading: false,
    isPlaying: false,
    playRequested: false,   // true if play was clicked while before the song was loaded
    durationDisplay: null,
    playPauseBtn: null,
    progressBar: null,
    btnImg: null,
    popup: null,
};

linkTree = {
    'iTunes': "https://itunes.apple.com/",
    'Spotify': "https://spotify.com/",
    'AppleMusic': "https://music.apple.com/",
    'AmazonMusic': "https://music.amazon.com/",
    'Pandora': "https://pandora.com/",
    'YouTube': "https://youtube.com/@graymusicfactory",
    'Deezer': "https://deezer.com/",
};

window.addEventListener('load', () => {
    smApp.progressBar = document.getElementById('progressBar');
    smApp.progressBar.innerHTML = `<div style="position: relative; width: 260px; height: 50px; margin: 0 auto;">
    <div style="position: absolute; top: 50%; transform: translateY(-50%); width: 3px; height: 7px; background-color: #666;"></div>
    <div style="position: absolute; top: 50%; transform: translateY(-50%); left: 3px; width: 257px; height: 3px; background-color: #ccc;"></div></div>`;
    smApp.playPauseBtn = document.getElementById('play-pause-btn');
    smApp.btnImg = document.getElementById('playPauseImg');
    smApp.durationDisplay = document.getElementById('duration');
    smApp.songIsLoading = true;
    smApp.btnImg.src = "../images/spinner.gif";
    // smApp.audioPlayer = new Audio(smApp.audioUrl);  // this fails on iPhones
    smApp.audioPlayer = document.createElement("AUDIO");
    smApp.audioPlayer.src = smApp.audioUrl;
    smApp.audioPlayer.load();

    smApp.audioPlayer.addEventListener('durationchange', () => {
        console.log("duration change");
        smApp.durationDisplay.innerHTML = formatDuration(smApp.audioPlayer.duration);
    });

    smApp.audioPlayer.addEventListener('canplay', () => {
        console.log("CAN PLAY");
        smApp.canPlay = true;
        if (smApp.playRequested) {
            smApp.audioPlayer.play();
            smApp.isPlaying = true;
            smApp.playRequested = false;
            smApp.btnImg.src = "../images/pause.png";
        } else {
            smApp.btnImg.src = "../images/play.png";
        }
    });

    smApp.audioPlayer.addEventListener('ended', () => {
        console.log("song ended");
        smApp.isPlaying = false;
        smApp.btnImg.src = "../images/play.png";
    });

    smApp.audioPlayer.addEventListener('timeupdate', () => {
        const percentComplete = (smApp.audioPlayer.currentTime / smApp.audioPlayer.duration) * 100;
        if (isNaN(percentComplete)) {
            return;
        }
        const progressWidth = Math.round((percentComplete / 100) * 260);
        smApp.progressBar.innerHTML = `
            <div style="position: relative; width: 260px; height: 50px; margin: 0 auto;">
                <div style="position: absolute; top: 50%; transform: translateY(-50%); width: ${progressWidth}px; height: 7px; background-color: #666;"></div>
                <div style="position: absolute; top: 50%; transform: translateY(-50%); left: ${progressWidth}px; width: ${260 - progressWidth}px; height: 3px; background-color: #ccc;"></div>
            </div>`;
    });

    setTimeout(() => {
        smApp.songLoaded = true;
        smApp.songIsLoading = false;
        if (smApp.playRequested && smApp.canPlay) {
            smApp.audioPlayer.play();
            smApp.isPlaying = true;
            smApp.playRequested = false;
            smApp.btnImg.src = "../images/pause.png";
        }
    }, 1000); // Delay for 100 milliseconds

});

function showPopup() {
    var popup = document.getElementById("smPopup");
    popup.classList.toggle("show");
}

function capitalizeWords(words) {
    var capitalizedWords = [];
    for (let i = 0; i < words.length; i++) {
        var wordArray = words[i].split(" ");
        let capitalizedWord = "";
        for (let j = 0; j < wordArray.length; j++) {
            capitalizedWord += wordArray[j].charAt(0).toUpperCase() + wordArray[j].slice(1);
        }
        capitalizedWords.push(capitalizedWord);
    }
    return capitalizedWords;
}


function getKeywords(platform) {
    var keywords = smApp.thisKeywords.split(/,+/).map((word) => word.trim());
    keywords = capitalizeWords(keywords);
    switch (platform) {
        case 'twitter':
            return keywords.map((word) => word.replace(/\s+/g, '')).join('');
        case 'tumblr':
            return keywords.map((word) => word.toLowerCase()).join(',');
        case 'facebook':
            return keywords.join(',');
        case 'pinterest':
            return keywords.join(',');
        default:
            return '';
    }
}

function smButtonHandler(p) {
    var s1;
    var s2;
    var s3;
    switch (p) {
        case "email":
            s1 = encodeURIComponent(`Have you heard GRAY's new single -- Gotta Be Tonight`);
            s2 = encodeURIComponent(`Give it a listen, or watch the video.  `);
            s3 = `mailto:?subject=` + s1 + `&body=` + s2 + smApp.thisURL
            break;
        case "facebook":
            s1 = getKeywords('facebook');
            s3 = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(smApp.thisURL)}&title=${encodeURIComponent(smApp.thisTitle)}&description=${encodeURIComponent(smApp.thisDescription)}&quote=${encodeURIComponent(smApp.thisDescription)}&hashtag=${encodeURIComponent(s1)}`;
            break;
        case "pintrest":
            s2 = getKeywords('pinterest');
            s3 = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(smApp.thisURL)}&media=${encodeURIComponent(smApp.thisImgURL)}&description=${encodeURIComponent(smApp.thisDescription)}&hashtags=${encodeURIComponent(s2)}`;
            break;
        case "reddit":
            // full URL for reddit
            // https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsubmit%3Furl%3Dhttps%253A%252F%252Fkindlethefire.hearnow.com%252Fcloser%26title%3DCloser%2520by%2520Kindle%2520the%2520Fire

            //    https%3A%2F%2Fwww.reddit.com%2Fsubmit%3Furl%3D"  
            s1 = "https://www.reddit.com/submit?url=" +
                //  https%253A%252F%252Fkindlethefire.hearnow.com%252Fcloser%26   
                encodeURIComponent(smApp.thisURL) +
                // title%3DCloser%2520by%2520Kindle%2520the%2520Fire            
                '%26title%3D' + encodeURIComponent("Gotta Be Tonight by GRAY");
            //    https://www.reddit.com/login/?dest=
            s3 = "https://www.reddit.com/login/?dest=" + s1;
            break;
        case "tumblr":
            s2 = getKeywords('tumblr');
            s3 = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(smApp.thisURL)}&posttype=link&title=${encodeURIComponent(smApp.thisTitle)}&caption=${encodeURIComponent(smApp.thisDescription)}&tags=${encodeURIComponent(s2)}`;
            break;
        case "twitter":
            s2 = getKeywords('twitter');
            s3 = `https://twitter.com/intent/tweet?text=${encodeURIComponent(smApp.thisTitle)}&url=${encodeURIComponent(smApp.thisURL)}&hashtags=${encodeURIComponent(s2)}`;
            break;
        default:
            console.log("unrecognized social media platform = " + p);
            return;
    }
    window.open(s3, '_blank');
}

function capitalizeWords(words) {
    var capitalizedWords = [];
    for (let i = 0; i < words.length; i++) {
        var wordArray = words[i].split(" ");
        let capitalizedWord = "";
        for (let j = 0; j < wordArray.length; j++) {
            capitalizedWord += wordArray[j].charAt(0).toUpperCase() + wordArray[j].slice(1);
        }
        capitalizedWords.push(capitalizedWord);
    }
    return capitalizedWords;
}
// getKeywords - convert our generic keywords into something reasonable for the supplied
//               platform that takes into account that platforms conventions and restrictions.
//-----------------------------------------------------------------------------------------------
function getKeywords(platform) {
    var keywords = smApp.thisKeywords.split(/,+/).map((word) => word.trim());
    keywords = capitalizeWords(keywords);
    switch (platform) {
        case 'twitter':
            return keywords.map((word) => word.replace(/\s+/g, '')).join('');
        case 'tumblr':
            return keywords.map((word) => word.toLowerCase()).join(',');
        case 'facebook':
        case 'reddit':
        case 'pinterest':
            return keywords.join(',');
        default:
            return '';
    }
}

function rbuttonClick(rbtn) {
    console.log("rbutton: " + rbtn);
    var url = "";
    switch (rbtn) {
        case 'iTunes': url = linkTree[rbtn]; break;
        case 'Spotify': url = linkTree[rbtn]; break;
        case 'AppleMusic': url = linkTree[rbtn]; break;
        case 'AmazonMusic': url = linkTree[rbtn]; break;
        case 'Pandora': url = linkTree[rbtn]; break;
        case 'YouTube': url = linkTree[rbtn]; break;
        case 'Deezer': url = linkTree[rbtn]; break;
        default:
            console.log("unrecognized target");
            return;
            break;
    }
    window.open(url, '_blank');
}

function playHandler() {
    if (smApp.isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    smApp.playRequested = true;
    if (smApp.isPlaying || smApp.songIsLoading || !smApp.canPlay) {
        return;  // avoid nested timeout
    }
    smApp.audioPlayer.play();
    smApp.isPlaying = true;
    smApp.btnImg.src = "../images/pause.png";
    smApp.playRequested = false;  // don't need this now
}

function pause() {
    smApp.audioPlayer.pause();
    smApp.isPlaying = false;
    smApp.btnImg.src = "../images/play.png";
}

function formatDuration(duration) {
    let mins = Math.floor(duration / 60);
    let secs = Math.floor(duration % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}