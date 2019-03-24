import React, { Component } from 'react';
import './Comment.css';

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

//TODO: pass pushComment as callback from commentfeed and use to post replies on comment via onclick

export default class Comment extends Component {

    constructor(props) {

        super(props);

        this.state = {

            author: this.props.comment.author,
            permlink: this.props.comment.permlink

        };

    }

    render() {

        return (
            
            <div className="Comment">

                <h4>{this.state.commentAuthor}</h4>
                <div class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">@${this.props.comment.author}</h5>
                <small class="text-muted">{new Date(
                    this.props.comment.created
                ).toString()}</small>
                </div>
                <p class="mb-1">{md.render(this.props.comment.body)}</p>
                <small class="text-muted">&#9650; ${
                    this.props.comment.net_votes
                    }</small>
                </div>

                <textarea id="body" class="form-control" rows="3">Reply to this comment...</textarea><br />
                <input id="submitReplyBtn" type="button" value="Submit reply!" onClick={() => this.props.pushComment()} class="btn btn-primary" />

            </div>

        )
    }
}