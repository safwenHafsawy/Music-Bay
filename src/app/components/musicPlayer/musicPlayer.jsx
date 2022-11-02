import React, {useState, useEffect} from "react";
import "./musicPlayer.scss";

function MusicPlayer() {
    const [audioCtx, setAudioCtx] = useState(new AudioContext());
    const [audioSource, setAudioSource] = useState(null);

    useEffect(() => {
        if (audioCtx)
            setAudioSource(audioCtx.createBufferSource())
        console.log(audioSource)
    }, [audioCtx])

    useEffect(() => console.log("audio source : ", audioSource), [audioSource])

    async function playAudio() {
        const response = await fetch("http://localhost:5050/public/music/jazz1.mp3")
        if (response.status === 404) throw new Error("file not found")
        let audioBuffer = await response.arrayBuffer();
        audioBuffer = await audioCtx.decodeAudioData(audioBuffer)

        audioSource.buffer = audioBuffer;
        audioSource.connect(audioCtx.destination);
        audioSource.start();
    }

    function stopAudio() {
        console.log(audioSource)
        audioSource.stop();
        setAudioSource(audioCtx.createBufferSource());
    }

    return (
        <div id="musicplayer_full">
            <div id="controls">
                <button onClick={playAudio}>Play Music</button>
                <button onClick={stopAudio}>Stop Music</button>
            </div>
        </div>
    )
}

export default MusicPlayer;
