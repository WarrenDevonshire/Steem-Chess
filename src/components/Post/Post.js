import React, {Component} from 'react';
import './Post.css';
import { Client } from 'dsteem';
import CommentFeed from './CommentFeed/CommentFeed';

const client = new Client('https://api.steemit.com');
const Remarkable = require('remarkable');

export default class Post extends Component{

    constructor(props) {

        super(props);

        this.state = {

            author: props.match.params.author,
            permlink: props.match.params.permlink,
            comments: []

        };

        {this.openPost()};

    }

    openPost() {
    
            // fetch post content
            client.database.call('get_content', [this.state.author, this.state.permlink]).then(result => {
    
                const md = new Remarkable({ html: true, linkify: true });
                const body = md.render(result.body);
                const content = `<div class='pull-right'></div><br><h2>${
                    result.title
                }</h2><br>${body}<br>`;
        
                document.getElementById('postBody').style.display = 'block';
                document.getElementById('postBody').innerHTML = content;

            });

    }

    render(){

        return (  
            <div className="Post">
                <div id="postBody" styles="display: none;"></div>	
                <CommentFeed author={this.state.author} permlink={this.state.permlink} getAccessToken={this.props.getAccessToken} getAPI={this.props.getAPI}/>
            </div>
        )
    }
}