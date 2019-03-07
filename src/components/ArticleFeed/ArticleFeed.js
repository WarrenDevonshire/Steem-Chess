import React, {Component} from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import PostPreview from './PostPreview/PostPreview';
import ReactDOM from 'react-dom'

const client = new Client('https://api.steemit.com');

export default class ArticleFeed extends Component {

    constructor(props) {

        super(props);
        
        this.state = {

            // this will store page number for browsing further articles in feed
            pageNumber: 0,
            posts: []

        };
    
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
                    
                    this.state.posts.push(<PostPreview post={post} />);

                });

            
            })
    
            .catch(err => {
    
                alert('Error occured' + err);
    
            });
    }

    prevPage() {

        if (this.state.pageNumber > 0) {

            this.setState({ pageNumber: this.state.pageNumber - 1 });

        } else {

            alert("Already at first page!");

        }
        
    
    }

    nextPage() {

        this.setState({ pageNumber: this.state.pageNumber + 1 })
    
    }

    render() {

        return (  

            <div className="ArticleFeed">
                <div class="list-group" id="postList">{this.state.posts.map(PostPreview => <div> {PostPreview} </div>)}</div>
                {this.fetchBlog(this.props.limit, this.props.sortMethod)}
                <button id="PrevPage" onClick={() => this.prevPage()}>Previous Page</button>
                {this.state.pageNumber}
                <button id="NextPage" onClick={() => this.nextPage()}>Next Page</button>
            </div>

        )
    }
}