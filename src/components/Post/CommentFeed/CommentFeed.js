import React, { Component } from 'react';
import './CommentFeed.css';
import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../../configuration';

let opts = { ...NetConfig.net };

const fetchClient = new Client('https://api.steemit.com');
const pushClient = new Client(NetConfig.url, opts);
const Remarkable = require('remarkable');

export default class Post extends Component {

    constructor(props) {

        super(props);

        this.state = {

            author: this.props.author,
            permlink: this.props.permlink

        };

        this.fetchComments();

    }

    fetchComments() {

        fetchClient.database
            .call('get_content_replies', [this.state.author, this.state.permlink]) // fetch post comments
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

        //get private key
        const privateKey = PrivateKey.fromString(
            document.getElementById('postingKey').value
        );
        //get account name
        const account = document.getElementById('username').value;
        //get body
        const body = document.getElementById('body').value;
        //get parent author permalink
        const parent_author = document.getElementById('parent_author').value;
        //get parent author permalink
        const parent_permlink = document.getElementById('parent_permlink').value;

        //generate random permanent link for post
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

        console.log('pustCSlient.broadcast.comment payload:', payload);
        pushClient.broadcast.comment(payload, privateKey).then(
            function (result) {
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

    clearFields() {
        document.getElementById('body').value = '';
        document.getElementById('parent_author').value = '';
        document.getElementById('parent_permlink').value = '';
    };

    render() {

        return (
            <div id="CommentFeed" class="container" id="content"><br />
                <h4>Submit a post to the Steem blockchain</h4>
                Username: <input id="username" type="text" size="65" class="form-control" /><br />
                Posting private key: <input id="postingKey" type="password" size="65" class="form-control" /><br />
                Parent Author: <input id="parent_author" type="text" size="20" /><br />
                Parent Post Permalink: <input id="parent_permlink" type="text" size="20" /><br />
                Comment body:<br />
                <textarea id="body" class="form-control" rows="3">Content of the comment</textarea><br />
                <input id="submitPostBtn" type="button" value="Submit comment!" onClick={() => this.pushComment()} class="btn btn-primary" />
                <input id="clearFieldsBtn" type="button" value="Clear Fields" onClick={() => this.clearFields()} class="btn btn-primary" />
                <div id="postComments" styles="display: none;" class="list-group"></div>
            </div>
        )
    }
}