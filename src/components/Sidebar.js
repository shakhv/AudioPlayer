import React, { useEffect, useState } from 'react'
import '../css/sidebar.css'
import logo from '../images/logo.svg'

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import AddIcon from '@mui/icons-material/LibraryMusic';

import AddIcon from '@mui/icons-material/Add';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { actionAddPlaylist } from '../actions/Actions';

import { Input, Grid} from "@nextui-org/react";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button } from '@mui/material';
import { create } from '@mui/material/styles/createTransitions';




const  SidebarOptions = ({ title ,Icon })=> {

    return (
         <div className="sidebarOption">
            {Icon && <Icon className = "sidebarOption__icon"/>}
            {Icon ? <Link to={`/Player/${title}`}><h4>{title}</h4></Link>: ''}
        </div>  
    )
}


   


const SideBarMenuItem = ({playlist: {_id, name}}) =>
      <li className="sidebarOption">
          <Link to={`/Player/playlist/${_id}`} className="link__sidebar ">{name}</Link>
      </li>


const SideBarContainer = ({playlists = []}) =>
      <ul>
          {playlists.map(item => 
          item.name !== null ? <SideBarMenuItem playlist={item} key={item._id}/> : []).reverse()}
      </ul>


const SideBarConnect = connect((state) => ({playlists: state.promise.userPlaylists?.payload}))(SideBarContainer)




//  !MAIN WORKING
function Playlist({onChange, action, value }) {


    return (
        <div>
           <div className='input__content'>
               <Grid className='input__name__playlist'>
                 <Input
                    aria-label="Back to the page"
                    clearable
                    status="default" 
                    labelLeft="Playlist:" 
                    placeholder="Name" 
                    value={value}
                    onChange={onChange}
                   />
            
            </Grid>
            <SendOutlinedIcon 
                onClick={() => {action(value); }} 
                className="icon__send__playlist"
                ></SendOutlinedIcon>
           </div>
        </div>
    )
}


function PlaylistAdd({add}) {
    const [playlist, setPlaylist] = useState([])
    const [clicked, setClicked] = useState(false)
      

    return (
        <> 
       
            {
                    <Button disabled={clicked}>
                        <AddIcon 
                        disabled = {clicked}
                        className='sidebarOption' 
                        onClick={() =>  setPlaylist([{key: Date.now(), value: ''}, ...playlist] , setClicked(true))}/>
                    </Button>
                    
            }


       

          {playlist.map(({value, key}, index) => {
            return <Playlist value={value}
                          key={key}
                          action={add}
                          onChange={(e) => {
                            const newplaylist = [...playlist]
                            newplaylist[index].value = e.target.value
                            setPlaylist(newplaylist)
                          }
            }/>
          })}
        </>
    )
  }


export const CPlaylistAdd = connect(null, { add: actionAddPlaylist })(PlaylistAdd)


export const SideBar = () =>
<div className='sidebar'>
  <img src={logo} className="sidebar__logo"/>
  <br/>

      <SidebarOptions Icon={HomeOutlinedIcon} title="Home"/>
      <SidebarOptions Icon={ManageSearchIcon} title="Search"/>
      <SidebarOptions Icon={AddIcon} title="Create playlist"/>

      <strong className='sidebar__title'><p>PLAYLISTS</p></strong>

      <hr/>
      {/* <CPlaylistAdd /> */}
      <SideBarConnect />
      
</div>




