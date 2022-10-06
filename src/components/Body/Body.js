import React , {useState , useEffect , useRef} from 'react'
import '../../css/body.css'

import { Link, useRoutes , useNavigate } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import { Avatar, Input} from '@mui/material'
import { connect } from 'react-redux'

import { CCreatePlaylist } from './CreatePlaylist'
import { CItem, CPagePlaylist } from './Playlist'
import { CPageMain } from './Main'
import { CProfile } from './Profile'
import { backendURL } from '../../store/promiseReducer'
import { actionAuthLogout, actionTrackSearch } from '../../actions/Actions'

import { LogoutOutlined } from '@mui/icons-material'

const useLocalStoredState = (defaultState , localStorageKey) => {
      const json = localStorage[localStorageKey]
      try{
        defaultState = JSON.parse(json)
      }
      catch(e){ }
      const [state, setState] = useState(defaultState)
      localStorage.setItem(localStorageKey , JSON.stringify(state))
      return [state , setState]
}


const useDebounce = (search , text , time) => {
  const timeoutRef = useRef(-1)
  
  useEffect(() => {
      clearInterval(timeoutRef.current)
      if(timeoutRef !== null){
        timeoutRef.current = setTimeout(() => search(text), time)
      }
  }, [text])
}


const SearchTracks = ({search}) => {
  const [text , setText] = useLocalStoredState('', 'inputText')
  const hook = useDebounce(search , text , 500)

  const history = useNavigate()
  const handleSearch = () =>{
      history('/Player/Search')
  }

  return (
        <div className='header__left' >
            <Search onClick={() => handleSearch()} className='search_tracks'/>
            <Input value={text} placeholder='Search ...' onChange={e => setText(e.target.value)}/>
        </div>
  )
}


const CSearchTracks = connect(state => ({}) , {
  search: actionTrackSearch
})(SearchTracks)


const SearchBody = ({tracksFind}) => {
  return (
    <div className='body'>
        <Header />
          <h2>TRACKS FIND FOR YOU</h2>
          <ul>
              {
                tracksFind.map((item , key) => <CItem tracks={item} key={item._id} />)
              }
          </ul>
    </div>
  )
}

const CSearchBody = connect(state => ({
  tracksFind: state.promise.search?.payload || []
}), {
})(SearchBody)


const HeaderName = ({name , avatar , logOut}) => {
  const history = useNavigate()


  const handleLogOut = () =>{
    logOut()
      if(!localStorage.authToken){
        history('/')
        localStorage.removeItem(["inputText"])
        window.location.reload(false)
      }
  }


  return (
    <div className='header'>
        <CSearchTracks />
        <div>
            <Link to={`/Player/Profile`} className='header__right'>
                <Avatar src={`${backendURL + "/" + avatar}`} alt="avatar"/>
                <h4>{name}</h4>
            </Link>
        </div>
        <div  className='log__out' onClick={() => handleLogOut()}>
            LOG OUT
            <LogoutOutlined />
        </div>
        
    </div>
  )
}

export const Header = connect((state) =>({
  name : state.authReducer?.payload?.sub?.login, 
  avatar: state.promise.userData?.payload?.avatar?.url || []
}) ,{
  logOut: actionAuthLogout
})(HeaderName)


export const Body = () => {
        let routes = useRoutes([
            { path: "/*", element: <CPageMain /> },
            { path: "/playlist/:_id/*", element: <CPagePlaylist/> },
            { path: "/Create%20playlist", element: <CCreatePlaylist/> },
            { path: "/Profile" , element: <CProfile/>},
            { path: "/Search" , element: <CSearchBody />}
          ]);
          return routes;
}



