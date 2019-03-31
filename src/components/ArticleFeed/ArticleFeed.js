import React, {Component} from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import PostPreview from './PostPreview/PostPreview';
import { Link } from 'react-router-dom';

const client = new Client('https://api.steemit.com');

// TODO: figure out how to add routing/url for pages, add page number in props
// TODO: component does not update unless activePosts becomes empty?

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

                alert(result.length + " posts retrieved.");
                alert("pageLimit: " + (Math.ceil(result.length / 10)));

                this.setState( { pageLimit: Math.ceil(result.length / 10) } );
                this.setState( { posts: postList } );
                this.setState( { activePosts: postList.slice((this.state.pageNumber * 10), ((this.state.pageNumber + 1) * 10)) })
            
            })
    
            .catch(err => {
    
                alert('Error occured' + err);
    
            });

    }

    // switch out posts displayed on page when going to a new page on the feed
    updatePage(direction) { // true=forward, false=back for direction

        if (direction) {

            // go forward a page
            if (this.state.pageNumber < 9) {

                this.setState({ pageNumber: this.state.pageNumber + 1 }, () => {

                    this.setState({ activePosts: this.state.posts.slice((this.state.pageNumber * 10), ((this.state.pageNumber + 1) * 10)) }, () => {

                        alert("Switching to page: " + (this.state.pageNumber + 1) + ". activePosts for new page contains: " + this.state.activePosts.length + " posts.");

                    });
                     
                });
    
            } else {
    
                alert("Already at last page!");
                return;
    
            }

        } else {

            //go back a page
            if (this.state.pageNumber > 0) {

                this.setState({ pageNumber: this.state.pageNumber - 1 }, () => {

                    this.setState({ activePosts: this.state.posts.slice((this.state.pageNumber * 10), ((this.state.pageNumber + 1) * 10)) }, () => {

                        alert("Switching to page: " + (this.state.pageNumber + 1) + ". activePosts for new page contains: " + this.state.activePosts.length + " posts.");

                    });
                     
                });
    
            } else {
    
                alert("Already at first page!");
                return;
    
            }

        }

    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.activePosts === nextState.activePosts) {

            alert("not updating");
            return false;

        } else {

            alert("updating");
            return true;

        }

    }

    render() {

        return (  

            <div id="ArticleFeed" className="ArticleFeed">

                <Link to="/Compose"><button>Compose New Article</button></Link>
                <hr />
                <button id="PrevPageBtn" onClick={() => this.updatePage(false)}>Previous Page</button>
                <p>Page {this.state.pageNumber + 1}</p>
                <button id="NextPageBtn" onClick={() => this.updatePage(true)}>Next Page</button>
                <hr />
                <div class="list-group" id="postList">{this.state.activePosts.map(PostPreview => <div> {PostPreview} <hr /></div>)}</div>
                <p>Page {this.state.pageNumber + 1}</p>    

            </div>

        )
    }
}