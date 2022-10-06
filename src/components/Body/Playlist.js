import React , {useEffect, useState} from 'react'

import { store } from '../../store/store'
import {actionGetUsersPlaylistByID,  actionUpdatePlaylist, deletePromise } from '../../actions/Actions'
import {actionFullSetPlaylist, actionSetTrack} from '../../store/playerReducer'
import { connect } from 'react-redux'

import {useParams} from 'react-router-dom'

import { Favorite,MoreHoriz,  PlayCircleFilled} from '@mui/icons-material'
import { Header } from './Body'

import albumCreate from '../../images/albumCreate.png'

import { CUploadFile } from './Upload'
import { arrayMoveImmutable } from 'array-move'


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


  const Item = ({ getTracks , playlist , setPlaylist, setTrack , updatePlaylist , tracks:{ _id , url , originalFileName}}) => {

    const params = useParams()
    const [tracks , setTracks] = useState([])


    useEffect(() => { 
      setTracks(getTracks || [])
    }, [getTracks])


    const handleSetData = () => {
          setPlaylist(playlist
          )
          // playlist.map((item) => {
          //   return console.log(item)
          // }) 
          console.log(playlist)
          setTrack(originalFileName , url , _id)
    }
    
    const handleAdd = (event) => {
        event.stopPropagation()
        if(store.getState().playerReducer?.playlist?.tracks[0].length < 1){
          setTimeout(() => setPlaylist( playlist ,playlist._id ,{_id , url , originalFileName}) , 1000)
        }
        setTimeout(() => updatePlaylist(playlist._id ,[{_id , url , originalFileName} , ...tracks]) , 3000)
    }

    return (
        <li className='songRow' key={_id} onClick={(e) => handleSetData(e)}>
          <div className='songRow__info'>
            <h1>{originalFileName}</h1>
          </div>
          <button 
          onClick={(e) => handleAdd(e)}
          className = { params["*"] ? "btn__add": "btn__dis"}
          >+</button>
        </li>
    )
  }


  export const CItem = connect(state => ({
    getTracks: state.promise.AllUsersPlaylistsByID?.payload?.tracks ,
    playlist: state.promise.AllUsersPlaylistsByID?.payload || [],
  }),{
    setPlaylist: actionFullSetPlaylist,
    setTrack: actionSetTrack,
    updatePlaylist: actionUpdatePlaylist
  })(Item)

  
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

  const Droppable = ({ id, items, itemProp, keyField, render}) => {
    const { setNodeRef } = useDroppable({ id });

    const droppableStyle = {
      //padding: "20px 10px",
      //border: "1px solid black",
      //borderRadius: "5px",
      //minWidth: 110
    };
   

    return (
      
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}
      >
        {items.map((item , index) => (
                  item.originalFileName !== null ? <SortableItem render={render} key={item[keyField]} id={item} index={index}
                  itemProp={itemProp} item={item}/> : ''
        )) }
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
      useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
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


const PagePlaylist = ({getData ,getTracks, newTracksLoad , updatePlaylist}) => {
  

    const params = useParams()

    const [tracks , setTracks] = useState([])

    useEffect(() => { 
      getData(params._id)
    }, [params._id])


    
    useEffect(() => { 
         setTracks(getTracks || [])
    }, [getTracks])
   

    useEffect(() => { 
      if(newTracksLoad?.status === "FULFILLED") {
          updatePlaylist(params._id , [newTracksLoad?.payload ,...tracks])
          setTimeout(() => deletePromise('loadFile' , store.getState().promise.loadFile?.payload) , 1000)
      }
    }, [newTracksLoad])
  
  
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

              <Dnd items={tracks} render={CItem} itemProp="tracks" keyField="_id" 
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
  getTracks: state.promise.AllUsersPlaylistsByID?.payload?.tracks,
  newTracksLoad: state.promise.loadFile ,
}) , {
  getData: actionGetUsersPlaylistByID,
  updatePlaylist: actionUpdatePlaylist,
})(PagePlaylist)
