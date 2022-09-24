import React , {useEffect, useState , useCallback} from 'react'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { actionLoadFile, actionTrackFindOne, actionUpdatePlaylist } from '../../actions/Actions'

function UploadFile({onLoad}) {
    
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map((item) => {
          onLoad(item)
      })

     }, [onLoad])

     
    const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({onDrop})
    
  return (
    <div {...getRootProps()} className=" dropzone">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
          
      }
       {/* {
          acceptedFiles ? 
            acceptedFiles.map(file => (
                <div className='dropzone__list'>
                    <li key={file.path}>
                            {file.path} - {file.size} bytes
                    </li>
                </div>
            )) : 'files'
      } */}
    </div>
    
    )
  }

  export const CUploadFile = connect(state => ({

  }
    ),
    {
        onLoad: actionLoadFile,
        findTrack: actionTrackFindOne
    })(UploadFile)
