import React, { Component } from 'react';
import './CommentFeed.css';
import { Client } from 'dsteem';
import Comment from './Comment/Comment';

const fetchClient = new Client('https://api.steemit.com');

export default class CommentFeed extends Component {

    constructor(props) {

        super(props);

        this.state = {

            api: this.props.getAPI(),
            parentAuthor: this.props.author,
            parentPermlink: this.props.permlink,
            comments: []

        };

        this.props.getAPI().me(this.getUserName.bind(this));
        this.fetchComments();
    }

    getUserName(error, result) {

        if (result) {
            console.log(result);

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
                
                for (var i = 0; i < result.length; i++) {

                    this.state.comments.push(<Comment comment={result[i]} />);

                }

                this.forceUpdate();

            });

    }

    pushComment() {

        if (document.getElementById('body').value === '') {

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
            console.log(body);
    
            this.state.api.comment(this.state.parentAuthor, this.state.parentPermlink, author, permlink, title, body, jsonMetadata,
                function (error, result) {
                console.log(result);
                console.log(error);
              });

        }

    }

    render() {

        return (
            <div id="CommentFeed" class="container" id="content"><br />
                <h4>Submit a comment:</h4>
                Comment body:<br />
                <textarea id="body" class="form-control" rows="3">test</textarea><br />
                <input id="submitCommentBtn" type="button" value="Submit comment!" onClick={() => this.pushComment()} class="btn btn-primary" />
                <div id="postLink" />
                <h1>Comments</h1>
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {Comment} </div>)}</div>
            </div>
        )
    }
}

//<div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {(props) => <Comment {...props} pushComment={this.pushComment}/>} </div>)} </div>