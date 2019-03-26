import React, { Component } from 'react';
import './Comment.css';

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

// TODO: fix comment body not parsing correctly

export default class Comment extends Component {

    constructor(props) {

        super(props);

        this.fetchComments = this.props.fetchComments.bind(this);
        this.expandDropdown = this.expandDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);

        this.state = {

            expanded: false,
            comments: [], // this will hold all replies to this comment
            commentAuthor: this.props.comment.author,
            commentPermlink: this.props.comment.permlink,
            commentBodyId: "commentBody" + this.props.id // this will give each reply box a unique id to pass to the pushComment callback function

        };

    }

    expandDropdown(fetchComments) {

        fetchComments(this.state.commentAuthor, this.state.commentPermlink);
        this.setState( {expanded: true} );

    }

    closeDropdown() {

        this.setState( {expanded: false} );

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

                <button onClick={() => this.expandDropdown(this.fetchComments)}>Open replies</button>
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => {
                    return this.state.expanded ?
                    <div> {Comment} </div>
                        :
                        null
                })} </div>
                { this.state.expanded ? <button onClick={this.closeDropdown}>Close replies</button> : null }

            </div>

        )
    }

   /*  <div class="list-group" id="postComments">{this.state.comments.map(Comment => {
        return this.state.expanded ?
            <h1>test</h1>
        :
            null
    })} </div> */
}