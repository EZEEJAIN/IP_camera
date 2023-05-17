import React from 'react'
import Homee from './home'
import Sidebar from './sidebar'

const MainHome = ({setVisible, camName}) => {
  return (
    <div className='flex'>
        <Sidebar camName={camName}/>
        <Homee setVisible={setVisible}/>
    </div>
  )
}

export default MainHome