import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './PostPreview.css';

export default class PostPreview extends Component{

    constructor(props) {

        super(props);

        const json = JSON.parse(this.props.post.json_metadata);

        this.state = {

            image: json.image ? json.image[0] : '',
            title: this.props.post.title,
            author: this.props.post.author,
            permlink: this.props.post.permlink,
            created: new Date(this.props.post.created).toDateString()

        };

    }

    render(){

        return (  

            <div className="PostPreview">
                <center class="crop"><img src={this.state.image} class="img-responsive center-block" alt=""/></center>
                <Link to={`Post/@${this.state.author}/${this.state.permlink}`} className='link'>{this.state.title}</Link>
                <p>by {this.state.author}</p>
                <p class="list-group-item-text text-right text-nowrap">{this.state.created}</p>

            </div>
        )
    }
}