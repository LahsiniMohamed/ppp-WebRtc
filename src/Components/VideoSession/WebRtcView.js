import React , {useEffect , useState , useRef} from 'react'
import './WebRtcView.scss'
function WebRtcView({myMediaStream , remoteStream}) {

    const myMediaRef = useRef();
    const remoteMediaRef = useRef();

    useEffect(()=>{
        if (myMediaStream){
        if (myMediaStream.active){
            if (myMediaRef.current){
                myMediaRef.current.srcObject = myMediaStream
            }
        }}
    }, [myMediaStream])
    useEffect(()=>{
        if(remoteStream){
        if (remoteStream.active){
            if (remoteMediaRef.current){
                remoteMediaRef.current.srcObject = remoteStream
            }
        }}
    }, [remoteStream])
    let MyMedia = (<video autoPlay={true} playsInline ref = {myMediaRef} className="WebRtcView__myMedia"></video> );
    let RemoteMedia = (<video autoPlay={true} playsInline ref = {remoteMediaRef} className="WebRtcView__remoteMedia"></video> );
    
    return (
        <div className = "WebRtcView">
            <div className="WebRtcView__top">

            </div>
            <div className="WebRtcView__Media">
                {MyMedia}
                {RemoteMedia}
            </div>
            <div className="WebRtcView__bottom">
                controls will be here
            </div>
        </div>
    )
}

export default WebRtcView
