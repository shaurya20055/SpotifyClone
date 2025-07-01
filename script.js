let song=[]
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    return `${paddedMins}:${paddedSecs}`;
}
let curFolder;
async function getSongs(folder) {
    curFolder=folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response=await a.text();
    
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a");
     song=[]
    for(let i=0;i<as.length;i++)
    {
        const element=as[i];
        if(element.href.endsWith(".mp3")){
            song.push(element.href.split(`/${folder}/`)[1])
        }

    }


    let songOL=document.querySelector(".songList").getElementsByTagName("ol")[0];
    songOL.innerHTML="";
    for (const son of song) {
        songOL.innerHTML=songOL.innerHTML +`
        <li>
                        <img src="./img/music.svg" alt="">
                        <div class="info">
                            <div>${son.replaceAll("%20"," ")}</div> 
                        <div>Artist </div>
                        </div>
                        <div class="playnow ">
                            <span>Play Now</span><img src="./img/play.svg" alt=""> </div>
                        
                    </li> ` ;      
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
            playsong(e.querySelector(".info").firstElementChild.innerHTML.trim(),true)
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return song

}

let currentSong=new Audio();
const playsong=(track,plays=true)=>{
    currentSong.src=`/${curFolder}/`+track;
    if(plays){
    currentSong.play()
    play.src="/img/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function dispalyFolder() {
    let a= await fetch(`http://127.0.0.1:5500/songs/`)
    let response=await a.text();
    
    let div=document.createElement("div")
    div.innerHTML=response
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardContainer");
    let array=Array.from(anchors)
    for(let i=0;i<array.length;i++){
        const e=array[i]
        
        if(e.href.includes("/songs/"))
        {
           let folder=e.href.split("/songs/").slice(-1)[0]
           console.log(folder)
           let a= await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
           let response=await a.json()
           cardContainer.innerHTML=cardContainer.innerHTML+` <div data-folder="${folder}" class="cards">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 60 60">
                                <!-- Circle background -->
                                <circle cx="30" cy="30" r="30" fill="#28a745" />
                                
                                <!-- Play icon -->
                                <polygon points="22,15 22,45 46,30" fill="white" />
                              </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg">
                        <h2>
                            ${response.title}
                        </h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    //Clicking on card event handling
    Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        e.addEventListener("click",async item=>{
            song=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playsong(song[0])
        })
    })
}
async function main() {
    
    await getSongs("songs/like");
    playsong(song[0],false)

    //Display Foldr
    dispalyFolder();
    //Play pause wala kaam
    play.addEventListener("click",()=>{
        if(currentSong.paused)
        {
            currentSong.play()
            play.src="./img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="./img/play.svg"
        }
    })
    //song time update kar rhe hai
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +`%`
    })

    //seekbar ki position change kar rhe
    document.querySelector(".seekbar").addEventListener("click",e=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 +`%`
        currentSong.currentTime=(e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration
    })
    //hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%";
    })

    previous.addEventListener("click",()=>{
        console.log(currentSong.src.split("/").slice(-1)[0])
        let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index!=0){
        playsong(song[index-1])
        }
    })
    next.addEventListener("click",()=>{
        console.log(currentSong.src.split("/").slice(-1)[0])
        let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index<song.length-1){
        playsong(song[index+1])
        }
    })
    //volume increase decrease 
    document.getElementsByTagName("input")[0].addEventListener("change",e=>{
        currentSong.volume=parseInt(e.target.value)/100;
    })

   
}
main()