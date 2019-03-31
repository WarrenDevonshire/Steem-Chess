import React, { Component } from 'react';
import './CommentFeed.css';
import { Client, PrivateKey } from 'dsteem';
import Comment from './Comment/Comment';
import { Mainnet as NetConfig } from '../../../configuration';
import {loadState} from "../../../components/localStorage";
import {withRouter} from 'react-router-dom';

let opts = { ...NetConfig.net };
const fetchClient = new Client('https://api.steemit.com');
const pushClient = new Client(NetConfig.url, opts);

// TODO: refresh page when comment or reply is posted, may not be viable due to blockchain delays
// TODO: use client from post component passed as callback?

export default class CommentFeed extends Component {

    constructor(props) {

        super(props);

        const localDB = loadState();
        const pKey = PrivateKey.from(localDB.key);

        this.state = {

            // the post whose comments are being loaded in this commentFeed component is referred to as the parent post
            parentAuthor: this.props.author,
            parentPermlink: this.props.permlink,
            comments: [],
            account: localDB.account,
            privateKey: pKey

        };

        console.log(this.state.privateKey);
        this.pushComment = this.pushComment.bind(this);
        this.fetchComments(this.state.parentAuthor, this.state.parentPermlink, -1, this.fetchComments);
        
    }

    // fetch comments on parent post
    fetchComments(parentAuthor, parentPermlink, bodyId, fetchCallback) {

        let commentList = [];

        fetchClient.database
            .call('get_content_replies', [parentAuthor, parentPermlink]) // fetch post comments
            .then(result => {
                
                // push all post comments to state
                for (var i = 0; i < result.length; i++) {

                    if (bodyId === -1) {

                        commentList.push(<Comment comment={result[i]} pushComment={this.pushComment} fetchComments={fetchCallback} id={"commentBody" + i} />);

                    } else {

                        commentList.push(<Comment comment={result[i]} pushComment={this.pushComment} fetchComments={fetchCallback} id={"commentBody" + bodyId + "-" + i} />);

                    }
                
                }

                this.setState( {comments: commentList} );

            });

    }

    // push new comment to blockchain
    pushComment(parentAuthor, parentPermlink, bodyId) {

        if(this.state.account == null) {

            this.props.history.push('/Login');
            return;

        }

        // get body
        const body = document.getElementById(bodyId).value;
        // get parent author permalink
        const parent_author = parentAuthor;
        // get parent author permalink
        const parent_permlink = parentPermlink;

        // generate random permanent link for post
        const permlink = Math.random()
            .toString(36)
            .substring(2);

        const payload = {
            author: this.state.account,
            title: '',
            body: body,
            parent_author: parent_author,
            parent_permlink: parent_permlink,
            permlink: permlink,
            json_metadata: '',
        };

        // push comment to blockchain
        console.log('pustCSlient.broadcast.comment payload:', payload);
        pushClient.broadcast.comment(payload, this.state.privateKey).then(
            function (result) {
                console.log('client.broadcast.comment response', result);
                alert("Success.")
            },
            function (error) {
                console.error(error);
            }
        );

    }

    render() {

        return (
            <div id="CommentFeed" class="container"><br />

                <hr />
                <h4>Submit a comment:</h4>
                Username: <input id="username" type="text" size="65" class="form-control" defaultValue="" /><br />
                Posting private key: <input id="postingKey" type="password" size="65" class="form-control" defaultValue="" /><br />
                Comment body:<br />
                <textarea id="body" class="form-control" rows="3">Reply to this post...</textarea><br />
                <input id="submitCommentBtn" type="button" value="Submit comment!" onClick={() => this.pushComment(this.state.parentAuthor, this.state.parentPermlink, 'body')} class="btn btn-primary" />
                <div id="postLink" />

                <h1>Comments</h1>
                <hr />
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {Comment} </div>)}</div>

            </div>
        )
    }
}