import React, {useEffect } from 'react'
import "../css/player.css"

import { SideBar } from '../components/Sidebar'
import { Body} from '../components/Body/Body'

import Footer from '../components/Footer'
import { useParams } from 'react-router'
import { store } from '../store/store'
import {actionGetUserData, actionGetUserPlaylists} from '../actions/Actions'



function Player() {

  useEffect(() => {
    if(localStorage.authToken){
      store.dispatch(actionGetUserData())
      store.dispatch(actionGetUserPlaylists())
    }
  }, [])
  
  
  return (
    <div className='player'>
      <div className='player__body'>
          <SideBar />
          <Body />
      </div>
      <Footer />
    
    </div>
  )
}

export default Player