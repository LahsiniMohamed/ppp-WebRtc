import React, { useState , useEffect , useRef} from 'react'
import { io } from 'socket.io-client'
import MediaStreamView from './MediaStreamView'
import './SessionViewMaster.scss'
import WebRtcIndex from './WebRtcIndex'
let socket;



function SessionMaster() {
    const [viewName , setViewName] = useState('firstView')
    const [myMediaStream , setMyMediaStream] = useState();
    const [connectionState , setConnectionState] = useState('waiting...')
    
    const buttonRef = useRef();
    const sessionDesc = {sessionID : `qsdlmkasd1232aze231`
    , userID : 15
    , doctorID : 14
    , date : "25-02-2020"
    , time : "22:15"
    }
    useEffect(()=>{
        socket = io('/video');
        socket.emit('join',sessionDesc,(num)=>{
            console.log(num)
        })
        return () => {socket.disconnect();
        }

    }, [])

    useEffect(()=>{
        if (myMediaStream){
            if(myMediaStream.active){
            setConnectionState('Join Call')
            }
        }
    }, [myMediaStream])

    const onClickButton = ()=>{
        setViewName('secondView')

    }
    let Button ;
    Button = (<button ref = {buttonRef} onClick = {onClickButton} disabled={connectionState=='Join Call'? false : true}>{connectionState}</button>)
    
    console.log('media stream :' , myMediaStream);
    {/*if the state is on 1st render this component */}
    if (viewName == 'firstView'){
        return (
            <div className = "SessionMaster__firstView">
                <h1>Hello from first View</h1>
                 <MediaStreamView
                mediaStreamSetter = {(mediaStream)=>setMyMediaStream(mediaStream)}
                myStream = {myMediaStream}
                />
                {/* we can add some kind of a verification componenet that takes the media stream as a property */}
                {Button}
            </div>
        )
    }
    {/*if the state is on 2nd render this component */}
    if (viewName == 'secondView'){
        return (
            <div className = "SessionMaster__secondView">   
                {/* <WebRtcView/> */}
                <WebRtcIndex 
                    sessionDesc = {sessionDesc}
                    myMediaStream = {myMediaStream}
                    socket = {socket}
                />
            </div>
        )
    }
}

export default SessionMaster
