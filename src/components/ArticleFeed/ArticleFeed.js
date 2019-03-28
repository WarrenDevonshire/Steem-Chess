import React, {Component} from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import PostPreview from './PostPreview/PostPreview';
import { Link } from 'react-router-dom';
import { allSettled } from 'q';

const client = new Client('https://api.steemit.com');

// TODO: figure out how to grab more articles for next page and add routing/url for pages, add page number in props

export default class ArticleFeed extends Component {

    constructor(props) {

        super(props);
        
        this.state = {

            pageNumber: 0, // this will store page number for browsing further articles in feed
            posts: [],
            activePosts: []

        };

        this.fetchBlog(this.props.limit, this.props.sortMethod);
    
    }

    fetchBlog() {
        
        // set up query
        const query = {
            tag: 'chess',
            limit: this.props.limit,
        };

        let postList = [];
        
        client.database
            .getDiscussions(this.props.sortMethod, query) // fetch posts
            .then(result => {
    
                result.forEach(post => {
                    
                    postList.push(<PostPreview post={post} />);

                });

                this.setState( { posts: postList } );
                this.setState( { activePosts: postList.slice(0, 9) })
                this.forceUpdate();
            
            })
    
            .catch(err => {
    
                alert('Error occured' + err);
    
            });

    }

    // switch out posts displayed on page when going to a new page on the feed
    updatePage(direction) { // true=forward, false=back for direction

        if (direction) {

            // go forward a page
            if (this.state.pageNumber < 10) {

                this.setState({ pageNumber: this.state.pageNumber + 1 } );
    
            } else {
    
                alert("Already at last page!");
                return;
    
            }

        } else {

            //go back a page
            if (this.state.pageNumber > 0) {

                this.setState({ pageNumber: this.state.pageNumber - 1 } );
    
            } else {
    
                alert("Already at first page!");
                return;
    
            }

            this.setState({ activePosts: this.state.posts.slice((this.state.pageNumber * 10), (((this.state.pageNumber + 1) * 10) - 1)) });

        }

    }

    render() {

        return (  

            <div id="ArticleFeed" className="ArticleFeed">

                <Link to="/Compose"><button>Compose New Article</button></Link>
                <hr />
                <button id="PrevPage" onClick={() => this.updatePage(false)}>Previous Page</button>
                <p>Page {this.state.pageNumber + 1}</p>
                <button id="NextPage" onClick={() => this.updatePage(true)}>Next Page</button>
                <hr />
                <div class="list-group" id="postList">{this.state.activePosts.map(PostPreview => <div> {PostPreview} <hr /></div>)}</div>
                <p>Page {this.state.pageNumber + 1}</p>    

            </div>

        )
    }
}