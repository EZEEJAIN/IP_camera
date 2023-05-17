const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const { PassThrough } = require("stream");
const { createFFmpeg } = require("@ffmpeg/ffmpeg");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ffmpeg = createFFmpeg({ log: true });

const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";

async function createRtspStream(rtspUrl) {
  await ffmpeg.load();
  return new Promise((resolve, reject) => {
    const rtspStream = ffmpeg(rtspUrl)
      .inputOptions("-rtsp_transport", "tcp")
      .outputOptions("-f", "mpegts")
      .outputOptions("-codec:v", "copy")
      .outputOptions("-movflags", "frag_keyframe+empty_moov")
      .outputFormat("mpegts")
      .on("error", (err) => {
        console.error("ffmpeg command error:", err);
        reject(err);
      });

    const stream = new PassThrough();
    rtspStream.pipe(stream);
    rtspStream.on("end", () => {
      console.log("ffmpeg command finished");
      resolve(stream);
    });
    rtspStream.run();
  });
}

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.get("/api/rtsp-stream/:url", async (req, res) => {
  const rtspUrl = req.params.url;
  const rtspStream = await createRtspStream(rtspUrl);

  const socket = new PassThrough();
  rtspStream.pipe(socket);

  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Content-Length": "Infinity",
    "Transfer-Encoding": "chunked",
  });

  socket.pipe(res);
});

wss.on("connection", async (socket) => {
  console.log("A user connected to RTSP stream");
  socket.send(rtspUrl);
  const rtspStreamSocket = new PassThrough();

  socket.on("message", async (message) => {
    console.log(`Received message: ${message}`);
    const rt = message.toString();
    console.log("objecttttt", rt);
    const rtspStream = await createRtspStream(rt);
    rtspStream.pipe(rtspStreamSocket);

    rtspStreamSocket.on("data", async (data) => {
      try {
        const message = { type: "data", data };
        socket.send(JSON.stringify(message));
        console.log("Data has been sent successfully");
      } catch (error) {
        console.error(error);
      }
    });
  });

  socket.on("close", () => {
    console.log("A user disconnected from RTSP stream");
  });
});

server.listen(8080, () => {
  console.log("Server on port 8080");
});






















// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");
// const ffmpeg = createFFmpeg({ log: true });
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });



// async function createRtspStream(rtspUrl) {
//   return new Promise((resolve, reject) => {
//     const rtspStream = ffmpeg(rtspUrl)
//       .inputOptions("-rtsp_transport", "tcp")
//       .outputOptions("-f", "mpegts")
//       .outputOptions("-codec:v", "copy")
//       .outputOptions("-movflags", "frag_keyframe+empty_moov")
//       .outputFormat("mpegts")
//       .on("error", (err) => reject(err));

//     const stream = new PassThrough();
//     rtspStream.pipe(stream);
//     rtspStream
//       .run()
//       .then(() => {
//         console.log("ffmpeg command finished");
//       })
//       .catch((err) => {
//         console.error("ffmpeg command error:", err);
//         reject(err);
//       });
//     resolve(stream);
//   });
// }


// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// app.get("/api/rtsp-stream/:url", async (req, res) => {
//   const rtspUrl = req.params.url;
//   const rtspStream = await createRtspStream(rtspUrl);

//   const socket = new PassThrough();
//   rtspStream.pipe(socket);

//   res.writeHead(200, {
//     "Content-Type": "video/mp4",
//     "Content-Length": "Infinity",
//     "Transfer-Encoding": "chunked",
//   });

//   socket.pipe(res);
// });

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
 
//   // socket.send("Hello");
//   const rtspStreamSocket = new PassThrough();

//   socket.on("message", async (message) => {
//     console.log(`Received message: ${message}`);
//     const rt = message.toString();
//     console.log("objecttttt", rt);
//     const rtspStream = await createRtspStream(rt);
//     rtspStream.pipe(rtspStreamSocket);
    
//     rtspStreamSocket.on("data", async (data) => {
//       try {
//         const message = { type: "data", data };
//         socket.send(JSON.stringify(message));
//         console.log("Data has been sent successfully");
//       } catch (error) {
//         console.error(error);
//       }
//     });
//   });
  
  
//   // socket.on("message", async (message) => {
//   //   console.log(`Received message: ${message}`);
//   //  const rt = message.toString();
    
//   //   console.log("objecttttt", rt);
//   //   // const rtspStream = await createRtspStream(rt);
//   //   // rtspStream.pipe(rtspStreamSocket);

//   //   const response = { type: "message", data: "Received your message!" };
//   //   socket.send(JSON.stringify(response));
//   // });

//   // rtspStreamSocket.on("data", async (data) => {
//   //   try {
//   //     const message = { type: "data", data };
//   //     socket.send(JSON.stringify(message));
//   //     console.log("Data has been sent successfully");
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // });

//   socket.on("close", () => {
//     console.log("A user disconnected from RTSP stream");
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });




















// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";

// async function createRtspStream(rtspUrl) {
//   return new Promise((resolve, reject) => {
//     const rtspStream = ffmpeg(rtspUrl)
//       .inputOptions('-rtsp_transport', 'tcp')
//       .outputOptions('-f', 'mpegts')
//       .outputOptions('-codec:v', 'copy')
//       .outputOptions('-movflags', 'frag_keyframe+empty_moov')
//       .outputFormat('mpegts')
//       .on('error', (err) => reject(err));

//     const stream = new PassThrough();
//     rtspStream.pipe(stream);
//     rtspStream.run().then(() => {
//       console.log('ffmpeg command finished');
//     }).catch((err) => {
//       console.error('ffmpeg command error:', err);
//       reject(err);
//     });
//     resolve(stream);
//   });
// }

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStreamSocket = new PassThrough();

//   socket.on("message", async (message) => {
//     console.log(`Received message: ${message}`);
//     const rtspStream = await createRtspStream(message);
//     rtspStream.pipe(rtspStreamSocket);
//   });

//   rtspStreamSocket.on("data", async (data) => {
//     try {
//       const message = { type: 'data', data };
//       socket.send(JSON.stringify(message));
//       console.log("Data has been sent successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   socket.on("close", () => {
//     console.log("A user disconnected from RTSP stream");
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });















// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");

// const onvif = require('node-onvif');
// const { OnvifStream } = require("onvif");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://your-rtsp-url";

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// async function createRtspStream(rtspUrl) {
//   return new Promise((resolve, reject) => {
//     const stream = new OnvifStream({
//   url: "rtsp://192.168.1.100:554/onvif1",
//   username: "admin",
//   password: "password",
// });
//     stream.on('error', (err) => reject(err));
//     stream.on('data', (data) => {
//       resolve(data);
//     });
//     stream.connect();
//   });
// }

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStream = await createRtspStream(rtspUrl);

//   rtspStream.on("data", async (data) => {
//     try {
//       await socket.send(data);
//       console.log("Data has been sent successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });

// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const { RtspServer } = require("node-rtsp-stream");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";

// // Create an RTSP server instance
// const rtspServer = new RtspServer({
//   serverPort: 8554, // RTSP server port
//   clientPort: 8000, // RTP/RTCP client port range
// });

// // Start the RTSP server
// rtspServer.start();

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// wss.on("connection", (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);

//   // Attach event listener to receive the video stream data from the RTSP server
//   rtspServer.on("data", (data) => {
//     try {
//       socket.send(data);
//       console.log("Data has been sent successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   socket.on("close", () => {
//     console.log("WebSocket connection closed");
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });





















// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");

// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// async function createRtspStream(rtspUrl) {
//   return new Promise((resolve, reject) => {
//     const rtspStream = ffmpeg(rtspUrl)
//       .inputOptions('-rtsp_transport', 'tcp')
//       .outputOptions('-f', 'mpegts')
//       .outputOptions('-codec:v', 'copy')
//       .outputOptions('-movflags', 'frag_keyframe+empty_moov')
//       .outputFormat('mpegts')
//       .on('error', (err) => reject(err));

//     const stream = new PassThrough();
//     rtspStream.pipe(stream);
//     rtspStream.run().then(() => {
//       console.log('ffmpeg command finished');
//     }).catch((err) => {
//       console.error('ffmpeg command error:', err);
//       reject(err);
//     });
//     resolve(stream);
//   });
// }

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStreamSocket = new PassThrough();

//   socket.on("message", async (message) => {
//     console.log(`Received message: ${message}`);
//     const rtspStream = await createRtspStream(message);
//     rtspStream.pipe(rtspStreamSocket);
//   });

//   rtspStreamSocket.on("data",(data) => {
//     try {
//       socket.send(data);
//       console.log("Data has been sent successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });















// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";
// const rtspPort = 5541;

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// async function createRtspStream(rtspUrl) {
//   await ffmpeg.load();
//   const stream = ffmpeg.input(rtspUrl)
//     .inputOptions('-rtsp_transport', 'tcp')
//     .outputOptions('-f', 'mpegts')
//     .outputOptions('-codec:v', 'copy')
//     .outputOptions('-movflags', 'frag_keyframe+empty_moov')
//     .outputFormat('mpegts')
//     .pipe();
//   return stream;
// }

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStreamSocket = new PassThrough();

//   socket.on("message", async (message) => {
//     console.log(`Received message: ${message}`);
//     const rtspStream = await createRtspStream(message);
//     rtspStream.pipe(rtspStreamSocket);
//   });

//   rtspStreamSocket.on("data", (data) => {
//     socket.send(data, { binary: true }); // Send data as binary
//     console.log("Data has been sent successfully");
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });

// const WebSocket = require("ws");
// const axios = require("axios");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";
// const rtspPort = 5541;

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// async function createRtspStream(rtspUrl) {
//   await ffmpeg.load();
//   const ffmpegInput = ffmpeg.input(rtspUrl);
//   await ffmpegInput
//     .format("mpegts")
//     .videoCodec("copy")
//     .outputOptions(["-threads 0", "-preset ultrafast"])
//     .pipe();
//   const stream = ffmpegInput.pipe();
//   return stream;
// }

// wss.on("connection", async (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStreamSocket = new PassThrough();

//   socket.on("message", async (message) => {
//     console.log(`Received message: ${message}`);
//     const rtspStream = await createRtspStream(message);
//     rtspStream.pipe(rtspStreamSocket);
//   });

//   rtspStreamSocket.on("data", (data) => {
//     socket.send(data);
//     console.log("Data has been sent successfully");
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });

// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const fs = require("fs");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";
// const rtspPort = 5541;
// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // async function startFFmpeg() {
// //   await ffmpeg.load();
// //   ffmpeg.FS('writeFile', 'test.mp4', await fs.promises.readFile('rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media'));
// //   await ffmpeg.run('-i', 'test.mp4', '-f', 'mpegts', '-codec:v', 'mpeg1video', '-s', '640x480', '-b:v', '800k', '-r', '30', 'http://localhost:3000/rtspStream');
// // }

// // startFFmpeg();

// wss.on("connection", (socket) => {
//   console.log("A user connected to RTSP stream");
//   const rtspStreamSocket = new PassThrough();
//   socket.emit('rtspUrl', 'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media');
//   rtspStreamSocket.pipe(socket);
//   //   ffmpeg.FS('writeFile', 'test.mp4', rtspStreamSocket.read());
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });

// const http = require('http');
// const WebSocketServer = require('ws').Server;
// const ffmpeg = require('fluent-ffmpeg');
// // Set the camera URL
// const cameraUrl = 'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media';

// // Create a new HTTP server
// const server = http.createServer();

// // Start WebSocket server
// const wss = new WebSocketServer({ server: server });

// // Listen for WebSocket connections
// wss.on('connection', (ws) => {
//     console.log('WebSocket connected');

//     // Create a new ffmpeg command to stream from the camera
//     const command = ffmpeg(cameraUrl)
//     .inputFormat('rtsp')
//     .outputFormat('mpegts')
//     .noAudio()
//     .videoCodec('copy')
//     .format('mpegts')
//     .pipe();

//     // Listen for errors from ffmpeg
//     command.on('error', (err) => {
//         console.log(`ffmpeg error: ${err.message}`);
//     });

//     // Pipe the ffmpeg output to the WebSocket

//   command.on('end', () => {
//     console.log('ffmpeg stream ended');
//   });
//   command.pipe(ws, { end: false });
// });
// wss.addEventListener("open", () => {
//     console.log("WebSocket connection established");
//   });
// // Start the HTTP server
// server.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

// const onvif = require("node-onvif");
// const express = require("express");
// const app = express();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
// const fs = require("fs");
// const { PassThrough } = require("stream");
// const { spawn } = require("child_process");
// const rtspPort = 5000;
// const httpPort = 3000;
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 7071 });
// const clients = new Map();

// app.use(express.static("public"));
// app.get("/", (req, res) => {
//     res.send("Server is running");
//   });
// // Create an ONVIF device instance for RTSP
// const camRtsp = new onvif.OnvifDevice({
//   xaddr: "http://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media",
//   user: "user",
//   pass: "password",
// });

// // Initialize the RTSP device
// camRtsp
//   .init()
//   .then(() => {
//     console.log("RTSP device initialized");                   //wrongg
//   })
//   .catch((err) => {
//     console.error("Error initializing RTSP device:", err);
//   });

// // Create an ONVIF device instance for HTTP
// const camHttp = new onvif.OnvifDevice({
//   xaddr: "http://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media",
//   user: "user",
//   pass: "password",
// });

// // Initialize the HTTP device
// camHttp
//   .init()
//   .then(() => {
//     console.log("HTTP device initialized");                //wrongg
//   })
//   .catch((err) => {
//     console.error("Error initializing HTTP device:", err);
//   });

// // Start the RTSP stream
// const rtspStream = new PassThrough();                     //correct
// const ffmpegRtsp = spawn("/opt/homebrew/bin/ffmpeg", [
//     "-i",
//     "-",
//     "-f",                                                //correct
//   "mpegts",
//   `http://localhost:${rtspPort}/rtspStream`,
// ]);

// ffmpegRtsp.stderr.on("data", (data) => {
//   console.error(`ffmpeg error: ${data}`);                //correct
// });

// rtspStream.on("data", (data) => {
//   ffmpegRtsp.stdin.write(data);
// });

// // Create the HTTP stream endpoint
// app.get("/httpStream", (req, res) => {                    //wrongg

//   camHttp
//     .fetchSnapshot()
//     .then((snapshot) => {
//       res.writeHead(200, { "Content-Type": "image/jpeg" });
//       res.end(snapshot, "binary");
//     })
//     .catch((err) => {
//       console.error("Error fetching HTTP snapshot:", err);
//       res.status(500).send("Error fetching snapshot");
//     });
// });

// // Create the RTSP stream endpoint

// io.on("connection", (socket) => {                                    //wrongg
//   console.log("A user connected to RTSP stream");
//   const rtspStreamSocket = new PassThrough();
//   rtspStream.pipe(rtspStreamSocket);
//   socket.emit("stream", { port: rtspPort });
// });

// server.listen(httpPort, () => {
//   console.log(`Server started on port ${httpPort}`);                    //correct
// });

// const WebSocket = require("ws");
// const express = require("express");
// const http = require("http");
// const { PassThrough } = require("stream");
// const { createFFmpeg } = require("@ffmpeg/ffmpeg");

// const ffmpeg = createFFmpeg({ log: true });

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const rtspUrl = "rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media";
// const rtspPort = 5541;

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// wss.on("connection", (socket) => {
//   console.log("A user connected to RTSP stream");
//   socket.send(rtspUrl);
//   const rtspStreamSocket = new PassThrough();
//   rtspStreamSocket.pipe(socket);

//   socket.on("message", (message) => {
//     console.log(`Received message: ${message}`);
//   });
// });

// server.listen(8080, () => {
//   console.log("Server on port 8080");
// });
