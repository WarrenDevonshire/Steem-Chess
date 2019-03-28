import React, {Component} from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import PostPreview from './PostPreview/PostPreview';
import { Link } from 'react-router-dom';

const client = new Client('https://api.steemit.com');

// TODO: figure out how to grab more articles for next page

export default class ArticleFeed extends Component {

    constructor(props) {

        super(props);
        
        this.state = {

            // this will store page number for browsing further articles in feed
            pageNumber: 0,
            posts: []

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

                this.setState( {posts: postList} );
                this.forceUpdate();
            
            })
    
            .catch(err => {
    
                alert('Error occured' + err);
    
            });

    }

    prevPage() {

        // go back to previous page of posts
        if (this.state.pageNumber > 0) {

            this.setState({ pageNumber: this.state.pageNumber - 1 });

        } else {

            alert("Already at first page!");

        }
        
    
    }

    nextPage() {

        // go to next page of posts
        this.setState({ pageNumber: this.state.pageNumber + 1 })
    
    }

    componentDidMount() {

        //set default page to 0 (1 for user)
        this.setState({ pageNumber: 0});

      }

    render() {

        return (  

            <div className="ArticleFeed">
                <Link to="/Compose"><button>Compose New Article</button></Link>
                <hr />
                <div class="list-group" id="postList">{this.state.posts.map(PostPreview => <div> {PostPreview} <hr /></div>)}</div>
                <button id="PrevPage" onClick={() => this.prevPage()}>Previous Page</button>
                {this.state.pageNumber}
                <button id="NextPage" onClick={() => this.nextPage()}>Next Page</button>
            </div>

        )
    }
}