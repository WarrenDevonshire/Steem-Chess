import React, {Component} from 'react';
import './ArticleFeed.css';
import { Client } from 'dsteem';
import Post from '../Post/Post';

const client = new Client('https://api.steemit.com');

export default class ArticleFeed extends Component {

    constructor(props) {

        super(props);
        
        this.state = {

            pageNumber: 0

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
    
                var posts = [];
    
                result.forEach(post => {
                    const json = JSON.parse(post.json_metadata);
                    const image = json.image ? json.image[0] : '';
                    const title = post.title;
                    const author = post.author;
                    const created = new Date(post.created).toDateString();
                    posts.push(
                        `<div class="list-group-item""><h4 class="list-group-item-heading" onClick="alert('test')" onmouseover="" style="cursor: pointer;">${title}</h4>
                        <p>by ${author}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center>
                        <p class="list-group-item-text text-right text-nowrap">${created}</p></div>`
                    );
                });
    
                document.getElementById('postList').innerHTML = posts.join('');
            
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
                <div class="list-group" id="postList"></div>
                {this.fetchBlog(this.props.limit, this.props.sortMethod)}
                <button id="PrevPage" onClick={() => this.prevPage()}>Previous Page</button>
                {this.state.pageNumber}
                <button id="NextPage" onClick={() => this.nextPage()}>Next Page</button>
            </div>

        )
    }
}