import {backendURL } from './promiseReducer';
import { store } from './store';

const audio = new Audio;

export function audioReducer(state = [], {type , playlist ,track, url ,_id ,  currentTime ,duration , volume , repeat }) {
    if (!state) {
          return {};
    }
    if(type === "PLAY"){
          return {
                ...state,
                isPlaying : true,
          }
    }
    if(type === "PAUSE"){
          return {
                ...state ,
                isPlaying : false ,
          }
    }

    if(type === "SET_REPEAT"){
            return {
                  ...state ,
                  repeat
                  }
      }
   
    if(type === "GET_DURATION"){
          return {
                ...state , 
                duration
          }
    }
    
    if(type === "SET_PLAYLIST"){
          return {
                ...state, 
                playlist: {playlist},
          }
    }
    if(type === "SET_CURRENT_TIME"){
          return {
                ...state , 
                currentTime
          }
    }
    if(type === "SET_VOLUME"){
          return {
                ...state,
                volume
          }
    }
    if(type === "SET_TRACK"){
          return {
                ...state,
                  track: track ,
                  url: url, 
                  _id: _id
          }
    }
    
    return state;
}

const setPlay = () => ({ type: "PLAY"});
const setPause = (currentTime) => ({ type : "PAUSE" , currentTime})
const setDuration  = (duration) => ({ type: "GET_DURATION" , duration})
const setCurrentTime = (currentTime) => ({type: "SET_CURRENT_TIME" , currentTime})
const setTrack = (track , url , _id ) => ({type: 'SET_TRACK', track , url , _id})
const setPlaylist = (playlist) => ({type:'SET_PLAYLIST', playlist})
const setVolume = (value) => ({type: 'SET_VOLUME' , volume: value})
const setRepeat = (repeat) => ({type: `SET_REPEAT` , repeat})


export const actionFullCurrentTime = (time) =>
    (dispatch, getState) => {
      audio.currentTime = time
      getState().playerReducer?.isPlaying ? setTimeout(function() {
            audio.play()
        }, 0) : setTimeout(function() {
            audio.pause()
        }, 0);
      dispatch(setCurrentTime(time))
      audio.onended = () =>{
            getState().playerReducer?.repeat === true ?  
            dispatch(actionSetTrack(getState().playerReducer?.track ,getState().playerReducer?.url , getState().playerReducer?._id))
            : dispatch(actionNextTrack(getState().playerReducer?._id))  
     } 
    }


audio.ontimeupdate = (e) => store.dispatch(setCurrentTime(e.target.currentTime))

                  

export const actionSetVolume = (volume) =>  dispatch => {
      audio.volume = volume
      dispatch(setVolume(volume))
  }


export const actionFullPlay = () => dispatch => {
      dispatch(setPlay())
      audio.play(); 
}     


export const actionFullDuration = (duration) =>  dispatch => {
      audio.ondurationchange = () => {
            duration = audio.duration
      }
      dispatch(setDuration(Math.round(duration)))
}

audio.onloadedmetadata = (() => store.dispatch(actionFullDuration(audio.duration)))

export const actionFullPause = () => 
      async (dispatch) => {
            dispatch(setPause(audio.currentTime))
            audio.pause();
}


export const actionSetTrack = (track , url , _id) => 
     async (dispatch , getState) => {
      audio.src = backendURL + '/' + url 
      dispatch(setTrack(track ,url , _id))
      dispatch(setPlay())
      audio.play()
}


export const actionFullSetPlaylist = (playlist) =>
 dispatch => {
      dispatch(setPlaylist(playlist));
 }
    

export const actionPrevTrack = (_id) =>
    async (dispatch, getState) => {
        const playlist = getState().playerReducer?.playlist?.playlist?.tracks
            const track_id = `${_id}`
            const count = playlist.findIndex(el => el._id === track_id)
            if(count > 0){
                  dispatch(actionSetTrack(playlist[count - 1].originalFileName ,playlist[count - 1].url , playlist[count - 1]._id ))
            }
    }


export const actionNextTrack = (_id) =>
    async (dispatch, getState) => {
        const playlist = getState().playerReducer?.playlist?.playlist?.tracks
            const track_id = `${_id}`
            const count = playlist.findIndex(el => el._id === track_id)
            if(count + 1 < playlist.length){
                  dispatch(actionSetTrack(playlist[count + 1].originalFileName ,playlist[count + 1].url , playlist[count + 1]._id ))
            }
    }
ывфывфвф

export const actionRepeat = (repeat) => 
      async (dispatch) => {
            dispatch(setRepeat(repeat))
      }


export const actionRandom = () => 
      async(dispatch , getState) => {
            const playlist = getState().playerReducer?.playlist?.playlist?.tracks
            if(playlist){
                const random =  Math.round(Math.random() * playlist.length)
                  if(random){
                        dispatch(actionSetTrack(playlist[random].originalFileName ,playlist[random].url , playlist[random]._id ))
                  }
            }
      }
