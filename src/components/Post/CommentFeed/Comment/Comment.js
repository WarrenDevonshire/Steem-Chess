import React, { Component } from 'react';
import './Comment.css';

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

// TODO: fix comment body not parsing correctly

export default class Comment extends Component {

    constructor(props) {

        super(props);

        this.state = {

            commentAuthor: this.props.comment.author,
            commentPermlink: this.props.comment.permlink,
            commentBodyId: "commentBody" + this.props.id // this will give each reply box a unique id to pass to the pushComment callback function

        };

    }

    render() {

        return (
            
            <div className="Comment">

                <div class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">@{this.state.commentAuthor}</h5>
                <small class="text-muted">{new Date(
                    this.props.comment.created
                ).toString()}</small>
                </div>
                <p class="mb-1">{md.render(this.props.comment.body)}</p>
                <small class="text-muted">&#9650; ${
                    this.props.comment.net_votes
                    }</small>
                </div>

                <textarea id={this.state.commentBodyId} class="form-control" rows="3">Reply to this comment...</textarea><br />
                <input id="submitReplyBtn" type="button" value="Submit reply!" onClick={() => this.props.pushComment(this.state.commentAuthor, this.state.commentPermlink, this.state.commentBodyId)} class="btn btn-primary" />

            </div>

        )
    }
}