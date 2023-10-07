import React,{useState}  from 'react'
import {client, urlFor } from '../client'
import { Link,useNavigate } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'
import {fetchUser} from '../utils/fetchUser'
const Pin = ({pin:{postedBy,image,_id,save}}) => {
    const [postHoverd, setpostHoverd] = useState(false)
    const [savingPost, setsavingPost] = useState(false)
    const navigate=useNavigate()
    const userinfo=fetchUser();
    const alreadySaved = !!(save?.filter((item)=>item?.postedBy?._id===userinfo?.email.split('@')[0]))?.length
    const savePin=(id)=>{
        if(!alreadySaved){
            setsavingPost(true);

            client.patch(id).setIfMissing({save:[]}).insert('after','save[-1]',[{
                _key:uuidv4(),
                userId:userinfo?.email.split('@')[0],
                postedBy:{
                    _type:postedBy,
                    _ref:userinfo?.email.split('@')[0]
                }

            }]).commit().then(()=>{
                window.location.reload();
                setsavingPost(false)
            })
        }
    }
    const deletePin=(id)=>{
        client.delete(id).then(()=>{
            window.location.reload()
        })
    }
    return (
    <div className='m-2'>
        <div
          className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration=500 ease-in-out'
          onMouseEnter={()=>setpostHoverd(true)}
          onMouseLeave={()=>setpostHoverd(false)}
          onClick={()=>navigate(`/pin-detail/${_id}`)}
        >
            <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full'/>
            {
                postHoverd &&(
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50' style={{height:'100%'}}>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a 
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e)=>e.stopPropagation()}
                                >
                                   <MdDownloadForOffline
                                     className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                   />
                                </a>
                            </div>
                            {
                                alreadySaved ?(
                                    <button
                                      type='button'
                                      className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                    >
                                      {save?.length}  saved
                                    </button>
                                ):(
                                    <button
                                      type='button'
                                      className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                      onClick={(e)=>{
                                        e.stopPropagation()
                                        savePin(_id)
                                      }}
                                    >
                                        save
                                    </button>
                                )
                            }
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {
                                postedBy?._id===userinfo?.email.split('@')[0] && (
                                    <button
                                      type='button'
                                      className='bg-white opacity-70 hover:opacity-100 text-dark font-bold px-2 py-1 text-base rounded-full hover:shadow-md outline-none'
                                      onClick={(e)=>{
                                        e.stopPropagation()
                                        deletePin(_id)
                                      }}
                                    >
                                        <AiTwotoneDelete />
                                    </button>   
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
        <Link to={`user-profile/${postedBy._id}`} className='flex gap-2 mt-2 items-center'>
            <img src={postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt='user-profile' />
            <p className='font-semibold capitalize'>{postedBy.userName}</p>
        </Link>
        
        
    </div>
  )
}

export default Pin