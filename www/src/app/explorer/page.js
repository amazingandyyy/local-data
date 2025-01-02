'use client'
import { useEffect, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { fetchDevelopments } from '@/utils'
import Link from 'next/link'

function getSeconds (date) {
  const dateArr = date.split('/')
  const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
  const seconds = standardDate.getTime() // 1440516958
  return seconds
}

function Image ({ src, className }) {
  const [show, setShow] = useState(true)
  return show && <img src={src} className={className} loading='lazy' onError={() => setShow(false)} />
}

export default function Threads ({ params, searchParams }) {
  const projects = useProjectProfileStore(state => state.profiles)
  const [highlights, setHighlights] = useState([])
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log('fetching developments event', data[0])
        useThreadStore.getState().update(data)
      })
  }, [])

  useEffect(() => {
    document.title = 'Explorer - DublinThreads'
    document.description = 'Explore Dublin projects and developments on a map.'
    document.url = 'https://dublin.amazyyy.com/explore'
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [])

  useEffect(() => {
    console.log('projects', projects)
    const r = []
    for (const project in projects) {
      const p = projects[project]
      r.push(p)
    }
    r.sort((a, b) => {
      return getSeconds(b.details['Application Submittal Date']) - getSeconds(a.details['Application Submittal Date'])
    })
    setHighlights(r)
  }, [projects])

  return (<>
    <GlobalHeader />
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className='container mx-auto px-3 sm:px-4 py-8 sm:py-16'>
        <div className='flex flex-col items-center mt-12 text-center space-y-4 sm:space-y-6 mb-8 sm:mb-16'>
          <h1 className='font-handwriting text-3xl sm:text-4xl md:text-7xl font-bold text-green-950 tracking-wide'>
            Explorer
          </h1>
          <p className='text-gray-600 text-base sm:text-lg max-w-2xl px-2'>
            This is an <span className='font-medium text-green-800'>experimental feature</span>. Currently under active development
          </p>
          <div className='flex flex-wrap justify-center gap-1.5 sm:gap-2 py-3 sm:py-4'>
            {['DublinCA', 'California', 'TriValley'].map(i => (
              <span
                key={i}
                className='py-1 sm:py-1.5 px-3 sm:px-4 bg-green-100 rounded-full text-xs sm:text-sm font-medium text-green-800
                          transition-all duration-300 hover:bg-green-200 hover:scale-105'
              >
                #{i}
              </span>
            ))}
          </div>
        </div>
        <div className='grid gap-4 sm:gap-8 md:gap-12'>
          {highlights.map((project) => (
            <div
              key={project.id}
              className='bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6'
            >
              <Link
                href={`/project/${project.id}`}
                className='group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-3 sm:mb-4'
              >
                <h2 className='font-semibold text-lg sm:text-xl text-green-950 group-hover:text-green-700 transition-colors duration-300 line-clamp-2'>
                  {project.title}
                </h2>
                <time className='text-xs sm:text-sm text-gray-400 shrink-0'>
                  {project.details['Application Submittal Date']}
                </time>
              </Link>
              {project.images && project.images.length > 0 && (
                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                  {project.images.slice(0, 5).map((image, index) => (
                    <Link
                      key={`${project.id}-${index}`}
                      href={`/project/${project.id}`}
                      className='block transition-transform duration-300 hover:scale-105'
                    >
                      <Image
                        src={image.thumbnail}
                        className='rounded-lg sm:rounded-xl w-24 sm:w-32 h-24 sm:h-32 object-cover shadow-sm hover:shadow-md transition-shadow duration-300'
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='text-center text-gray-500 mt-8 sm:mt-12 italic text-sm sm:text-base'>
          more to come...
        </div>
      </div>
    </main>
  </>)
}
