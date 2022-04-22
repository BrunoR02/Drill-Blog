
const playBtn = document.getElementById("radio-play")
const radioContainer = document.getElementById('radio-container')
const radio = document.getElementById('radio')
//const duration = document.getElementById('duration')
//const seekSlider = document.getElementById('seek-slider')
//const currentTime = document.getElementById('current-time')
const VolumeContainer = document.getElementById('volume')
const volumeSlider = document.getElementById('volume-slider')
const muteBtn = document.getElementById('mute-button')
const nextBtn = document.getElementById('radio-next')
const radioSource = document.getElementById('radio-source')
const songName = document.getElementById('song-name')

let pauseSize = '100%'
let playSize = '80%'

if(screen.width < 768){
    pauseSize = '80%'
    playSize = '60%'
    nextBtn.style.backgroundSize = "60%"
}

var listSongs = []
let currentSong = 0
let state = "paused"
let muteState = "unmute"

if(sessionStorage['shuffled'] === 'true'){
    listSongs = sessionStorage['list'].split(',')
    currentSong = parseInt(sessionStorage['atual'])
    radio.currentTime = sessionStorage['time']
    if(sessionStorage['oldURL'] != location.href){
        state = sessionStorage['state']
    } else {
        state = "paused"
    }
    radio.volume = parseInt(sessionStorage['volume']) / 100
    volumeSlider.value = parseInt(sessionStorage['volume'])
    if(volumeSlider.value < 40){
        muteBtn.style.backgroundImage = "url('/img/icons/volume low.png')"
    } else{
        muteBtn.style.backgroundImage = "url('/img/icons/volume.png')"
    }
    if(state == "paused"){
        playBtn.style.backgroundSize = playSize
    } else{
        playBtn.style.backgroundSize = pauseSize
    }
    let source = ''
    if(window.location.href.includes('post') || window.location.href.includes('admin')){
        source = `../music/${listSongs[currentSong]}.mp3`
    } else{
        source = `/music/${listSongs[currentSong]}.mp3`
    }
    radioSource.src = encodeURIComponent(source)
    songName.innerHTML = listSongs[currentSong]
    radio.load()
}


if(!sessionStorage['shuffled']){
    sessionStorage['shuffled'] = 'false'
    sessionStorage['list'] = shuffle(["Central Cee - 6 For 6", "Central Cee - Day in The Life", "Dusty Locane - Eden Rocc", 
    "Dusty Locane - Rolando", "Dusty Locane ft. Rah Swish - Big Woos", "Eli Fross - Miracle", "Fivio Foreign - Wetty",
    "Fivio Foreign ft. Quavo - Magic City", "LD (67) - First Day Out", "Pop Smoke - Dior", "Pop Smoke - Flexing",
    "Sheff G - No Suburban Pt. 2", "Sheff G ft. Sleepy Hallow - Automatic", "Sleepy Hallow ft. Fousheé - Deep End Freestyle",
    "Sleepy Hallow ft. Sheff G - Tip Toe", "Tion Wayne ft. ArrDee - Wid It", "Sheff G ft. Sleepy Harlow & Double G - Panic 2", 
    "Fredo ft. Central Cee - Meant To Be", "Russ Millions ft. Tion Wayne - Body", "Tion Wayne - Where Were They"])
    listSongs = sessionStorage['list'].split(',')
    sessionStorage['atual'] = '0'
    sessionStorage['time'] = radio.currentTime
    sessionStorage['state'] = state
    sessionStorage['volume'] = volumeSlider.value.toString()
    sessionStorage['oldURL'] = location.href
    let source = ''
    if(window.location.href.includes('post') || window.location.href.includes('admin')){
        source = `../music/${listSongs[currentSong]}.mp3`
    } else{
        source = `/music/${listSongs[currentSong]}.mp3`
    }
    radioSource.src = encodeURIComponent(source)
    songName.innerHTML = listSongs[currentSong]
    radio.load()
}


function shuffle(array){
    let currentIndex = array.length, randomIndex

    while(currentIndex != 0){

        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]

    }
    return array
}


function PlaySong(n){
    if(state =="paused"){
        radio.play()
        playBtn.style.backgroundImage = "url('/img/icons/pausa.png')"
        playBtn.style.backgroundSize = pauseSize
        // requestAnimationFrame(whilePlaying)
        state= "played"
        sessionStorage['state'] = state
    } else if(state == "played"){
        if(!n){
            radio.pause()
            playBtn.style.backgroundImage = "url('/img/icons/botao-play.png')"
            playBtn.style.backgroundSize = playSize
            // cancelAnimationFrame(rAF)
            state = "paused"
            sessionStorage['state'] = state
        } else{
            radio.play()
            playBtn.style.backgroundImage = "url('/img/icons/pausa.png')"
            playBtn.style.backgroundSize = pauseSize
            sessionStorage['state'] = state
        }
    }
}


document.addEventListener('readystatechange',()=>{
    if(sessionStorage['shuffled'] === 'false'){
        sessionStorage['shuffled'] = 'true'
    }
    
    radio.currentTime = sessionStorage['time']
    radio.volume = parseInt(sessionStorage['volume']) / 100
    if(sessionStorage['oldURL'] != location.href){
        if(state == 'played') {
            radio.play()
            playBtn.style.backgroundImage = "url('/img/icons/pausa.png')"
            playBtn.style.backgroundSize = pauseSize
        }
    }
    
})




function NextSong(){

    if((listSongs.length - 1) === currentSong){
        currentSong = 0
        sessionStorage['atual'] = currentSong.toString()
    } else{
        currentSong++
        sessionStorage['atual'] = currentSong.toString()
    } 
    let source = ''
    if(window.location.href.includes('post') || window.location.href.includes('admin')){
        source = `../music/${listSongs[currentSong]}.mp3`
    } else{
        source = `/music/${listSongs[currentSong]}.mp3`
    }
    radioSource.src = encodeURIComponent(source)
    songName.innerHTML = listSongs[currentSong]
    radio.load()
    PlaySong(true)
}


/*let rAF = null

const calculateTime = (secs) =>{
    const min = Math.floor(secs / 60)
    const seg = Math.floor(secs % 60)
    const returnedSeg = seg < 10 ? `0${seg}` : `${seg}`
    return `${min}:${returnedSeg}`
}

const setSliderMax = () =>{
    seekSlider.max = Math.floor(radio.duration)
}

const displayBufferedAmmount = () =>{
    const bufferedAmount = radio.buffered.end(radio.buffered.length - 1)
    // const seekableAmount = radio.seekable.end(radio.seekable.length - 1)
    radioContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`)
}

const whilePlaying = ()=>{
    seekSlider.value = Math.floor(radio.currentTime)
    currentTime.innerHTML = calculateTime(seekSlider.value)
    radioContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`)
    rAF = requestAnimationFrame(whilePlaying)
}


if(radio.readyState > 0) {
    duration.innerHTML = calculateTime(radio.duration)
    setSliderMax()
    displayBufferedAmmount()
} else{
    radio.addEventListener("loadedmetadata", ()=>{
        duration.innerHTML = calculateTime(radio.duration)
        setSliderMax()
        displayBufferedAmmount()
    })
}

radio.addEventListener('progress', displayBufferedAmmount)

seekSlider.addEventListener('input', () =>{
    currentTime.innerHTML = calculateTime(seekSlider.value)
    if(!radio.paused){
        cancelAnimationFrame(rAF)
    }
})

seekSlider.addEventListener('change', ()=>{
    radio.currentTime = seekSlider.value
    if(!radio.paused){
        requestAnimationFrame(whilePlaying)
    }
})  
*/

radio.addEventListener('timeupdate', ()=>{
    sessionStorage['time'] = radio.currentTime
})

playBtn.addEventListener("click",() =>{PlaySong(false)})

volumeSlider.addEventListener('input', (e)=>{
    const value = e.target.value
    radio.volume = value / 100
    sessionStorage['volume'] = value.toString()
})

volumeSlider.addEventListener('change', (e)=>{
    
    if(muteState === 'mute' && e.target.value > 0){
        muteState = 'unmute'
        radio.muted = false
        if(e.target.value > 39){
            muteBtn.style.backgroundImage = "url('/img/icons/volume.png')"
        } else {
            muteBtn.style.backgroundImage = "url('/img/icons/volume low.png')"
        }
    } else if(e.target.value == 0){
        muteState = 'mute'
        muteBtn.style.backgroundImage = "url('/img/icons/mute.png')"
    }

    if(muteState === 'unmute'){
        if(e.target.value < 40){
            muteBtn.style.backgroundImage = "url('/img/icons/volume low.png')"
        } else{
            muteBtn.style.backgroundImage = "url('/img/icons/volume.png')"
        }
    } 
})

let preVolume = 0

muteBtn.addEventListener('click',()=>{
    if(muteState === 'unmute'){
        radio.muted = true  
        preVolume = volumeSlider.value
        volumeSlider.value = 0 
        muteState = 'mute'         
        muteBtn.style.backgroundImage = "url('/img/icons/mute.png')"
                                                                                                  
    } else{
        radio.muted = false
        muteState = 'unmute'
        volumeSlider.value = preVolume
        muteBtn.style.backgroundImage = "url('/img/icons/volume.png')"
        if(preVolume < 40){
            muteBtn.style.backgroundImage = "url('/img/icons/volume low.png')"
        } else{
            muteBtn.style.backgroundImage = "url('/img/icons/volume.png')"
        }
    }
})

//Volume Animation

let mouseOn = false
if (screen.width > 768){
    volume.addEventListener('mouseenter',()=>{
        volumeSlider.style.animationName = 'slide'
        volumeSlider.style.animationDirection = 'normal'
    })

    volume.addEventListener('mouseleave',()=>{
        volumeSlider.style.animationName = 'slideBack'
    })
}

nextBtn.addEventListener('click', ()=>{setTimeout(NextSong,250)})


radio.addEventListener('ended', ()=>{setTimeout(NextSong,250)})


