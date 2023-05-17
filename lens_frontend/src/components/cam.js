import { useEffect, useState } from "react";
import { w3cwebsocket as WebSocket } from "websocket";

const Cam = () => {
  const [socket, setSocket] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
    });

    newSocket.addEventListener("message", (event) => {
      setStreamUrl(event.data);
      console.log(`Received message: ${event.data}`);
    });

    newSocket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <p>Stream URL: {streamUrl}</p>
      {streamUrl && <video src={streamUrl} autoPlay />}
    </div>
  );
};

export default Cam;
































// import React, { useEffect, useRef, useState } from "react";
// import { w3cwebsocket as WebSocket } from "websocket";

// const Home = () => {
//   const videoRef = useRef(null);
//   const [socket, setSocket] = useState(null);
//   const [rtspUrl, setRtspUrl] = useState("");

//   useEffect(() => {
//     const newSocket = new WebSocket("ws://localhost:8080");

//     newSocket.addEventListener("open", () => {
//       console.log("WebSocket connection established");
//       setSocket(newSocket);
//     });

//     newSocket.onmessage = (event) => {
//       setRtspUrl(event.data);
//     };

//     newSocket.addEventListener("message", (event) => {
//       console.log(`Received message: ${event.data}`);
//     });

//     newSocket.addEventListener("close", () => {
//       console.log("WebSocket connection closed");
//       setSocket(null);
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (rtspUrl && videoRef.current) {
//       videoRef.current.src = rtspUrl;
//     }
//   }, [rtspUrl]);

//   return (
//     <div>
//       <p>RTSP URL: {rtspUrl}</p>
//       <video ref={videoRef} autoPlay />
//     </div>
//   );
// };

// export default Home;

















// import React from "react";
// import { useEffect, useState } from "react";
// import { w3cwebsocket as WebSocket } from "websocket";

// const Home = () => {
//   const [socket, setSocket] = useState(null);
//   const [rtspUrl, setRtspUrl] = useState("");

//   useEffect(() => {
//     const newSocket = new WebSocket("ws://localhost:8080");

//     newSocket.addEventListener("open", () => {
//       console.log("WebSocket connection established");
//       setSocket(newSocket);
//     });

//     newSocket.onmessage = (event) => {
//       setRtspUrl(event.data);
//     };

//     newSocket.addEventListener("message", (event) => {
//       console.log(`Received message: ${event.data}`);
//     });

//     newSocket.addEventListener("close", () => {
//       console.log("WebSocket connection closed");
//       setSocket(null);
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, []);
//    console.log("RTSP Url",rtspUrl)
//   return (
//     <div>
//       <p>RTSP URL: {rtspUrl}</p>
//       {rtspUrl && <video src={rtspUrl} autoPlay />}
//     </div>
//   );
// };

// export default Home;




















// import React, { useEffect, useState } from "react";
// import { w3cwebsocket as WebSocket } from "websocket";

// const Home = () => {
//   const [socket, setSocket] = useState(null);
//   const [rtspUrl, setRtspUrl] = useState("");
//   const [streamUrl, setStreamUrl] = useState("");

//   useEffect(() => {
//     const newSocket = new WebSocket("ws://localhost:8080");

//     newSocket.addEventListener("open", () => {
//       console.log("WebSocket connection established");
//       setSocket(newSocket);
//     });

//     newSocket.addEventListener("message", async (event) => {
//       if (!streamUrl) {
//         // Received RTSP URL from server
//         setRtspUrl(event.data);
//       } else {
//         // Received video stream data from server
//         const videoBlob = new Blob([event.data], { type: "video/mp4" });
//         const videoUrl = URL.createObjectURL(videoBlob);
//         setStreamUrl(videoUrl);
//       }
//     });

//     newSocket.addEventListener("close", () => {
//       console.log("WebSocket connection closed");
//       setSocket(null);
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, [streamUrl]);

//   useEffect(() => {
//     // Send RTSP URL to server to start streaming
//     if (socket && rtspUrl) {
//       socket.send(rtspUrl);
//     }
//   }, [socket, rtspUrl]);

//   return (
//     <div>
//       <p>RTSP URL: {rtspUrl}</p>
//       {streamUrl && <video src={streamUrl} autoPlay />}
//     </div>
//   );
// };

// export default Home;




















