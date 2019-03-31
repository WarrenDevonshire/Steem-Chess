/* Import Components */
import React, { Component } from "react";
import Input from "../../shared/components/utils/Input";
import TextArea from "../../shared/components/utils/TextArea";
import Button from "../../shared/components/utils/Button";
import {Client, PrivateKey} from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';

const dsteem = require('dsteem');
//test
let opts = { ...Netconfig.net };
//connect to community testnet
/*opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
*/
const client = new Client(NetConfig.url, opts);

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
    
    const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    const privateKey = dsteem.PrivateKey.fromString(
      this.state.newUser.pk
  );
  //get account name
  const account = this.state.newUser.userName;
  //get title
  const title = this.state.newUser.name;
  //get body
  const body = this.state.newUser.about;
  //get tags and convert to array list
  const tags = this.state.newUser.age;
  const taglist = tags.split(' ');
  //make simple json metadata including only tags
  const json_metadata = JSON.stringify({ tags: taglist });
  //generate random permanent link for post
  //const permlink = Math.random()
    //  .toString(36)
    //  .substring(2);
    
    client.broadcast
    .comment(
        {
            author: account,
            body: body,
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0],
            permlink: permlink,
            title: title,
        },
        privateKey
    )
    .then(
      this.setState({
        newUser: {
          name: "", //fields have to be changed to appropriate names
          age: "",
          about: "",
          pk: "",
          userName: ""
        }
      })
        /*function(result) {
            this.state.newUser.name = '';
            this.state.newUser.about = '';
            this.state.newUser.tags = '';
            document.getElementById('postLink').style.display = 'block';
            document.getElementById(
                'postLink'
            ).innerHTML = `<br/><p>Included in block: ${
                result.block_num
            }</p><br/><br/><a href="http://condenser.steem.vc/${
                taglist[0]
            }/@${account}/${permlink}">Check post here</a>`;
        },
        function(error) {
            console.error(error);
        }*/
    ); 
    
    
    
    /*steem.broadcast.comment(
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
    ); */ 
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
          defaultValue={this.state.newUser.pk}
          placeholder={"Enter posting key here"}
          handleChange={this.handlePostingKey}
        />{" "}
        {/* Username */}
        <Input
          inputType={"text"}
          name={"username"}
          title={"Username"}
          defaultValue={this.state.newUser.userName}
          placeholder={"Enter your username here"}
          handleChange={this.handleUserName}
        />{" "}
        {/* Tags */}
        <Input
          inputType={"text"}
          name={"tag"}
          title={"Tags"}
          defaultValue={this.state.newUser.age}
          placeholder={"Enter a tag here"}
          handleChange={this.handleTag}
        />{" "}
        {/* Title of Post */}
        <Input
          inputType={"text"}
          title={"Title"}
          name={"name"}   //adjusting this to title prevents input
          defaultValue={this.state.newUser.name} //something to do with .name, gotta
          placeholder={"Enter title here"} //figure out
          handleChange={this.handleInput}
        />{" "}
        {/* Post text */}
        <TextArea
          rows={10}
          defaultValue={this.state.newUser.about}
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
