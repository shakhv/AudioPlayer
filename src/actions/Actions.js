import {jwtDecode , backendURL , gql } from "../store/promiseReducer"
import { store } from "../store/store"
//
// ! PROMISE
const actionPending = (name , payload) => ({
    type: "PROMISE",
    status: "PENDING" , 
    name,
    payload
  });

const actionFulfilled = (name, payload) => ({
    type: "PROMISE",
    status: "FULFILLED",
    name,
    payload,
  });

const actionRejected = (name, error) => ({
    type: "PROMISE",
    status: "REJECTED",
    name,
    error,
  });

const actionDelete = (name,payload) => ({
    type: "DELETE_PROMISE" ,
    status: "DELETE",
    name,
    payload
})


export const deletePromise = (name , payload) => {
    store.dispatch(actionDelete(`${name}`, payload))
}


export  const actionPromise = (name, promise) => async (dispatch) => {
    try {
        dispatch(actionPending(name));
        let payload = await promise;
        dispatch(actionFulfilled(name, payload));
        return payload;
    } catch (e) {
        dispatch(actionRejected(name, e));
    }
  };


// !LOGIN
export const actionAuthLogin = (token) => ({ type: "AUTH_LOGIN", token });
export const actionAuthLogout = () => (dispatch) => {
    dispatch({ type: "AUTH_LOGOUT" });
    localStorage.removeItem("authToken");
  };


export const actionLogin = (login, password) =>
    actionPromise('login', gql(`
    query log($login:String!, $password:String!){
        login(login: $login, password: $password)
      }`, { login, password }))



export const actionFullLogin = (login , password ) =>
    async dispatch => {
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            await dispatch(actionAuthLogin(token))
            await dispatch(actionGetUserData())
        }
    }


// ! REGISTRATION
export const actionRegister = (login, password) =>
    actionPromise('registration', gql(`
        mutation register($login:String!, $password:String!) {
            createUser(login: $login, password: $password) {
                login, _id
            }
        }
        `, { login, password })
    )

export const actionFullRegister = (login, password) =>
    async dispatch => {
        await dispatch(actionRegister(login, password))
        await dispatch(actionFullLogin(login, password))
    }



// !PLAYLISTS
export const actionAllPlaylists = (_id) => 
async (dispatch , getState) =>{
    if(getState().promise.allPlaylists?.status === "PENDING") return
    const oldPlaylists = getState().promise.allPlaylists?.payload || []
    dispatch(actionPending('allPlaylists' , oldPlaylists))
    const newPlaylists = await gql(`
        query playlistsAll($q: String){
            PlaylistFind(query: $q){
            _id name tracks {
                _id url originalFileName
            }
        }}`, {q: JSON.stringify([{ _id }  ,{limit: [9], skip: [oldPlaylists.length] , sort: [{name: -1}]}] ) })
        
    const all = [...oldPlaylists , ...newPlaylists]
    dispatch(actionFulfilled('allPlaylists' , all))
}



export const actionGetUserData = () => {
    let _id = jwtDecode(localStorage.authToken).sub.id
    return (
        actionPromise('userData', gql(`
            query($userId: String!) {
                UserFindOne(query: $userId){
                    login, _id, avatar {_id, url, originalFileName}
                }
            }
        `, { userId: JSON.stringify([{ _id }]) }))
    )
}


export const actionGetUserPlaylists = () => {
    let _id = jwtDecode(localStorage.authToken).sub.id
    return (
        actionPromise('userPlaylists', gql(`
            query getPlaylistByOwnerId($ownerId:String!) {
                PlaylistFind(query: $ownerId) {
                    _id, name , tracks { _id , url , originalFileName}
                }
            }
        `, { ownerId: JSON.stringify([{ ___owner: _id }]) }))
    )
}

export const actionGetUserTracks = () => {
    let _id = jwtDecode(localStorage.authToken).sub.id
    return (
        actionPromise('userTracks', gql(`
            query getUserTracks($ownerId: String!) {
                TrackFind(query: $ownerId) {
                    _id, originalFileName, url,
                    id3 { title, artist, album }
                }
            }
        `, { ownerId: JSON.stringify([{ ___owner: _id }]) }))
    )
}

export const actionTrackSearch = (text) => {
    const arrayOf  = text.split(" ")
    const search = arrayOf.join("|")

    return (
        actionPromise('search', gql(`
        query search($query: String){
            TrackFind(query: $query){
                _id, url ,originalFileName
            }
        }`, {query: JSON.stringify([
                    {
                        $or: [{originalFileName: `/${search}/`}] //регулярки пишутся в строках
                    },
                    {
                        sort: [{originalFileName: 1}]} //сортируем по title алфавитно
                    ])
        }))
    )
}


    export const actionGetUsersPlaylistByID = (_id) => 
    actionPromise('AllUsersPlaylistsByID', gql(`
    query plsID($q: String){
        PlaylistFindOne(query: $q){
        _id name description tracks{
        _id url originalFileName
        }
    }
    }
    `, {q: JSON.stringify([{ _id }]) }))


    export const actionTrackFindOne = (_id) => 
    actionPromise('trackFindOne', gql(`
    query trFnd($q: String){
        TrackFindOne(query: $q){
        _id url originalFileName
         }
    }
    `, {q: JSON.stringify([{ _id }]) }))


    export const actionUpdatePlaylist = (playlistId, updatedPlaylist) =>
    async dispatch => {
        await dispatch(actionPromise('tracksUpdate', gql(`
            mutation($playlistId: ID, $newTracks: [TrackInput]) {
                PlaylistUpsert(playlist:{ _id: $playlistId, tracks: $newTracks}) {
                _id, name, tracks { _id, url, originalFileName, id3{ title, artist, album } }
                }
            }
            `, { playlistId: playlistId, newTracks: updatedPlaylist.map(({_id}) => ({_id})) }))
        )
        await dispatch(actionGetUsersPlaylistByID(playlistId))
    }


    export const actionAddPlaylist = (playlistName , descriptionName) =>
    async dispatch => {
        await dispatch(actionPromise('addPlaylist', gql(`
            mutation addPlaylist ($playlistName: String , $descriptionName: String ){
                PlaylistUpsert(playlist: {name: $playlistName , description: $descriptionName}) {
                    _id, name , description
                }
            }
        `, { playlistName: playlistName , descriptionName: descriptionName })))
        dispatch(actionGetUserPlaylists())
    }



    export const actionLoadFile = (file , type) => {
    let fd = new FormData()
    fd.append(type === 'upload' ? 'photo' : type, file)
    return (
        actionPromise('loadFile', fetch(backendURL + '/' + `${type}`, {
            method: "POST",
            headers: localStorage.authToken ? { Authorization: 'Bearer ' + localStorage.authToken } : {},
            body: fd
        })
            .then(res => res.json())
        )
    )
    }


    export const actionUploadAvatar = (uploadAvatar) =>
    async (dispatch) => {
        let _id = jwtDecode(localStorage.authToken).sub.id
        await dispatch(actionPromise('setAvatar', gql(`
        mutation {
        UserUpsert(user:{_id: "${_id}", avatar: {_id: "${uploadAvatar}"}}){
            _id, login, avatar{
                _id, url
            }
        }
        }
    `)))
        dispatch(actionGetUserData())
    }


    export const actionAllImages = () => {
        let _id = jwtDecode(localStorage.authToken).sub.id
        return (
            actionPromise('images', gql(`
            query ImageUser($ownerId: String!){
                ImageFind(query: $ownerId){
                  _id , url , originalFileName 
                }
              }
            `, { ownerId: JSON.stringify([{ ___owner: _id }]) }))
        )
    }
