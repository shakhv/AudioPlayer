import React , {useEffect, useState , useCallback , useRef} from 'react'
import { Header } from './Body'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actionAllPlaylists } from '../../actions/Actions'



const PlaylistRow = ({playlist: {_id , name}}) => 
<>
    <Link to={`/Player/playlist/${_id}`} className='pageMain__playlist'><h1>{name}</h1></Link>
</>
 



const PageMain = ({getPlaylists , playlistAll = [] , load}) => {
  const divRef = useRef()


    useEffect(() => {
      if(localStorage.authToken){
        getPlaylists()
      }
    }, [])
    

    useEffect(() => {
      const div = divRef.current
      div.onscroll = function(ev) {
        if ((div.scrollHeight - div.scrollTop) <= div.clientHeight + 65) {
            load()
        }
      };
    }, [])


return (
  <div className='body' ref={divRef}>
      <Header />
      <h1>Popular playlists</h1>
      <div className='pageMain__playlistsContainer'>
        {playlistAll.map(item => 
        <PlaylistRow playlist={item} key={item._id}/>)}
      </div>
  </div>
)
}



export const CPageMain = connect((state) => ({
  playlistAll: state.promise.allPlaylists?.payload}) , {
  getPlaylists: actionAllPlaylists , 
  load: actionAllPlaylists
})
(PageMain)