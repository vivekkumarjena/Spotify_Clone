console.log("JS Let' go!!!!");
let currentSong = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    //console.log(response);                                //Just for testing
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs;
}

function convertSecondsToMinutes(seconds) {
    // Convert seconds to an integer (rounding down)
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad the minutes and seconds with leading zeros if needed
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${paddedMinutes}:${paddedSeconds}`;
}


const playMusic = (track) => {
    // audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track
    currentSong.play();
    play.src = "/assets/pause.svg"
    document.querySelector(".songinfo").innerHTML = track.replaceAll(".mp3" , " ")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    //Get the list of all songs
    let songs = await getSongs();
    // console.log(songs);          //just for testing

    //By default song that should be played if we click on the play button.
    currentSong.src = "/songs/" + songs[0];
    document.querySelector(".songinfo").innerHTML = songs[0].replaceAll(".mp3" , " ")

    //Show the list of all songs in the Playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
        <li>
            <div class="image-container"></div>
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
        </li>` ;
    }

    //Attach an Event-Listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e => {
        // console.log(e.getElementsByTagName("div")[1].getElementsByTagName("div")[0]);

        e.addEventListener("click" , element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
           
        })
    })

    //Attach an event Listener to previous , play and next
    play.addEventListener("click" , () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "/assets/pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "/assets/playbar-play.svg"
        }
    })

    //Listen for time-update event
    currentSong.addEventListener("timeupdate" , () => {
    //   console.log(currentSong.currentTime , currentSong.duration);

      document.querySelector(".songtime").innerHTML = convertSecondsToMinutes(currentSong.currentTime) + "/" + convertSecondsToMinutes(currentSong.duration);

      document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    }
    )

    //Add an Event Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e=>{
        console.log((e.offsetX/e.target.getBoundingClientRect().width) * 100);       //getBoundingClientrect gives us the exact dimentions of the targeted element.  Here we are trying to find the percentage of width that we have clicked upon.

        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width) * 100 + "%"
        let x = e.offsetX/e.target.getBoundingClientRect().width;
        currentSong.currentTime = x * currentSong.duration;
    })

}
main();