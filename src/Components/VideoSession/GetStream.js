import React , {useEffect , useState} from 'react'
const constraints = {
    "video" : {
        "width": 640,
        "height": 480
    }, 
    "audio" : true ,
}
function GetStream({mediaSetter, ...props}) {
    useEffect(()=>{
        
        // requesting video and audio stream

        navigator.mediaDevices.getDisplayMedia(constraints)
        .then(stream => {
            mediaSetter(stream);
        })
        .catch(error => {
            console.error('Error getting display media.', error);
        });
    },[]) 
    return (
        <div className = "getStream">
            <h3>hello from getStream</h3>

        </div>
    )
}

export default GetStream
