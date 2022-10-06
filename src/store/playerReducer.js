import {backendURL } from './promiseReducer';
import { store } from './store';

const audio = new Audio;

export function audioReducer(state = [], {type , playlist , playlist_id ,tracks_id ,track, url ,_id ,  currentTime ,duration , volume , repeat , index}) {
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
                playlist: {playlist , playlist_id, tracks: [tracks_id]},
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
    if(type === "INDEX"){
      return {
            ...state,
               index
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
const setPlaylist = (playlist , playlist_id , tracks_id) => ({type:'SET_PLAYLIST', playlist , playlist_id , tracks_id})
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
    }


audio.ontimeupdate = (e) => store.dispatch(setCurrentTime(e.target.currentTime))
audio.onended = () =>{
       store.getState().playerReducer?.repeat === true ?  
       store.dispatch(actionSetTrack(store.getState().playerReducer?.track , store.getState().playerReducer?.url , store.getState().playerReducer?._id))
       : store.dispatch(actionNextTrack(store.getState().playerReducer?._id))  
} 
                  

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


export const actionFullPause = () => 
      async (dispatch) => {
            dispatch(setPause(audio.currentTime))
            audio.pause();
}


export const actionSetTrack = (track , url , _id) => 
     async (dispatch , getState) => {
      audio.src = backendURL + '/' + url 
      dispatch(setTrack(track ,url , _id))
      audio.onloadedmetadata = (() => dispatch(actionFullDuration(audio.duration)))
      dispatch(setPlay())
      audio.play()
}


export const actionFullSetPlaylist = (playlist , playlist_id , tracks_id) =>
 dispatch => {
      dispatch(setPlaylist(playlist ,playlist_id , tracks_id));
 }
    

export const actionPrevTrack = (_id) =>
    async (dispatch, getState) => {
        const playlist = [getState().playerReducer?.playlist?.tracks[0]]
        if (playlist) {
            const track_id = `${_id}`
            const count = playlist[0].findIndex(el => el._id === track_id)
            if(count > 0){
                  dispatch(actionSetTrack(playlist[0][count - 1].originalFileName ,playlist[0][count - 1].url , playlist[0][count - 1]._id ))
            }
        }
    }


export const actionNextTrack = (_id) =>
    async (dispatch, getState) => {
        const playlist = [getState().playerReducer?.playlist?.tracks[0]]
        if (playlist) {
            const track_id = `${_id}`
            const count = playlist[0].findIndex(el => el._id === track_id)
            if(count + 1 < playlist[0].length){
                  dispatch(actionSetTrack(playlist[0][count + 1].originalFileName ,playlist[0][count + 1].url , playlist[0][count + 1]._id ))
            }
        }
    }


export const actionRepeat = (repeat) => 
      async (dispatch) => {
            dispatch(setRepeat(repeat))
      }


export const actionRandom = () => 
      async(dispatch , getState) => {
            const playlist = [getState().playerReducer?.playlist?.tracks[0]]
            if(playlist){
                const random =  Math.round(Math.random() * playlist[0].length)
                if(random){
                       dispatch(actionSetTrack(playlist[0][random].originalFileName ,playlist[0][random].url , playlist[0][random]._id ))
                }
            }
      }
