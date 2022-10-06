import React , {useCallback} from 'react'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { actionLoadFile} from '../../actions/Actions'
import '../../css/body.css'

import { useParams } from 'react-router'

function UploadFile({onLoad}) {
    
  const params = useParams()
  const onDrop = useCallback(acceptedFiles => {
      acceptedFiles.map((item) => {
      if(item.type === 'image/png'){
        onLoad(item , 'upload')
        console.log('image')
      }
      if(item.type === 'audio/mpeg'){
        onLoad(item , 'track')
      }
    })
   }, [onLoad])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
    return (
      <div {...getRootProps()} className={ params["*"] ? "profile__img" : "dropzone"}  >
            <input {...getInputProps()} />
            {
            isDragActive ?
            <p>Drag 'n' drop some files here, or click to select files</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
            }
      </div>
    )
    }

  export const CUploadFile = connect(state => ({
  }
    ),
    {
        onLoad: actionLoadFile,
    })(UploadFile)
