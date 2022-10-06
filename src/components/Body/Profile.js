import React , {useEffect , useState} from 'react'
import { Header } from './Body'
import '../../css/body.css'

import { connect } from 'react-redux'
import { CUploadFile } from './Upload'
import { backendURL } from '../../store/promiseReducer'
import { actionAllImages, actionUploadAvatar, deletePromise } from '../../actions/Actions'
import { store } from '../../store/store'




const Images = ({url , _id }) => {
    return (
        <li>
            <img src={`${backendURL + "/" + url}`} alt='' _id={_id} onClick={() => store.dispatch(actionUploadAvatar(_id))}/>
        </li>  
    )
}


const Profile = ({getImages , name, images , newImageLoad , chooseAvatar}) => {

    useEffect(() => {
        if(localStorage.authToken){
             getImages()
        }
    }, [getImages])


    useEffect(() => {
        if(newImageLoad?.status === "FULFILLED"){
            chooseAvatar(newImageLoad?.payload?._id)
            setTimeout(() => deletePromise('loadFile' , store.getState().promise.loadFile?.payload))
        }
    }, [newImageLoad])


return (
<div className="body">
        <Header />
        <div className='body__info'>
            <CUploadFile /> 
            <div className='body__infoText'>
            <strong>PROFILE</strong>
            <h2>{name}</h2>
            <p>Personalize your profile</p>
            </div>
        </div>
    <div className='body__songs'>
    <hr/>
        <h2>Choose avatar</h2>
    </div>

    <ul className='photos__container'>
    {
        images?.map((item , key) => 
        item.url !== null ? <Images url={item.url} key={item._id} _id={item._id} /> : []
        ).reverse()
    }    
    </ul>

</div>
)
}
  

export const  CProfile = connect(state => ({
    name: state.promise.userData?.payload?.login , 
    images: state.promise.images?.payload,
    newImageLoad: state.promise.loadFile
}),{
    getImages: actionAllImages,
    chooseAvatar: actionUploadAvatar
})(Profile)
