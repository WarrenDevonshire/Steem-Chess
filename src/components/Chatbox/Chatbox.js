import React, { Component } from "react";
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
        console.log("Received data from peer!");
        this.state.messageList.push([data.message, Date.now(), true]);
        this.setState({ messageList: this.state.messageList });
    }

    updateDraft(area) {
        this.setState({ draftedMessage: area.target.value });
    }

    sendMessage() {
        if (this.isEmptyOrSpaces(this.state.draftedMessage)) return;

        this.props.sendData({
            type: "message",
            timeSent: Date.now(),
            message: this.state.draftedMessage,
        });

        this.state.messageList.push([this.state.draftedMessage, Date.now(), false]);
        this.setState({ messageList: this.state.messageList });

        this.setState({ draftedMessage: "" });
        this.refs.draftArea.value = ""
    }

    isEmptyOrSpaces(message) {
        return message === null || message.match(/^ *$/) !== null;
    }

    render() {
        var messageList;
        if (this.state.messageList != null) {
            messageList = this.state.messageList.map(([message, timeSent, fromOpponent], index) =>
                <MessageBubble key={index}
                    message={message.toString()}
                    timeSent={timeSent}
                    fromOpponent={fromOpponent} />
            )
        }
        return (
            <section id="messages-main">
                <section id="messages-list" className='messages-list'>
                    <span>
                        {messageList}
                    </span>
                </section>
                <section id="new-message" className='new-msg'>
                    <textarea ref="draftArea" className='msg'
                        onChange={e => this.updateDraft(e)}></textarea>

                    <button onClick={e => this.sendMessage()} id='Send'>Send</button>
                </section>
            </section>
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
            message: this.props.message,
            timeSent: this.props.timeSent,
            fromOpponent: this.props.fromOpponent,
        }
    }

    getFormattedTime(time) {
        var date = new Date(time);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        // Will display time in hh:mm:ss format
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    render() {
        var formattedTime = this.getFormattedTime(this.state.timeSent);
        return (
            <div className={this.state.fromOpponent ? "chatbox-message-opponent" : "chatbox-message-mine"}>
                <div className={this.state.fromOpponent ? "chatbox-bubble-opponent" : "chatbox-bubble-mine"}>
                    <h1>{this.state.message}</h1>
                </div>
                <h5 className="message-content-end">{formattedTime}</h5>
            </div>
        );
    }
}

export default Chatbox;