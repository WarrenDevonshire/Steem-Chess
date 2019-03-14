import React, { Component } from "react";
import "./Chatbox.css";

class Chatbox extends Component {
  constructor(props){
    super(props);
    this.state = {
        messageList: this.props.messageList ? this.props.messageList : [],
        localConnection: this.props.localConnection,
        draftedMessage: ""
    }
    this.updateDraft = this.updateDraft.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  updateDraft(area) {
    this.state.draftedMessage = area.target.value;
  }

  sendMessage() {
    console.log(this.state.localConnection);
    //this.state.localConnection.send(this.state.draftedMessage);
    this.state.messageList.push([this.state.draftedMessage, Date.now]);
    this.setState({draftedMessage:""});
    this.refs.draftArea.value = ""
  }

  render() {
    var messageList;
    if(this.state.messageList != null)
    {
      messageList = this.state.messageList.map(([message, timeSent], index) =>
      <MessageBubble key={index}
                     message={message} />
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
class MessageBubble extends Component{
  constructor(props){
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