import React, {useEffect , useState, useRef} from 'react'

import GetStream from './GetStream';

function MediaStreamView({mediaStreamSetter ,myStream, ...props}) {
    const [mediaStream , setMediaStream] = useState(new MediaStream());

    const mediaStreamRef = useRef();

    useEffect(()=>{
        mediaStreamSetter(mediaStream);
    }, [mediaStream])
    useEffect(()=>{
        if(mediaStreamRef.current){
            mediaStreamRef.current.srcObject = myStream;
        }
    }, [myStream])


    let MediaStreamPreview ;
    if (mediaStream.active){
        MediaStreamPreview = (<video ref = {mediaStreamRef} playsInline autoPlay/>) 
    }

    return (
        <div className = "MediaStreamView">
                {/* get media stream */}
            <h3>Hello from Media Stream View</h3>
            <GetStream 
            mediaSetter = {(stream)=>setMediaStream(stream)}
            />
            {myStream? MediaStreamPreview : null}
        </div>
    )
}

export default MediaStreamView
