import React from 'react'
import { useState  , useEffect} from 'react';

import {faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// mui imports
import { Sheet } from '@mui/joy';
import {TextField} from '@mui/joy';
import '../css/registration.css'
import { connect } from 'react-redux';
import { actionFullRegister} from '../actions/Actions';
import { useNavigate } from 'react-router-dom';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z]).{8,24}$/;


const RegistrationForm = ({user_id , registration}) => {
  const history = useNavigate()

  const [user , setUser] = useState('')
  const [validName , setValidName] = useState(false)
  const [userFocus , setUserFocus]  = useState(false)

  const [pwd , setPwd] = useState('')
  const [validPwd , setValidPwd] = useState(false)
  const [pwdFocus , setPwdFocus]  = useState(false)

  const [matchPwd , setMatchPwd ] = useState('')
  const [validMatch , setValidMatch] = useState(false)
  const [matchFocus , setMatchFocus]  = useState(false)


    useEffect(() => {
        if(user_id){
            history('/Player')
        }
    }, [user_id])
    

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

  
    const handleSubmit = () => {
      registration(user , pwd)
    }

  return (
    
                <div className='registration'>
                    <Sheet 
                    sx={
                      {
                        maxWidth: 400,
                        mx: 'auto', // margin left & right
                        mt: 25, // margin top & botom
                        py: 3, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        borderRadius: 'sm',
                        boxShadow: 'md',
                      }
                    }
                    >
                      <h2>Register</h2>
                        <TextField
                            type="text"
                            id="username"
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            label="Login"
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                        </p>
                        <TextField
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            label="Password"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                        </p>
                        <TextField
                            type="password"
                            id="confirm_pwd"
                            label="Confirm_Password"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button  disabled={!validName || !validPwd || !validMatch ? true : false} className='button' onClick={() => handleSubmit()}>Sign Up</button>
                    </Sheet>
                </div>
  )
}


export const RegistrationPage = connect(state => ({
    user_id: state.promise.userData?.payload?._id
}),
  {
    registration: actionFullRegister })
   (RegistrationForm)