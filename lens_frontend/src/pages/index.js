import { Inter } from 'next/font/google'
import Homee from '../components/home'
import Sidebar from '@/components/sidebar'
import MainHome from '@/components/mainHome'
import PopUp from '@/components/popUp'
import { useState } from 'react'
import Cam from '@/components/cam'
const inter = Inter({ subsets: ['latin'] })

// const ws = new WebSocket('ws://localhost:8080'); 

// ws.addEventListener('open', () => {
//   console.log('Connected to WebSocket server');
// });

// ws.addEventListener('message', (event) => {
//   console.log('Received message:', event.data);
// });

// ws.addEventListener('close', () => {
//   console.log('Disconnected from WebSocket server');
// });

// ws.addEventListener('error', (error) => {
//   console.error('WebSocket error:', error);
// });



export default function Home() {
  const [visible, setVisible] = useState(false)
  const [camName,setCamName]=useState([]);
  return (
 
   <div className='font-extrabold'>
   
 <MainHome setVisible={setVisible} camName={camName}/>
 {visible && (
 <PopUp visible={visible} setVisible={setVisible} setCamName={setCamName}/>
 )}
 <Cam/> 
   </div>
  )
}
