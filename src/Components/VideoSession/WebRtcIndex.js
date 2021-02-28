import React , {useEffect , useState , useRef} from 'react'

import PeerConnSetup from './PeerConnSetup'
import WebRtcView from './WebRtcView'

const configuration = {'iceServers': [
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }]};
  



export default function WebRtcIndex({myMediaStream , socket , sessionDesc}) {

    const [remoteStream , setRemoteStream] = useState(new MediaStream());

    const peerConnection = new RTCPeerConnection(configuration);

    useEffect(()=>{
        console.log('peerconn' , peerConnection ,'socket', socket ,'myMedia' ,  myMediaStream , 'sessionDesc',sessionDesc)
    }, [])
    useEffect(()=>{
      if (remoteStream.active){
      console.log(`remote Stream setted${remoteStream}` )
    }},[remoteStream])
    const addRemoteStream = (stream)=>{
      setRemoteStream(
        stream
      )
    }
    return (
        <div>
            {/* <PeerConnSetup peerconnection socket media /> */}
            <PeerConnSetup 
            peerConnection = {peerConnection} 
            socket = {socket} sessionDesc = {sessionDesc} 
            myMediaStream = {myMediaStream}
            addRemoteStream = {addRemoteStream}
            />
            {/* <WebRtcView myMediaStream remoteMediaStream */}
            <WebRtcView 
                myMediaStream = {myMediaStream}
                remoteStream = {remoteStream}
            />
            {/* <functionnalities (mute) , (unmute) .../> */}
        </div>
    )
}
