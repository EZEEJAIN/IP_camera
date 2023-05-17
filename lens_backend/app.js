import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [videoData, setVideoData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    socket.on('video', (data) => {
      setVideoData(data);
    });
  }, []);

  useEffect(() => {
    if (videoData) {
      const videoBlob = new Blob([videoData], { type: 'video/mp2t' });
      const videoUrl = URL.createObjectURL(videoBlob);
      videoRef.current.src = videoUrl;
    }
  }, [videoData]);

  return (
    <div>
      <video ref={videoRef} controls />
    </div>
  );
}

export default App;








// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');

// function App() {
//   const [videoData, setVideoData] = useState(null);

//   useEffect(() => {
//     socket.on('video', (data) => {
//       setVideoData(data);
//     });
//   }, []);

//   return (
//     <div>
//       {videoData && <video src={URL.createObjectURL(new Blob([videoData]))} controls />}
//     </div>
//   );
// }

// export default App;
