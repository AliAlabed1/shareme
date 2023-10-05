import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { searchQuery,feedQuery } from '../utils/data'

const Feed = () => {
  const [loading, setloading] = useState(false)
  const {categoryId}=useParams();
  const [pins, setpins] = useState(null)
  useEffect(() => {
    setloading(true)
    if(categoryId){
      const query=searchQuery(categoryId);
      client.fetch(query)
      .then((data)=>{
          setpins(data);
          setloading(false)
        })
    } else{
      client.fetch(feedQuery).then((data)=>{
        setpins(data)
        setloading(false )
      })
    }
  }, [categoryId])
  

  if(loading) return <Spinner message="We are adding new ideas to your feed!"/>

  return (
    <div>
      {
        pins && <MasonryLayout pins={pins}/>
      }
    </div>
  )
}

export default Feed