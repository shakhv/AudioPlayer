import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { actionAddPlaylist, deletePromise } from '../../actions/Actions';

import { useNavigate } from 'react-router';

import albumCreate from '../../images/albumCreate.png'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {Input} from '@mui/material'

import { Header } from './Body';
import { store } from '../../store/store';

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


const PlaylistCreate = ({onChange, action, value , setOpen, open , description , newIDPlaylist}) => { 
  const history = useNavigate()
  const handleClose = () => {
    setOpen(false)
  }

  const handleAdd = () => {
      action(value , description)
  }
 
  useEffect(() => {
    if(newIDPlaylist?.status === "FULFILLED"){
      history(`/Player/playlist/${newIDPlaylist?.payload?._id}`)
      setTimeout(() =>  deletePromise('addPlaylist' , store.getState().promise.addPlaylist?.payload?._id), 1000)
    }
  }, [newIDPlaylist]) 
  
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
                  onClick={() => handleAdd()} 
                  sx={{bgcolor : 'black', mt: 4, width: 200, color: 'aqua'}}>
                    SAVE
                  </Button>
                  
                </Box>
          </Modal>
  )
}

const CPlaylist = connect(state => ({newIDPlaylist: state.promise.addPlaylist || []}))(PlaylistCreate)


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
// !!!!!!!