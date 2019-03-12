
export default class Connection {
    constructor(){
        this.setUpConnection();
    }

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
    }

    async createOffer() {
        var offer = null;
        try {
            offer = await this.localConnection.createOffer();
            this.localConnection.setLocalDescription(offer);
        } catch (err) {
            this.handleCreateDescriptionError(err)
        }
        return JSON.stringify(offer);
    }

    async acceptAnswer(answer) {
        this.localConnection.setRemoteDescription(answer);
    }

    async joinConnection(offer) {
        this.localConnection.setRemoteDescription(offer);
        var answer = null;
        try {
            answer = await this.localConnection.createAnswer();
        } catch (err) {
            this.handleCreateDescriptionError(err)
        }
        return JSON.stringify(answer);
    }

    handleCreateDescriptionError(err) {

    }

    handleSendChannelStatusChange() {

    }
}












