import React, { Component } from "react";

/* Import Components */
import Input from "../../shared/components/utils/Input";
import TextArea from "../../shared/components/utils/TextArea";
import Button from "../../shared/components/utils/Button";

class Compose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newUser: {
        name: "", //change to post_title
        age: "", //change to post_tags
        about: "" //change to post_text
      },
    };
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    //this.handleFormSubmit = this.handleFormSubmit.bind(this); **rework for posting**
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
/*
  Still trying to understand how sumbit works and how we can structure it
  to create an actual post on the blockchain. At the moment commenting out,
  page will just refresh, otherwise itll show a fetch error which I figure
  wouldnt be good for the demo, obv just exlude that hitting create post will
  create the post...

  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.newUser;

    fetch("http://example.com", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      response.json().then(data => {
        console.log("Successful" + data);
      });
    });
  }
*/
  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        name: "", //fields have to be changed to appropriate names
        age: "",
        about: ""
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
