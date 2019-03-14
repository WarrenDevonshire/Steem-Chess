/**
 * Connects 2 people through webRTC
 */
class Connection {
    constructor(){
        this.setUpConnection();
    }

    /**
     * Creates a new RTCPeerConnection for webRTC
     */
    setUpConnection() {

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
            ]
        }
        this.localConnection = new RTCPeerConnection(iceCFG);

        this.sendChannel = this.localConnection.createDataChannel("sendChannel");
        this.sendChannel.onopen = this.handleSendChannelStatusChange;
        this.sendChannel.onclose = this.handleSendChannelStatusChange;
        this.sendChannel.onmessage = this.handleReceiveMessage;
        //this.sendChannel.ondatachannel = this.receiveChannelCallback;//possibly temp
    }

    /**
     * Used by the second peer to locate the first
     * @returns A JSON representation of the offer
     */
    async createOffer() {
        var offer = null;
        try {
            offer = await this.localConnection.createOffer();
        } catch (err) {
            this.handleCreateDescriptionError(err)
        }
        return JSON.stringify(offer);
    }

    /**
     * Accepts answer from remote connection
     * @param {*} answer A JSON representation of the answer
     */
    async acceptAnswer(answer) {
        await this.localConnection.setRemoteDescription(JSON.parse(answer));
    }

    /**
     * Accepts inviation to a webRTC connection, and replies with an answer
     * @param {*} offer A JSON representation of the offer
     * @returns A JSON representation of an answer
     */
    async joinConnection(offer) {
        this.localConnection.setRemoteDescription(JSON.parse(offer));
        var answer = null;
        try {
            answer = await this.localConnection.createAnswer()
                                .then(answer => this.localConnection.setLocalDescription(answer));
        } catch (err) {
            this.handleCreateDescriptionError(err)
        }
        return JSON.stringify(answer);
    }

    handleCreateDescriptionError(err) {

    }

    handleSendChannelStatusChange(event) {
        console.log(event);
    }

    /**
     * Tries to send a message to the other peer
     * @param {*} message 
     */
    sendMessage(message) {
        if(this.sendChannel.readyState == "connecting")
        {
            console.error("sendMessage failed. sendChannel is connecting");
        }
        else if(this.sendChannel.readyState == "ready")
        {
            try {
                this.sendChannel.send(message);
            } catch(err) {
                console.error(err);
            }
        }
        else
        {
            console.error("sendMessage failed");
        }
    }

    // /**
    //  * Creates data channel once the peers are connected 
    //  * to each other
    //  * @param {*} event 
    //  */
    // receiveChannelCallback(event) {
    //     console.log(event);
    //     console.log("ZZZZZZZZZ");

    //     // receiveChannel = event.channel;
    //     // receiveChannel.onmessage = handleReceiveMessage;
    //     // receiveChannel.onopen = handleReceiveChannelStatusChange;
    //     // receiveChannel.onclose = handleReceiveChannelStatusChange;
    //   }

    handleReceiveMessage(event) {
        console.log("I received a message!!!!!!!!!!!!");
        console.log(event.data);
    }

    /**
     * Disconnects local peer from the session
     */
    disconnect() {
        this.sendChannel.close();
        this.sendChannel = null;
    }
}

export default Connection;