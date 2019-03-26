import React, { Component } from 'react';
import './CommentFeed.css';
import { Client, PrivateKey } from 'dsteem';
import Comment from './Comment/Comment';
import { Mainnet as NetConfig } from '../../../configuration';

let opts = { ...NetConfig.net };
const fetchClient = new Client('https://api.steemit.com');
const pushClient = new Client(NetConfig.url, opts);

// TODO: open replies to comments recusively the same way that a post is opened
// TODO: refresh page when comment or reply is posted

export default class CommentFeed extends Component {

    constructor(props) {

        super(props);

        this.state = {

            // the post whose comments are being loaded in this commentFeed component is referred to as the parent post
            parentAuthor: this.props.author,
            parentPermlink: this.props.permlink,
            comments: []

        };

        this.fetchComments(this.state.parentAuthor, this.state.parentPermlink);
        this.forceUpdate();
        
    }

    // fetch comments on parent post
    fetchComments(parentAuthor, parentPermlink) {

        let commentList = [];

        fetchClient.database
            .call('get_content_replies', [parentAuthor, parentPermlink]) // fetch post comments
            .then(result => {
                
                // push all post comments to state
                for (var i = 0; i < result.length; i++) {

                    commentList.push(<Comment comment={result[i]} pushComment={this.pushComment} fetchComments={this.fetchComments} id={i} />);

                }

                this.setState( {comments: commentList} );
                
                // update commentFeed to show all comments
                //this.forceUpdate();

            });

    }

    pushComment(parentAuthor, parentPermlink, bodyId) {

        // get private key
        const privateKey = PrivateKey.fromString(
            document.getElementById('postingKey').value
        );
        // get account name
        const account = document.getElementById('username').value;
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
            author: account,
            title: '',
            body: body,
            parent_author: parent_author,
            parent_permlink: parent_permlink,
            permlink: permlink,
            json_metadata: '',
        };

        // push comment to blockchain
        console.log('pustCSlient.broadcast.comment payload:', payload);
        pushClient.broadcast.comment(payload, privateKey).then(
            function (result) {
                alert(result);
                console.log('client.broadcast.comment response', result);
                document.getElementById('postLink').style.display = 'block';
                document.getElementById(
                    'postLink'
                ).innerHTML = `<br/><p>Included in block: ${
                    result.block_num
                    }</p><br/><br/><a href="http://condenser.steem.vc/@${parent_author}/${parent_permlink}">Check post here</a>`;
            },
            function (error) {
                console.error(error);
            }
        );

    }

    render() {

        return (
            <div id="CommentFeed" class="container" id="content"><br />

                <h4>Submit a comment:</h4>
                Username: <input id="username" type="text" size="65" class="form-control" value="" /><br />
                Posting private key: <input id="postingKey" type="password" size="65" class="form-control" value="" /><br />
                Comment body:<br />
                <textarea id="body" class="form-control" rows="3">test</textarea><br />
                <input id="submitCommentBtn" type="button" value="Submit comment!" onClick={() => this.pushComment(this.state.parentAuthor, this.state.parentPermlink, Document.getElementById('body'))} class="btn btn-primary" />
                <div id="postLink" />

                <h1>Comments</h1>
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => <div> {Comment} </div>)}</div>

            </div>
        )
    }
}