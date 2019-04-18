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
        this.state.messageList.push([data.message, Date.now]);
        this.setState({ messageList: this.state.messageList });
    }

    updateDraft(area) {
        this.setState({ draftedMessage: area.target.value });
    }

    sendMessage() {
        this.props.sendData({
            type: "message",
            timeSent: Date.now,
            message: this.state.draftedMessage,
        });

        this.setState({ draftedMessage: "" });
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
        <section id="main" class='messages'>
            <section id="messages-list" class='messages-list'>
            <span>
              {messageList}
            </span>
            </section>
            <section id="new-message" class='new-msg'>
            <textarea ref="draftArea" class='msg'
                      onChange={e => this.updateDraft(e)}></textarea>

                        <button onClick={e => this.sendMessage()} id='Send'>Send</button>
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