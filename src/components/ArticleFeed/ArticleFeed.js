import React, { Component } from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import PostPreview from './PostPreview/PostPreview';
import { Link } from 'react-router-dom';

const client = new Client('https://api.steemit.com');

export default class ArticleFeed extends Component {

    constructor(props) {

        super(props);

        this.state = {

            posts: []

        };

        this.fetchBlog(this.props.limit, this.props.sortMethod);

    }

    fetchBlog() {

        const query = {
            tag: 'chess',
            limit: this.props.limit,
        };

        client.database
            .getDiscussions(this.props.sortMethod, query)
            .then(result => {

                result.forEach(post => {

                    this.state.posts.push(<PostPreview post={post}/>);

                });

                this.forceUpdate();

            })

            .catch(err => {

                alert('Error occured: ' + err);

            });

    }

    render() {

        return (
            
            <div className="ArticleFeed">

                <div class="list-group" id="postList">{this.state.posts.map(PostPreview =>
                    <div> {PostPreview} </div>)}</div>

            </div>

        )

    }
    
}