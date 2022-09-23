import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { actionAddPlaylist } from '../../actions/Actions';

import { useNavigate } from 'react-router';

import albumCreate from '../../images/albumCreate.png'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {Input} from '@mui/material'

import { Header } from './Body';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 270,
  height: 250,
  color: 'black',
  bgcolor: '#FFFFFF',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};





const Playlist = ({onChange, action, value , setOpen, open , description , newIDPlaylist}) => { 
  const [id , setID] = useState('')
  const history = useNavigate()
  const handleClose = () => {
    setOpen(false)
  }

 useEffect(() => {
  setID(newIDPlaylist)
  if(id?._id && value){
    history(`/Player/playlist/${id._id}`)
    console.log(id?._id)
  }
 }, [newIDPlaylist , id])
 

  return (
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
    <Box sx={style}>
         <Typography id="modal-modal-title" variant="h6" component="h2">
          CHANGE DETAILS
        </Typography>
                <Input 
                  placeholder='My Playlist № 2' 
                  value={value}
                  onChange={onChange}
                  sx={{mt: 1, width: 200}}/>
             
                  <Input 
                  placeholder='Description(not neccesary)' 
                  description={description}
                  sx={{mt: 1, width: 200}}/>
                 
                  <Button 
                  onClick={() => action(value , description)} 
                  sx={{bgcolor : 'black', mt: 4, width: 200, color: 'aqua'}}>
                    SAVE
                  </Button>
                  
                  
                </Box>
          </Modal>
  )
}

const CPlaylist = connect(state => ({newIDPlaylist: state.promise.addPlaylist?.payload }))(Playlist)

    
const CreatePlaylist = ({create}) => {
  const [playlist , setPlaylist] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setPlaylist([{key: Date.now(), value: ''}, ...playlist])
  }

 
  return (
    <div className='body'> 
      <Header/>
        <div className='body__info'>
          <img src={albumCreate} alt=''/>
          <div className='body__infoText' onClick={handleOpen}>
                  <strong>Public Playlist</strong>
                  <h2 >My Playlist № 2</h2>
                  <p>description</p>
          </div>

            {
            playlist.map(({value, key , description}, index) => {
                return <CPlaylist  value={value}
                                  description={description}
                                  open={open}
                                  setOpen={setOpen}
                                  key={key}
                                  action={create}
                                  onChange={(e) => {
                                    const newplaylist = [...playlist]
                                    newplaylist[index].value = e.target.value
                                    setPlaylist(newplaylist)
                                  }
                  }/>
              })
            }


        </div>
      <div className='body__songs'>
<hr/> 
            <h2>Let`s add tracks to your playlist</h2>
      </div>
    </div>
  )
}


export const CCreatePlaylist = connect(null, {create: actionAddPlaylist})(CreatePlaylist)



























































// const Playlist = ({ player, playlist, setPlaylist, updPlaylist, setIndex }) => {
//   let [_tracks, setTracks] = useState()
//   let [_player, setPlayer] = useState()
//   useEffect(() => setPlayer(player), [player])
//   useEffect(() => setTracks(playlist[0]?.tracks), [playlist])

//   const onSortEnd = ({ oldIndex, newIndex }) => {
//     let newArr = arrayMoveImmutable(_tracks, oldIndex, newIndex)
//     setTracks(newArr)
//     updPlaylist(playlist[0]._id, newArr.map(track => ({ _id: track._id })))

//     if(_player?.playlist?._id === playlist[0]?._id) {
//       setPlaylist({..._player.playlist, 'tracks': newArr})
//       if (_player?.track) setIndex(newArr.map((item) => item._id).indexOf(_player?.track?._id))
//     }
//   };

//   return (
//     <>
//       <h2 style={{fontSize:'large'}} className='highlightGreen'>{playlist[0]?.name || 'Playlist'}</h2>
//       <SortableContainer onSortEnd={onSortEnd}>
//         { (_tracks || []).map((track, index) => <SortableItem key={track._id} index={index} track={track} playlist={playlist[0]} />) }
//       </SortableContainer>
//     </>
//   )
// }
// export const PlaylistConnect = connect(
//   state => ({
//     playlist: state.promise.playlistTracks?.payload || [],
//     player: state.player || {}
//   }),
//   {
//     updPlaylist: action.actionUpdatePlaylist,
//     setPlaylist: action.setPlaylist,
//     setIndex: action.setIndex
//   }
// )(Playlist)