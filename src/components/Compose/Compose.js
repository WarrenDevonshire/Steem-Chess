import React, { Component } from 'react';
import './Compose.css';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import { loadState } from "../../components/localStorage";
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

let opts = { ...NetConfig.net };

const client = new Client(NetConfig.url, opts);

// TODO: default to mark down, add button for switching to editor and back
// TODO: add image button, other buttons
// <textarea id="body" class="form-control" rows="3" placeholder="Write your post here"></textarea><br />

export default class Compose extends Component {

    constructor(props) {

        super(props);

        // postSubmitted must be set to false before checking for redirect so that
        // render does not crash when trying to access it in the case of a user not being logged in
        this.state = {
            
          postSubmitted: false,
          postBody: ""

        };

        const localDB = loadState();

        // check if user is logged in, redirect if not
        if (localDB.account == null) {

          this.props.history.push('/Login');
          return;

        }

        // if user is logged in, gen privateKey obejct from stored posting key
        const pKey = PrivateKey.fromString(localDB.key);

        this.state = {
            
          account: localDB.account,
          privateKey: pKey,

        };

        this.pushPost = this.pushPost.bind(this);
        this.handleChange = this.handleChange.bind(this);

      }

      pushPost() {

        // check that all fields are populated
        if (document.getElementById('title').value === "" || document.getElementById('body').value === "") {

          alert("Please fill out all fields.");
          return;

        }

        //get title
        const title = document.getElementById('title').value;
        //get tags and convert to array list
        const tags = document.getElementById('tags').value;
        const taglist = tags.split(' ');
        //make simple json metadata including only tags
        const json_metadata = JSON.stringify({ tags: taglist });
        //generate random permanent link for post
        const permlink = Math.random()
          .toString(36)
          .substring(2);

        this.setState({ permlink: permlink });

        const payload = {
          author: this.state.account,
          body: this.state.postBody,
          json_metadata: json_metadata,
          parent_author: '',
          parent_permlink: taglist[0],
          permlink: permlink,
          title: title,
        };
        console.log('client.broadcast.comment:', payload);
        client.broadcast.comment(payload, this.state.privateKey).then(result => {
            alert("Success.");
            this.setState({ postSubmitted: true });
            document.getElementById("submitPostBtn").disabled = true;
          },
          function (error) {
            console.error(error);
            alert("An error occurred when broadcasting. See console for details.");
          }
        );

      }

      handleChange(value) {

          this.setState({ postBody: value });

      }

      render() {

        return (

          <div class="container" id="content"><br />
            <h4>Submit a post to the Steem blockchain</h4>
            Title of post: <input id="title" class='input' type="text" size="65" class="form-control" /><br />
            <ReactQuill value={"Write your post here..."} onChange={this.handleChange} />
            Tags: <input id="tags" class='input' type="text" size="65" class="form-control" value="chess" /><br />
            <input id="submitPostBtn" type="button" value="Submit post!" onClick={() => this.pushPost()} class="btn btn-primary" /><br />
            { this.state.postSubmitted ? <Link to={`Post/@${this.state.account}/${this.state.permlink}`}><h1>View new post</h1></Link> : null }
		      </div>

        )

      }

    }