import React ,{useState, useRef ,useEffect} from 'react'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link,Routes,Route} from 'react-router-dom'
import { Sidebar,UserProfile } from '../components'
import {client} from '../client'
import logo from '../assets/logo.png'
import Pins from './Pins'
import { userQuery } from '../utils/data'
import {fetchUser} from '../utils/fetchUser'
const Home = () => {
  const scrollRef=useRef(null)
  const [user, setuser] = useState(null)
  const [togelSidebar, setTogelSidebar] = useState(false)
  const userinfo=fetchUser();
  useEffect(()=>{
   
    const query= userQuery(userinfo?.aud);
    client.fetch(query)
      .then((data)=>setuser(data[0]));
      
  },[])

  useEffect(()=>{
    scrollRef.current.scrollTo(0,0)
  },[])
  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu 
            fontSize={40} 
            className='cursor-pointer'
            onClick={()=>setTogelSidebar(true)}
          />
          <Link to='/'>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={`${user?.image}`} alt="user_img" className='w-10 rounded-full h-10' />
          </Link>
        </div>
        {
          togelSidebar && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
              <div className='absolute w-full justify-end flex items-center p-2'>
                <AiFillCloseCircle
                  fontSize={30}
                  className='cursor-pointer'
                  onClick={()=>setTogelSidebar(false)}
                />
              </div>
              <Sidebar user={user && user} closeToggel={setTogelSidebar}/>
            </div>
          )
        }
      </div>
      
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile/>}/>
          <Route path='/*' element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home