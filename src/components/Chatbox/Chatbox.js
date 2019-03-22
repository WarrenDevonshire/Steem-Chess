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

    this.state.peer.on('data', (data) => {
      try {
        var objectRecieved = JSON.parse(data);
        if (objectRecieved.hasOwnProperty('type') && objectRecieved.type === 'message') {
          this.state.messageList.push([objectRecieved.message, Date.now]);
          this.setState({messageList:this.state.messageList});
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  updateDraft(area) {
    this.setState({ draftedMessage: area.target.value });
  }

  sendMessage() {
    if(this.state.peer == null)
    {
      var error = "Peer connection not initiated!";
      console.err(error);
      alert(error);
      return;
    }
    if(!this.state.peer.connected)
    {
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
    this.state.peer.send(JSON.stringify(data));
    this.setState({ draftedMessage: "" });
    this.refs.draftArea.value = ""
  }

  render() {
    var messageList;
    if (this.state.messageList != null) {
      messageList = this.state.messageList.map(([message, timeSent], index) =>
        <MessageBubble key={index}
          message={message.toString()} />
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