
export default async function setUpConnection() {

    var iceCFG = {
        'urls': [
            {
                'url': 'stun:stun.l.google.com:19302'
            },
            {
                'url': 'stun:stun1.l.google.com:19302'
            },
            {
                'url': 'stun:stun2.l.google.com:19302'
            },
            {
                'url': 'stun:stun3.l.google.com:19302'
            },
            {
                'url': 'stun:stun4.l.google.com:19302'
            },
        ]
    }
    var localConnection = new RTCPeerConnection(iceCFG);

    var sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onopen = handleSendChannelStatusChange;
    sendChannel.onclose = handleSendChannelStatusChange;

    // localConnection.createOffer()
    //     .then(offer => localConnection.setLocalDescription(offer))
    //     .then(() => console.log(JSON.stringify(localConnection.localDescription)))
    //     .catch(handleCreateDescriptionError());
    var response = null;
    try{
        response = await localConnection.createOffer();
    }catch(err){
        handleCreateDescriptionError(err)
    }
    return JSON.stringify(response);
}

function handleCreateDescriptionError(err) {

}

function handleSendChannelStatusChange() {

}