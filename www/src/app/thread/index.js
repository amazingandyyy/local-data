'use client'
import { Fragment, useEffect } from 'react'

import { useThreadStore } from '../stores'
import { fetchDevelopments } from '../utils'
import AddPost from './add'
import UpdatePost from './update'

function PostCard ({children}) {
  return (<div className='bg-white self-stretch border-b-4 md:border-b-0 md:m-2 md:drop-shadow md:rounded-xl p-4'>{children}</div>)
}

function Post ({ data }) {
  data.path.shift()
  switch (data.op) {
    case 'add':
      return (<PostCard><AddPost data={data} /></PostCard>)
    case 'update':
      return (<PostCard><UpdatePost data={data} /></PostCard>)
    // case 'delete':
    //   return (<div className=''>sad</div>)
    default:
      return (<Fragment></Fragment>)
  }
}

export default function Thread () {
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log(data.slice(0))
        useThreadStore.getState().update(data)
      })
  }, [])
  const thread = useThreadStore(state => state.thread)
  return (
    <div className='flex flex-col w-full md:max-w-2xl pt-8'>
      {thread.map((post, i) => <Post key={i} data={post} />)}
    </div>
  )
}