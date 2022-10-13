import React , {useState , useEffect} from 'react'

import '../css/footer.css'
import { PlayCircleOutline, PlaylistPlay,VolumeDown } from '@mui/icons-material'
import { PauseCircleFilledOutlined } from '@mui/icons-material'
import { SkipPrevious } from '@mui/icons-material'
import { SkipNext } from '@mui/icons-material'
import { Shuffle } from '@mui/icons-material'
import { Repeat } from '@mui/icons-material'
import { Grid, Slider } from '@mui/material'
import { connect } from 'react-redux'
import { actionFullCurrentTime, actionFullPause, actionFullPlay, actionNextTrack,actionPrevTrack, actionRandom, actionRepeat,actionSetVolume} from '../store/playerReducer'
import { store } from '../store/store'
import albumCover from '../images/albumCreate.png'



const FooterTitle = ({track  , duration , currentTime , setCurrentTime}) => {
  return (
<>

      {
        track ? 

          <div className='footer__left'>
                <img src={albumCover} alt=''className='footer__albumLogo'/>
                <div className='footer__songInfo'>
                    <h4>{track}</h4>
                    <Slider 
                            size='small'
                            type='range'
                            aria-label="time-indicator"
                            value={currentTime || 0}
                            min={0}
                            step={1}
                            max={duration || 0}
                            onChange={(e) => setCurrentTime(e.target.value)}
                              sx={{
                                color: 'rgba(0,0,0,0.87)',
                                height: 4,
                                '& .MuiSlider-thumb': {
                                  width: 8,
                                  height: 8,
                                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                  '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                  }
                                  },
                                  '&.Mui-active': {
                                    width: 20,
                                    height: 20,
                                  },
                                  '& .MuiSlider-rail': {
                                    opacity: 0.28,
                                  },
                              }}
                      /> 
                  
                </div>
          </div>  : <div className='footer__left'></div>

      }
</>

  )
}


const CFooterTitle = connect(state => ({
  track: state.playerReducer?.track,
  duration: state.playerReducer?.duration,
  currentTime: state.playerReducer?.currentTime
}), 
{
  setCurrentTime: actionFullCurrentTime
}
)(FooterTitle)




const FooterControl = ({isPlaying ,_id , repeat , repeatView , random }) =>{
  const [rep , setRep] = useState()


  useEffect(() => {
    setRep(repeatView)
  }, [repeatView])
  

  const handleRepeat = () => {
      rep === true ? repeat(false) : repeat(true)
  }

  return (
    <div className='footer__center'>
            <Shuffle className="footer__silver" onClick={() => random()}/>
            <SkipPrevious className='footer__icon' onClick={() =>  store.dispatch(actionPrevTrack(_id))}/>
            {
               isPlaying !== true ?
            <PlayCircleOutline fontSize='large' className='footer__icon' onClick={() => store.dispatch(actionFullPlay())} /> : <PauseCircleFilledOutlined fontSize='large' className='footer__icon'  onClick={() => store.dispatch(actionFullPause())}/>
            }
            <SkipNext className='footer__icon' onClick={() => store.dispatch(actionNextTrack(_id))}/>
            <Repeat className={repeatView === true ? "footer__aqua" : "footer__silver"} onClick={() => handleRepeat()}/>
    </div>
  )
}


const CFooterControl = connect(state => ({
  isPlaying: state.playerReducer?.isPlaying,
  _id: state.playerReducer?._id,
  repeatView: state.playerReducer?.repeat ,
}),
{
  repeat: actionRepeat , 
  random: actionRandom
}
)(FooterControl)


const VolumeControl = ({changeVolume}) => {
  return (
    <Grid item xs>
        <Slider min={0} step={0.05} max={1} defaultValue={1} onChange={(e) => changeVolume(e.target.value)}/>
    </Grid>
  )
}

export const CVolumeControl = connect(state => ({
}
  ),
{
  changeVolume: actionSetVolume
})(VolumeControl)


function Footer() {
  return (

      <div className='footer'>
        <CFooterTitle />
        <CFooterControl/> 
          <div className='footer__right'>
              <Grid container spacing={2}>
                <Grid item>
                  <PlaylistPlay />
                </Grid>
                <Grid item>
                  <VolumeDown />
                </Grid>
                <CVolumeControl />
              </Grid>
          </div>
      </div>
    
  )
}

export default Footer
