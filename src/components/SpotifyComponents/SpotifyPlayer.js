import React, { useState, useEffect } from "react";

const SpotifyPlayer = (props) => {

    const {roomTracks} = props;

    const [player, setPlayer] = useState(undefined);

    const track = {
        name: "",
        album: {
            images: [
                { url: "" }
            ]
        },
        artists: [
            { name: "" }
        ]
    }
    
    const [trackList, setTrackList] = useState([]);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
    
            
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });
            
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            
            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }
            
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
            
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));

            player.connect();

            
            setPlayer(player);
        };

          
        
        setTrackList(roomTracks);
    }, []);



    return(
        <div className="container">
            <div className="main-wrapper">
                <img src={current_track.album.images[0].url} 
                        className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{
                                    current_track.name
                                    }</div>

                        <div className="now-playing__artist">{
                                    current_track.artists[0].name
                                    }
                        </div>
                    </div>    
            </div>
            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                &lt;&lt;
            </button>

            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                { is_paused ? "PLAY" : "PAUSE" }
            </button>

            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                &gt;&gt;
            </button>
        </div>
    );
}

export default SpotifyPlayer;