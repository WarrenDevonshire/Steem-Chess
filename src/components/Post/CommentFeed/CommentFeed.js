import React, { Component } from 'react';
import './CommentFeed.css';
import { Client } from 'dsteem';
import sc2 from "steemconnect";

const fetchClient = new Client('https://api.steemit.com');
const Remarkable = require('remarkable');

const api = sc2.Initialize({
    app: 'SteemChess',
    callbackURL: 'https://localhost:3000/Success',
    accessToken: 'access_token',
    scope: ['vote', 'comment']
  });

export default class Post extends Component {

    constructor(props) {

        super(props);

        api.setAccessToken(this.props.getAccessToken());
        
        api.me(this.getUserName.bind(this));

        this.state = {
            
            parentAuthor: this.props.author,
            parentPermlink: this.props.permlink

        };

        this.fetchComments();
        
    }

    getUserName(error, result) {

        if (result) {

            this.setState( ()=>{

                return {userName: result.name};
    
            })

        } else {

            alert(error);

        }

    }

    //fetch comments on parent post
    fetchComments() {

        fetchClient.database
            .call('get_content_replies', [this.state.parentAuthor, this.state.parentPermlink]) // fetch post comments
            .then(result => {

                const md = new Remarkable({ html: true, linkify: true });
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

    }

    pushComment() {

        if (document.getElementById('body').value == '') {

            alert("Can't post an empty comment!");

        } else {

            const author = this.state.userName;

            //generate random permanent link for post
            const permlink = Math.random()
                .toString(36)
                .substring(2);
    
            const title = '';

            const jsonMetadata = '';

            const body = document.getElementById('body').value;
    
            api.comment(this.state.parentAuthor, this.state.parentPermlink, author, permlink, title, body, jsonMetadata, function (error, result) {
                if (error) alert(error);
              });

        }

    }

    clearFields() {
        document.getElementById('body').value = '';
    };

    render() {

        return (
            <div id="CommentFeed" class="container" id="content"><br />
                <h4>Submit a comment:</h4>
                Comment body:<br />
                <textarea id="body" class="form-control" rows="3">test</textarea><br />
                <input id="submitPostBtn" type="button" value="Submit comment!" onClick={() => this.pushComment()} class="btn btn-primary" />
                <input id="clearFieldsBtn" type="button" value="Clear Fields" onClick={() => this.clearFields()} class="btn btn-primary" />
                <div id="postLink" />
                <h1>Comments</h1>
                <div id="postComments" styles="display: none;" class="list-group"></div>
            </div>
        )
    }
}