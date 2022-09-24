import React , {useEffect, useState , useCallback} from 'react'

import { store } from '../../store/store'
import { actionAddPlaylist, actionGetPlaylistById, actionGetUsersPlaylistByID, actionGetUserTracks, actionLoadFile, actionLoadTracksToPlaylist, actionTrackByID, actionTrackFindOne, actionUpdatePlaylist, actionUploadFile, actionUploadUserTrack } from '../../actions/Actions'
import onButtonClick, { actionFullPlay, actionFullSetPlaylist, setTrack } from '../../store/playerReducer'
import { connect } from 'react-redux'

import { Route , Routes , useRoutes ,useParams, useNavigate , Link} from 'react-router-dom'

import { AddLink, ConnectingAirportsOutlined, Favorite, InputOutlined, InputRounded, InputSharp, InputTwoTone, MoreHoriz,  PlayCircleFilled, PlusOne, PlusOneOutlined, PowerInput, SatelliteAlt,} from '@mui/icons-material'
import { Header } from './Body'

import albumCreate from '../../images/albumCreate.png'

import { CUploadFile } from './Upload'
import { arrayMoveImmutable } from 'array-move'
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'bootstrap'



import AutorenewIcon from '@mui/icons-material/Autorenew';
// dnd-kit
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors, useDroppable
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, rectSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";




  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const Item = ({tracks:{ _id , url, originalFileName}}) => {

   

    return (
        <li className='songRow' >
          <div className='songRow__info'>
            <h1  onClick={() => store.dispatch(actionFullPlay(_id , url))}>{originalFileName}</h1>
          </div>
        </li>
    )
  }
 

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });


  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    // width: 110,
    // height: 100,
    //display: "flex",
    //alignItems: "center",
    //paddingLeft: 5,
    //border: "1px solid gray",
    //borderRadius: 5,
    //marginBottom: 5,
    //userSelect: "none",
    cursor: "grab",
    //boxSizing: "border-box"
  };
    
  const Render = props.render
  

  return (
    <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
      <Render {...{[props.itemProp]:props.item}} />
    </div>
  );
};

  const Droppable = ({ id, items, itemProp, keyField, render }) => {
    const { setNodeRef } = useDroppable({ id });
  
    const droppableStyle = {
      //padding: "20px 10px",
      //border: "1px solid black",
      //borderRadius: "5px",
      //minWidth: 110
    };
   
    return (
      
      <SortableContext id={id} items={items} strategy={rectSortingStrategy} onClick
      >
          {items.map((item) => (
            item.originalFileName !== null ?  <SortableItem render={render} key={item[keyField]} id={item} 
            itemProp={itemProp} item={item} onClick={onclick}/> : ''
          ))}
      </SortableContext>
    );
  };
  

  function Dnd({items:startItems,render, itemProp, keyField, onChange, horizontal}) {
    const [items, setItems] = useState(
        startItems
    );



    useEffect(() => setItems(startItems), [startItems])

    useEffect(() => {
        if (typeof onChange === 'function'){
            onChange(items)
        }
    },[items])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = ({ active, over }) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        setItems((items) => {
            return arrayMoveImmutable( items, activeIndex, overIndex)
        });
    }

    const containerStyle = { display: horizontal ? "flex" : '' };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div style={containerStyle}>
          <Droppable id="aaa" 
                     items={items} 
                     itemProp={itemProp} 
                     keyField={keyField} 
                     render={render}
                    
                     />
                     
      </div>
    </DndContext>
  );
}

const Main = ({playlistName , description}) => 
<div className="body__info">
    <img src={albumCreate} alt="" />
    <div className="body__infoText">
        <strong>PLAYLIST</strong>
        <h2>{playlistName}</h2>
        <p>{description}</p>
    </div>
</div>


const CMain = connect(state => ({
playlistName: state.promise.AllUsersPlaylistsByID?.payload?.name,
description: state.promise.AllUsersPlaylistsByID?.payload?.description 
}) , 
{

})(Main)


const PagePlaylist = ({getData , setToPlayer ,getTracks, newTracksLoad , updatePlaylist }) => {
  
    const params = useParams()

    const [tracks , setTracks] = useState([])


    useEffect(() => { 
      getData(params._id)
    }, [params._id])


    useEffect(() => { 
      setToPlayer(params._id)
    }, [params._id])


    useEffect(() => { 
         setTracks(getTracks || [])
    }, [getTracks])


    useEffect(() => { 
      if(newTracksLoad !== tracks[0]){
        updatePlaylist(params._id , [newTracksLoad ,...tracks])
      }
    }, [newTracksLoad , updatePlaylist])
  
   
    return(
      <div className = "body">
          <Header />
          <CMain />
          <CUploadFile />

          <div className='body__songs'>
                    <div className="body__icons">
                        <PlayCircleFilled  className='body__shuffle'/>
                        <Favorite fontSize='large'/>
                        <MoreHoriz />
                    </div>

              <Dnd items={tracks} render={Item} itemProp="tracks" keyField="_id" 
                onChange={newArray =>  {
                  if(JSON.stringify(newArray) !== JSON.stringify(tracks)){
                    updatePlaylist(params._id , newArray)
                  }
                  }} />

          </div>

      </div>
    )
}


export const CPagePlaylist = connect(state => ({
  getTracks: state.promise.AllUsersPlaylistsByID?.payload?.tracks ,
  newTracksLoad: state.promise.loadFile?.payload ,
}) , {
getData: actionGetUsersPlaylistByID,
setToPlayer: actionFullSetPlaylist,
updatePlaylist: actionUpdatePlaylist,
})(PagePlaylist)



