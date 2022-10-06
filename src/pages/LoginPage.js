import  React , {useState , useEffect}  from 'react';
import '../css/loginpage.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {connect}   from 'react-redux';
import { actionFullLogin } from '../actions/Actions';
import { AlertTitle } from '@mui/material';

// mui imports
import { Sheet } from '@mui/joy';
import { TextField } from '@mui/joy';

  const LoginForm = ({onLogin , loged}) => {
    const [user , setUser] = useState('')
    const [pwd , setPwd] = useState('')
    const history = useNavigate()

    useEffect(() => {
      if(loged?.payload){
        history('/Player')
      }
    }, [loged])
    
    
    const handleSubmit = () => {
          onLogin(user , pwd)
    }

    return (
      <div className='loginForm'>
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
              }>
              <h2>WELCOME!</h2>
              <TextField
                  name="login"
                  type="text"
                  placeholder="JohnWikk"
                  onChange={(e) => setUser(e.target.value)}
                  label= "Login"
              />
              <TextField
                  name="password"
                  type="password"
                  value={pwd}
                  placeholder="qwerty123"
                  onChange={(e) => setPwd(e.target.value)}
                  label= "Password"
              />
              {
                 loged?.payload === null ? <AlertTitle className='alert__title'>
                  Sorry, but your login or password is not correct, please try or register again
                </AlertTitle> : ''
              }
            <button  disabled={!user|| !pwd} className='button' onClick={() => handleSubmit()}>Log In</button>
              <div className='loginPage'>
                <p>You don`t have account ? <Link to="/RegistrationPage" className='link_sign_up'>Sign Up</Link></p>
              </div>
            </Sheet>
        
      </div>
    )
  }


   export const LfConnect = connect(state =>({ loged: state.authReducer}), { onLogin: actionFullLogin })(LoginForm) 




