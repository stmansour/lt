//
// VALIDATORS
// Facebook:
// For testing, use the Facebook Sharing Debugger tool to test how your website will
// appear when shared on Facebook. Here are the steps you can follow:
// 1. Go to the Facebook Sharing Debugger tool at https://developers.facebook.com/tools/debug/
// 2. Enter the URL of the page you want to test in the input field and click "Debug".
// 3. Facebook will fetch the data from your page and display it in a preview. You can
//    verify that the image and text are displayed correctly.
// 4. Click "Scrape Again" to refresh the preview if you have made changes to the metadata on
//    your website.
// 5. Once you are satisfied with the preview, you can click the "Share" button to share the
//    post to your Facebook profile or page. However, make sure to set the privacy settings
//    to "Only Me" so that the post is not visible to anyone else.
// 6. By using the Sharing Debugger tool, you can ensure that your Facebook post will appear
//    as expected before actually sharing it with others.
//
// Pinterest:
// Pinterest provides a tool called the "Rich Pins Validator" which allows you to
// validate the markup for your pins. The tool also provides guidance on how to improve
// the content of your pins. You can access the Rich Pins Validator by logging into your
// Pinterest account, clicking on the three dots in the top-right corner, and selecting
// "Create Pin". On the Create Pin page, you'll see a "Validate" button that will take
// you to the Rich Pins Validator.
//---------------------------------------------------------------------------------------
var smApp = {
    audioUrl: 'Gotta Be Tonight - Promo1 - 44_1.mp3',
    thisURL: `https://stevemansour.com/lt/gotta-be-tonight`,
    thisImg: 'https://stevemansour.com/lt/gotta-be-tonight/gotta-be-tonight.png',
    thisImgFB: 'https://stevemansour.com/lt/gotta-be-tonight/gotta-be-tonight-FB.png',
    thisLyrics: 'http://stevemansour.com/songwriter/lyrics/TalkToHer.html',
    thisTitle: "Check out the new GRAY single!",
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
    darkMode: false,
};

//  To find iTunes/Apple music links, see: https://tools.applemediaservices.com/
//
linkTree = {
    'iTunes': "https://geo.music.apple.com/us/album/gotta-be-tonight/1676877205?i=1676877206&itsct=music_box_link&itscg=30200&ls=1&app=music",
    'Spotify': "https://open.spotify.com/album/0uC3yMENeES9FVByEJ0Cxr?si=CygS1XpHToSAfk9UE_N0YQ",
    'AppleMusic': "https://geo.music.apple.com/us/album/gotta-be-tonight/1676877205?i=1676877206&itsct=music_box_link&itscg=30200&ls=1&app=music",
    'AmazonMusic': "https://amazon.com/music/player/albums/B0BY821KSQ?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_ZHfaoNyTX05dtmUu8CUWnUmfE",
    'Pandora': "https://pandora.app.link/cqbpXptIQyb",
    'YouTube': "https://youtu.be/rFZEELnioRw",
    'Deezer': "https://deezer.page.link/H4a9TUBesRYf4GgS7",
};

function toggleDarkMode() {
    const imageElements = document.querySelectorAll('img[src^="../images/light/"]');

    imageElements.forEach(function (element) {
        const currentSource = element.getAttribute('src');
        console.log("img.src = " + element.src);
        const newSource = currentSource.replace('../images/light/', '../images/dark/');
        element.setAttribute('src', newSource);
    });
}

window.addEventListener('load', () => {
    window.addEventListener('DOMContentLoaded', function () {
        let buttons = document.querySelectorAll('.button, .rbutton');

        buttons.forEach(function (button) {
            button.addEventListener('mouseleave', function () {
                button.style.backgroundColor = '';
                button.style.color = '';
            });
        });
    });

    if (smApp.darkMode) {
        toggleDarkMode();
    }
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

function showLyrics() {
    window.open(smApp.thisLyrics, '_blank');
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

function smButtonHandler(p) {
    var s1;
    var s2;
    var url;
    var keywords = getKeywords(p);
    var encKywd = encodeURIComponent(keywords);
    var encURL = encodeURIComponent(smApp.thisURL);
    var encImg = encodeURIComponent(smApp.thisImg);
    var encDescr = encodeURIComponent(smApp.thisDescription);
    var encTitle = encodeURIComponent(smApp.thisTitle);

    switch (p) {
        case "email":
            url = `mailto:?subject=` + encTitle + `&body=` + encDescr + "%20%20" + encURL;
            break;
        case "facebook":
            url = `https://www.facebook.com/sharer/sharer.php?u=${encURL}`;
            url += '&utm_source=social'
            break;
        case "follow":
            url = `https://open.spotify.com/artist/3s3DaEbal34U64C5aIDtVZ`;
            break;
        case "pinterest":
            s2 = getKeywords('pinterest');
            url = `https://pinterest.com/pin/create/button/?url=${encURL}&media=${encImg}&description=${encDescr}&hashtags=${encKywd}`;
            url += '&utm_source=social'
            break;
        case "reddit":
            // // https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsubmit%3Furl%3Dhttps%253A%252F%252Fkindlethefire.hearnow.com%252Fcloser%26title%3DCloser%2520by%2520Kindle%2520the%2520Fire
            url = "https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsubmit%3Furl%3D" + encURL + '%26title%3D' + encTitle;
            url += '&utm_source=social'
            break;
        case "tumblr":
            // for reference to the url format:  https://www.tumblr.com/docs/en/share_button
            encTitle = encodeURIComponent('<a href="' + smApp.thisURL + '">' + smApp.thisTitle + "</a><br><br>");
            url = "https://www.tumblr.com/widgets/share/tool?posttype=photo&content=" + encImg + "&canonicalUrl=" + encURL + "&caption=" + encTitle + "&tags=" + encKywd;
            url += '&utm_source=social'
            break;
        case "twitter":
            const image = document.getElementById('songArt').getAttribute('data-image');
            url = `https://twitter.com/intent/tweet?text=${encTitle}&url=${encURL}&hashtags=${encKywd}&media=${image}`;
            url += '&utm_source=social'
            break;
        default:
            console.log("unrecognized social media platform = " + p);
            return;
    }
    console.log(url);
    window.open(url, '_blank');
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