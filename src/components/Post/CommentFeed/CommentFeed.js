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

export default class CommentFeed extends Component {

    constructor(props) {

        super(props);

        const localDB = loadState();

        this.state = {

            // the post whose comments are being loaded in this commentFeed component is referred to as the parent post
            parentAuthor: this.props.author,
            parentPermlink: this.props.permlink,
            comments: [],
            account: localDB.account,
            key: localDB.key

        };

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

            })

            .catch(err => {

                alert('Error occured: ' + err);

            });

    }

    // push new comment to blockchain
    pushComment(parentAuthor, parentPermlink, bodyId) {

        // check if user is logged in before attempting to post a comment
        if (this.state.account == null) {

            this.props.history.push('/Login');
            return;

        }

        var pKey;

        // if user is logged in, gen privateKey obejct from stored posting key
        try {

            pKey = PrivateKey.fromString(this.state.key);

        } catch (e) {

            console.error(e);

            // check for garbage login, redirect to login if privatekey can't be generated
            // this exception is thrown if password is invalid or is not a posting key, does not check for username/password association
            if (e.message === "private key network id mismatch") {

                alert("Bad password, please login again.");
                this.props.history.push('/Login');
                return;

            } else {

                // if any other exception is thrown, redirect to home
                alert("An error occurred when generating key. See console for details.");
                this.props.history.push('/');
                return;

            }

        }

        // check that comment body field is populated
        if (document.getElementById(bodyId).value === "") {

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

        // construct payload object to broadcast
        const payload = {

            author: this.state.account,
            title: '',
            body: body,
            parent_author: parent_author,
            parent_permlink: parent_permlink,
            permlink: permlink,
            json_metadata: '',

        };

        // attempt to broadcast comment
        console.log('pustCSlient.broadcast.comment payload:', payload);
        pushClient.broadcast.comment(payload, pKey).then(

            function (result) {

                console.log('client.broadcast.comment response', result);
                alert("Success.")

            },

            function (error) {

                console.error(error);

                // check for bad username with valid password
                // TODO: can't redirect to login when in .then, need to pass instance of this in somehow
                if (error.message.includes("unknown key")) {

                    alert("Bad username, please login again.");
                    this.props.history.push('/Login');
                    return;
                    
                } else {

                    // all other exceptions
                    alert("An error occurred when broadcasting. See console for details.");

                }

            }

        );

    }

    render() {

        return (
            <div id="CommentFeed" class="container"><br />

                <hr />
                <h4>Submit a comment:</h4>
                Comment body:<br />
                <textarea id="commentBodyRoot" class="Replybody" rows="3" placeholder='Reply to this post...'/><br />
                <input id="submitCommentBtn" type="button" value="Submit comment!" onClick={() => this.pushComment(this.state.parentAuthor, this.state.parentPermlink, 'commentBodyRoot')} class="btn btn-primary" />
                <div id="postLink" />

                <h1>Comments</h1>
                <hr />
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {Comment} </div>)}</div>

            </div>
        )
    }
}