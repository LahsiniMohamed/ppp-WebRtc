import React , {useEffect , useState , useRef} from 'react'

function PeerConnSetup({peerConnection , socket , sessionDesc , myMediaStream, addRemoteStream}) {
    const [remoteStream , setRemoteStream] = useState()
    const newStream = new MediaStream();
    useEffect(()=>{
        socket.emit('join-call' , sessionDesc , (result)=>{
            if(result==='call'){
                makeCall();
            }
        })

        myMediaStream.getTracks().forEach(track => {
            peerConnection.addTrack(track , myMediaStream);
        })
    //ICE CONDIDATE
        // Listen for local ICE candidates on the local RTCPeerConnection
        peerConnection.onicecandidate= (event)=>{
            console.log("ice candidate event occured")
            if (event.candidate) {
                socket.emit('new-ice-candidate',sessionDesc, event.candidate,()=>{
                    console.log("ice sent")
                });
            }
        };
        peerConnection.addEventListener('track', async  (event) => {
            try{
                newStream.addTrack(event.track, newStream)
                setRemoteStream(newStream)
                console.log('track event occured')
            }
            catch(e){
                console.log("peerconnection on track ", e)
            }
        });

    //SOCKET LISTENERS 
        socket.on('iceCandidate', async iceCandidate => {
            if (iceCandidate) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
                    console.log("ice added succesufully")
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });    
        
        socket.on('signalOffer', async offer => {
            ///
            if (offer) {
                try{
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnection.createAnswer();
                    
                    await peerConnection.setLocalDescription(answer);
                    console.log("received offer", peerConnection)
                    socket.emit('answer',sessionDesc , answer,()=>{
                        console.log("answer sended")
                    });
                }
                catch(e){
                    console.log(e)

                }
        }
        return ()=>{peerConnection.close()}
        },[]);

    socket.on('signalAnswer', async answer => {
        if (answer){
            try{
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                console.log(answer)    
                console.log("answer received",peerConnection)
                }
            catch(error){
                    console.log(error)
                }
        }

        })

    //VERIFIE CONNECTION
    console.log('remote descripton ' , remoteStream)
    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            // Peers connected!
            console.log("conneeeeeeected", peerConnection)
        }
    });
    
    },[])

    useEffect(()=>{
        console.log('something happend in remote stream')
        if(remoteStream){
        if (remoteStream.active){
            addRemoteStream(remoteStream);
            console.log('setting parent remote stream')
        }}
    }, [remoteStream])
    const makeCall = async ()=> {
        try{

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('offer created and setted to local desc successufully ', peerConnection)
        socket.emit('offer',sessionDesc , offer,()=>{
            console.log("offer sended", peerConnection.currentRemoteDescription)
        });
        }
        catch(error){

            console.log('error while making call ' , error )
        }
    };
    return (
        <div>
        </div>
    )
}

export default PeerConnSetup
