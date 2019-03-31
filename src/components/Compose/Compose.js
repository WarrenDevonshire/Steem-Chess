import React, { Component } from 'react';
import './Compose.css';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import {loadState} from "../../components/localStorage";

let opts = { ...NetConfig.net };

const pushClient = new Client(NetConfig.url, opts);

export default class Compose extends Component {
  
    constructor(props) {

        super(props);

        this.state = {
            


        };
      }



      render() {

        return (

          <div class="container" id="content"><br />
            <h4>Submit a post to the Steem blockchain</h4>
                Title of post: <input id="title" type="text" size="65" class="form-control" value="Here goes title" /><br />
                  Post body:<br />
                  <textarea id="body" class="form-control" rows="3">Content of the post</textarea><br />
                  Tags: <input id="tags" type="text" size="65" class="form-control" value="tag1 tag2 tag3" /><br />
                    <input id="submitPostBtn" type="button" value="Submit post!" onclick="submitPost()" class="btn btn-primary" />
                      <div id="postLink" style="display: none;">
                      </div>
		      </div>

        )

      }

    }