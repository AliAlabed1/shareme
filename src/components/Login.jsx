import React from 'react'
import jwt_decode from 'jwt-decode'
import {GoogleOAuthProvider} from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import {FcGoogle} from 'react-icons/fc'
import { client } from '../client';
import {useNavigate} from 'react-router-dom'
const Login = () => {
  const navigate=useNavigate()
  const responseGoogle=(response)=>{
    
    const decod=jwt_decode(response.credential)
    localStorage.setItem('user',JSON.stringify(decod))
    const {name,aud,picture}=decod
    const doc={
      _id:aud,
      _type:'user',
      userName:name,
      image:picture
    }
    client.createIfNotExists(doc).then(
      ()=>{
        navigate('/',{replace:true})
      }
    )

  }
  return (
    <div className='flex flex-col justify-start items-center h-screen'>
      <div className='relative w-full h-full'>
        <video 
         src={shareVideo}
         type='video/mp4'
         loop
         controls={false}
         muted
         autoPlay
         className='w-fuul h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo'/>
          </div>
          <div className='shadow-2xl'>
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            >
              <GoogleLogin
                render={
                  (renderProps)=>(
                    <button
                      type='button'
                      className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle className='mr-4'/>
                      Sign in with Google
                    </button>
                  )
                }
                onSuccess={responseGoogle}
                onError={responseGoogle}
                cookiePolicy='single_host_origin'
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
      
      
    </div>
  )
}

export default Login