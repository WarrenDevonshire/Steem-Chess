import React, { Component } from "react";

/* Import Components */
import Input from "../../shared/components/utils/Input";
import TextArea from "../../shared/components/utils/TextArea";
import Button from "../../shared/components/utils/Button";

var steem = require('steem');

class Compose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newUser: {
        name: "", //change to post_title
        age: "", //change to post_tags
        about: "", //change to post_text
        pk: "", //posting key
        userName: "" //username of poster
      },
    };
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handlePostingKey = this.handlePostingKey.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this); //**rework for posting**
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  /* This lifecycle hook gets executed when the component mounts */

  handleTitle(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          name: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

//This is going to need a rework to create actual tag icons,
//still trying to figure out how these can be generate, oriented, and 
//if desired deleted, after the user presses enter.
  handlePostingKey(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          pk: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

  handleUserName(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          userName: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

  handleTag(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          age: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          [name]: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

  handleTextArea(e) {
    console.log("Inside handleTextArea");
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          about: value
        }
      }),
      () => console.log(this.state.newUser)
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    steem.broadcast.comment(
      this.state.newUser.pk, //posting wif (key)
      '', //author, leave blank for new post
      this.state.newUser.age, //first tage
      this.state.newUser.userName, //user name of poster
      permlink + '-post', //permlink, could allow user to specify
      this.state.newUser.name, // Title
      this.state.newUser.about, //Post text
      //json meta data
      { tags: ['secondtag'], app: 'steemjs-test!' }, //rework for additional tags, temp**
      function (err, result){
        console.log(err, result);
      }
    );  
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        name: "", //fields have to be changed to appropriate names
        age: "",
        about: "",
        pk: "",
        userName: ""
      }
    });
  }
  //Some portions of code are using old var names from examples Ive been looking at,
  //until I understand this 100% I didnt wana risk changing anything, should function
  //properly though.
  render() {
    return (
      <form className="container-fluid" onSubmit={this.handleFormSubmit}>
      <h1> Create a Post </h1>
        {/* Posting Wif (Key) */}
        <Input
          inputType={"text"}
          name={"pk"}
          title={"Posting Key"}
          value={this.state.newUser.pk}
          placeholder={"Enter posting key here"}
          handleChange={this.handlePostingKey}
        />{" "}
        {/* Username */}
        <Input
          inputType={"text"}
          name={"userName"}
          title={"Username"}
          value={this.state.newUser.userName}
          placeholder={"Enter your username here"}
          handleChange={this.handleUsername}
        />{" "}
        {/* Tags */}
        <Input
          inputType={"text"}
          name={"tag"}
          title={"Tags"}
          value={this.state.newUser.age}
          placeholder={"Enter a tag here"}
          handleChange={this.handleTag}
        />{" "}
        {/* Title of Post */}
        <Input
          inputType={"text"}
          title={"Title"}
          name={"name"}   //adjusting this to title prevents input
          value={this.state.newUser.name} //something to do with .name, gotta
          placeholder={"Enter title here"} //figure out
          handleChange={this.handleInput}
        />{" "}
        {/* Post text */}
        <TextArea
          rows={10}
          value={this.state.newUser.about}
          name={"currentPostInfo"}
          handleChange={this.handleTextArea}
          placeholder={"Enter post text here"}
        />
        {/* Post */}
        <Button
          action={this.handleFormSubmit}
          type={"primary"}
          title={"Create Post"}
          style={buttonStyle}
        />{" "}
        {/* Clear the form */}
        <Button
          action={this.handleClearForm}
          type={"secondary"}
          title={"Clear"}
          style={buttonStyle}
        />{" "}
        
      </form>
    );
  }
}

const buttonStyle = {
  margin: "10px 10px 10px 10px"
};

export default Compose;
