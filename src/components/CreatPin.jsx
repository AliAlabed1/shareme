import React,{useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'
import {client} from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data' 
const CreatPin = ({user}) => {
  const [title, settitle] = useState('');
  const [about, setabout] = useState('')
  const [loading, setloading] = useState(false)
  const [fields, setfields] = useState(null)
  const [category, setcategory] = useState(null)
  const [imageAsset, setimageAsset] = useState(null)
  const [wrongImageType, setwrongImageType] = useState(false)

  const navigate=useNavigate()

  const uploadImage=(e)=>{
    const {type,name}=e.target.files[0];
    if (type === 'image/png' || type === 'image/svg' || type==='image/jpeg' || type ==='image/gif' || type === 'image/tiff'){
      setwrongImageType(false)
      setloading(true)

      client.assets.upload('image',e.target.files[0],{contentType:type,filename:name}).then((document)=>{
        setimageAsset(document);
        setloading(false)
      }).catch((err)=>{
        alert('Image Upload Error')
      })
    }else{
      setwrongImageType(true)
    }
  }
  const savePin=  ()=>{
    if(title && about && imageAsset?._id && category ){

      const doc={
        _type:'pin',
        title,
        about,
        
        image:{
          _type:'image',
          asset:{
            _type:'reference',
            _ref:imageAsset?._id
          }
        },
        userId:user?._id,
        postedBy:{
          _type:'postedBy',
          _ref:user?._id,
        },
        category
      }
      client.create(doc).then(()=>{
        navigate('/')
      })
    }else{
      setfields(true)
      setTimeout(()=>setfields(false),2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {
        fields && (
          <p className='text-red-500 mb-5 text-xl transition-all duration-150'>Please fill all fields</p>
        )
      }
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex fle-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {
              loading && <Spinner message={"Loading ..."}/>
            }
            {
              wrongImageType && <p>Wrong Image Type</p>
            }
            {
              !imageAsset ?(
                <label>
                  <div className='flex flex-col items-center justify-center h-full cursor-pointer'>
                    <div className='flex flex-col justify-center items-center'>
                      <p className='font-bold text-2xl'>
                        <AiOutlineCloudUpload />
                      </p>
                      <p className='text-lg'>Click to Upload</p>
                    </div>
                    <p className='mt-32 text-gray-400'>
                      Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20MB
                    </p>
                  </div>
                  <input 
                    type="file" 
                    name='uploade-image'
                    onChange={uploadImage}
                    className='w-0 h-0'
                  />
                </label>
              ):(
                <div className='relative h-full'>
                  <img src={imageAsset?.url}  alt="uploaded-pic" className='h-full w-full' />
                  <button
                    type='button'
                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                    onClick={()=>setimageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )
            }
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
            <input 
              type="text"
              value={title}
              onChange={(e)=>settitle(e.target.value)} 
              placeholder='Add Your Title'
              className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-500  p-2'
            />
            {
              user && (
                <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                  <img src={user.image} alt="user-profile"  className='w-10 h-10 rounded-full'/>
                  <p className='font-bold '>{user.userName}</p>
                </div>
              )
            }
            <input 
              type="text"
              value={about}
              onChange={(e)=>setabout(e.target.value)} 
              placeholder='what is you pin about'
              className='outline-none text-base sm:text-lg border-b-2 border-gray-500  p-2'
            />
            <div className='flex flex-col'>
              <div>
                <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose pin category</p>
                <select
                  onChange={(e)=>setcategory(e.target.value)}
                  name="" 
                  id=""
                  className='outline-none w-4/5  text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                    <option value="other" className='bg-white'>Select Category</option>
                    {
                      categories.map((item)=>(
                        <option value={item.name} className='bg-white capitalize' key={item.name}>{item.name}</option>
                      ))
                    }
                  </select>
              </div>
              <div className='flex justify-end items-end mt-5'>
                <button
                  type='button'
                  onClick={savePin}
                  className='bg-red-500 text-white rounded-full font-bold p-2 w-28 outline-none'
                >
                  Save Pin
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CreatPin