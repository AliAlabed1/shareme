import React,{useState,useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link,useParams } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import { client,urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery,pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
const PinDetails = ({user}) => {
  const [pins, setpins] = useState(null)
  const [pinDetails, setpinDetails] = useState(null)
  const [comments, setcomments] = useState('')
  const [addingComment, setaddingComment] = useState(false)

  const {pinId}=useParams(); 

  
  const fetchPinDetails=()=>{
    const query = pinDetailQuery(pinId)
    if(query){
      client.fetch(query).then((data)=>{
        setpinDetails(data[0])

        if(data[0]){
          const query=pinDetailMorePinQuery(data[0])
          client.fetch(query).then((res)=>setpins(res))
        }
      })
    }
  }

  useEffect(()=>{fetchPinDetails()},[pinId])
  const submitComment=()=>{
    if(comments){
      
      setaddingComment(true)
      client.patch(pinId).setIfMissing({comments:[]}).insert('after','comments[-1]',[{
        comment:comments,
        _key:uuidv4(),
        postedBy:{
          _type:'postedBy',
          _ref:user._id
        }
      }]).commit().then(()=>{
         fetchPinDetails();
         setcomments('')
         setaddingComment(false)
      })

    }else{
      alert("pleaze write a comment")
    }
  }
  if(!pinDetails) return <Spinner message={"Loading Pin.."}/> 

  
  return (
    <>
      <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth:'1500px',borderRadius:'32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img 
            src={pinDetails?.image && urlFor(pinDetails.image).url()} 
            alt="pin-image"
            className='rounded-t-3xl rounded-b-lg' 
          />
        </div>
        <div className='w-full  p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
            <a 
              href={`${pinDetails?.image?.asset?.url}?dl=`}
              download
              onClick={(e)=>e.stopPropagation()}
            >
              <MdDownloadForOffline className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'/>
            </a>
            </div> 
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetails.title}
            </h1>
            <p className='mt-3 capitalize'>
              {pinDetails.about}
            </p>
          </div> 
          <Link to={`/user-profile/${pinDetails.postedBy._id}`} className='flex gap-2 mt-5 items-center'>
            <img src={pinDetails.postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt='user-profile' />
            <p className='font-semibold capitalize'>{pinDetails.postedBy.userName}</p>
          </Link>
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {
              pinDetails.comments ?
              (pinDetails.comments?.map((comment,i)=>(
                <div className='flex flex-col gap-2 mt-5 items-start bg-white rounded-lg' key={i}>
                  <Link to={`/user-profile/${comment.postedBy._id}`} className='flex gap-2 mt-5 items-center'>
                    <img src={comment.postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt='user-profile' />
                    <p className=' font-semibold capitalize'>{comment.postedBy.userName}</p>
                  </Link>
                  <p className='bg-gray-200 p-5 rounded-lg ml-5 capitalize '>{comment.comment}</p>
                </div>
              ))):(
                <div>no comments yet</div>
              )
            }
          </div>
          <div className='flex flex-wrap items-center justify-center mt-6 gap-3'>
            <Link to={`/user-profile/${user?._id}`} >
              <img src={user?.image} className='w-8 h-8 rounded-full cursor-pointer' alt='user-profile' /> 
            </Link>
            <input 
              type="text"
              className='flex-1 border-gray-200 outline-none border-2 p-2 rounded-xl focus:border-gray-300'
              placeholder='Add a comment'
              value={comments}
              onChange={(e)=>setcomments(e.target.value)}
            />
            <button
              type='button'
              onClick={submitComment}
              className='text-white rounded-lg items-center p-2 bg-red-500'>
                {
                  addingComment ? '...' : 'Comment '
                }
              </button>
          </div>
        </div>
      </div>
      {
        pins?.length >0 ? (
          <>
            <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
              More like this
            </h2>
            <MasonryLayout pins={pins}/> 
          </>
        ):(
          "There is no related pins"
        )
      }
    </>
  )
}

export default PinDetails