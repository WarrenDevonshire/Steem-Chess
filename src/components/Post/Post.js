import React, {Component} from 'react';
import './Post.css';
import { Client, PrivateKey } from 'dsteem';
import UpVote from '../UpVote/UpVote';

const client = new Client('https://api.steemit.com');
//const postClient = new Client(NetConfig.url, opts);
const Remarkable = require('remarkable');

export default class Post extends Component{

    constructor(props) {

        super(props);

        this.state = {

            author: props.match.params.author,
            permlink: props.match.params.permlink

        };

        {this.openPost()};

    }

    openPost() {
    
            // fetch post content
            client.database.call('get_content', [this.state.author, this.state.permlink]).then(result => {
    
                const md = new Remarkable({ html: true, linkify: true });
                const body = md.render(result.body);
                const content = `<div class='pull-right'></div><br><h2>${
                    result.title
                }</h2><br>${body}<br>`;
        
                document.getElementById('postBody').style.display = 'block';
                document.getElementById('postBody').innerHTML = content;

            client.database
            .call('get_content_replies', [this.state.author, this.state.permlink]) // fetch post comments
            .then(result => {

                const comments = [];
                for (var i = 0; i < result.length; i++) {
                    comments.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                    <div class="d-flex w-100 justify-content-between">\
                      <h5 class="mb-1">@${result[i].author}</h5>\
                      <small class="text-muted">${new Date(
                          result[i].created
                      ).toString()}</small>\
                    </div>\
                    <p class="mb-1">${md.render(result[i].body)}</p>\
                    <small class="text-muted">&#9650; ${
                        result[i].net_votes
                    }</small>\
                  </div>`
                    );
                }

                document.getElementById('postComments').style.display = 'block';
                document.getElementById(
                    'postComments'
                ).innerHTML = comments.join('');

            });
            });

    }

    pushComment() {

        alert("This will post a comment eventually.");
    
    }

    render(){

        return (  
            <div className="Post">
                <div id="postBody" styles="display: none;"></div>	
                <h1>Comments</h1>
                <div class = "UpVote"><UpVote author = {this.state.author} permlink = {this.state.permlink} ></UpVote></div>
                <div id="composeComment" styles="display: none;">Compose comment:<br /><textarea id="commentText" class="composeComment" /><br /><input id="pushCommentButton" type="button" value="Post Comment" onClick={() => this.pushComment()} /></div>
                <div id="postComments" styles="display: none;" class="list-group"></div>
            </div>
        )
    }
} 