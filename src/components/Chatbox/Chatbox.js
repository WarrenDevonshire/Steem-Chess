import React, {Component} from "react";
import "./Chatbox.css";

class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: this.props.messageList ? this.props.messageList : [],
            peer: this.props.peer,
            draftedMessage: ""
        }
        this.updateDraft = this.updateDraft.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    /**
     * Called when LiveMatch notifies Chatbox of a new message
     * @param {*} message 
     */
    onReceiveMessage(data) {
        this.state.messageList.push([data.message, Date.now]);
        this.setState({messageList: this.state.messageList});
    }

    updateDraft(area) {
        this.setState({draftedMessage: area.target.value});
    }

    sendMessage() {
        console.log(this.state.peer);
        console.log(this.props.peer);
        if (this.props.peer == null) {
            var error = "Peer connection not initiated!";
            console.error(error);
            alert(error);
            return;
        }
        if (!this.props.peer.connected) {
            var error = "Not connected to the other player yet!";
            console.error(error);
            alert(error);
            return;
        }
        var data = {
            type: "message",
            timeSent: Date.now,
            message: this.state.draftedMessage,
        }
        this.props.peer.send(JSON.stringify(data));
        this.setState({draftedMessage: ""});
        this.refs.draftArea.value = ""
    }

    render() {
        var messageList;
        if (this.state.messageList != null) {
            messageList = this.state.messageList.map(([message, timeSent], index) =>
                <MessageBubble key={index}
                               message={message.toString()}/>
            )
        }
        return (
            <div id="container">
                <aside id="sidebar">Users</aside>
                <section id="main">
                    <section id="messages-list">
            <span>
              {messageList}
            </span>
                    </section>
                    <section id="new-message">
            <textarea ref="draftArea"
                      onChange={e => this.updateDraft(e)}></textarea>

                        <button onClick={e => this.sendMessage()}>Send</button>
                    </section>
                </section>
            </div>
        );
    }
}

/**
 * Message bubble. Passed in the message and the time sent
 */
class MessageBubble extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.message
        }
    }

    render() {
        return (
            <span>
        <h1>{this.state.message}</h1>
      </span>
        );
    }
}

export default Chatbox;