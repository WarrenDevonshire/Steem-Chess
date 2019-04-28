import React, { Component } from 'react';
import './Comment.css';
import ReactHtmlParser from 'react-html-parser';
import UpVote from '../../../UpVote/UpVote';

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

export default class Comment extends Component {

    constructor(props) {

        super(props);

        this.fetchComments = this.props.fetchComments.bind(this);
        this.pushComment = this.props.pushComment.bind(this);
        this.expandDropdown = this.expandDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);

        // extract id number from commentBodyId
        let bodyId= this.props.id.replace( /^\D+/g, '');

        this.state = {

            expanded: false,
            comments: [], // this will hold all replies to this comment
            commentAuthor: this.props.comment.author,
            commentPermlink: this.props.comment.permlink,
            numericId: bodyId, // this holds just the numeric suffix to append to unique id's in this comment
            commentBodyId: this.props.id, // this will give each reply box a unique id to pass to the pushComment callback function
            replyButtonValue: "Open replies" // this will hold the text that the open/close replies button should display

        };

    }

    handleClick() {

        if(this.state.expanded == false) {

            this.expandDropdown();

        } else {

            this.closeDropdown();

        }

    }

    expandDropdown() {

        this.fetchComments(this.state.commentAuthor, this.state.commentPermlink, this.state.numericId, this.props.fetchComments);
        this.setState( {expanded: true} );
        this.setState( {replyButtonValue: "Close replies"} );

    }

    closeDropdown() {

        this.setState( {expanded: false} );
        this.setState( {replyButtonValue: "Open replies"} );

    }

    render() {

        const body = md.render(this.props.comment.body);

        return (
            
            <div id="Comment" className="Comment">

                <div class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">@{this.state.commentAuthor}</h5>
                <small class="text-muted">{new Date(
                    this.props.comment.created
                ).toString()}</small>
                </div>
                <p class="mb-1">{ ReactHtmlParser(body) }</p>
                <small class="text-muted">&#9650; ${
                    this.props.comment.net_votes
                    }</small>
                </div>

                <textarea id={this.state.commentBodyId} class="commentReply" rows="3" placeholder='Reply to this comment...'/><br />
                <div id='Buttons'>
                <input id="submitReplyBtn" type="button" value="Submit reply!" onClick={() => this.pushComment(this.state.commentAuthor, this.state.commentPermlink, this.state.commentBodyId)} class="btn btn-primary" />

                <button onClick={() => this.handleClick()} class="openReplies" id={"openReplies"} >{this.state.replyButtonValue}</button>
                <div id="UpVote"><UpVote author={this.state.commentAuthor} permlink={this.state.commentPermlink} id={this.state.numericId} history={this.props.history} /></div>
                <div class="list-group" id="postComments">{this.state.comments.map(Comment => {
                    return this.state.expanded ?  <div> {Comment} </div> : null
                })} </div>
                </div>
            </div>

        )
    }
}