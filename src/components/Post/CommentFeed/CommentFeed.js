import React, { Component } from 'react';
import './CommentFeed.css';
import { Client, PrivateKey } from 'dsteem';
import Comment from './Comment/Comment';
import { Mainnet as NetConfig } from '../../../configuration';
import { loadState } from "../../../components/localStorage";

let opts = { ...NetConfig.net };
const fetchClient = new Client('https://api.steemit.com');
const pushClient = new Client(NetConfig.url, opts);

// TODO: refresh page when comment or reply is posted, may not be viable due to blockchain delays
// TODO: use client from post component passed as callback?
// TODO: redirect back to page when sent to login gate?

export default class CommentFeed extends Component {

    constructor(props) {

        super(props);

        const localDB = loadState();
        var pKey;

        // check if user is logged in before attempting to gen privateKey object
        if (localDB.account == null) {

            pKey = null;

        } else {

            pKey = PrivateKey.fromString(localDB.key);
            
        }

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

                        commentList.push(<Comment comment={result[i]} pushComment={this.pushComment} fetchComments={fetchCallback} id={"commentBody" + i} history={this.props.history} />);

                    } else {

                        commentList.push(<Comment comment={result[i]} pushComment={this.pushComment} fetchComments={fetchCallback} id={"commentBody" + bodyId + "-" + i} history={this.props.history} />);

                    }
                
                }

                this.setState( {comments: commentList} );

            });

    }

    // push new comment to blockchain
    pushComment(parentAuthor, parentPermlink, bodyId) {

        // check if user is logged in before attempting to post a comment
        if (this.state.account == null) {

            this.props.history.push('/Login');
            return;

        }

        // check that comment body field is populated
        if (document.getElementById('body').value === "") {

            alert("Please fill out all fields.");
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
                alert("An error occurred when broadcasting. See console for details.");
            }
        );

    }

    render() {

        return (
            <div id="CommentFeed" class="container"><br />

                <hr />
                <h4>Submit a comment:</h4>
                Comment body:<br />
                <textarea id="Replybody" class="form-control" rows="3"placeholder='Reply to this post...'/><br />
                <input id="submitCommentBtn" type="button" value="Submit comment!" onClick={() => this.pushComment(this.state.parentAuthor, this.state.parentPermlink, 'body')} class="btn btn-primary" />
                <div id="postLink" />

                <h1>Comments</h1>
                <hr />
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {Comment} </div>)}</div>

            </div>
        )
    }
}