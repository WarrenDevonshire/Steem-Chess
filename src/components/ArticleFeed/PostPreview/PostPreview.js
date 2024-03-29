import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './PostPreview.css';
import noImage from './Images/no-image.png';

export default class PostPreview extends Component {

    constructor(props) {

        super(props);

        // parse and extract contents of post for preview
        const json = JSON.parse(this.props.post.json_metadata);

        this.state = {

            image: json.image ? json.image[0] : '',
            title: this.props.post.title,
            author: this.props.post.author,
            permlink: this.props.post.permlink,
            created: new Date(this.props.post.created).toDateString()

        };

    }

    render() {

        return (  
            
            <div className="PostPreview">
             <p>by {this.state.author}</p>
            <p class="list-group-item-text text-right text-nowrap">{this.state.created}</p>
            <Link to={`Post/@${this.state.author}/${this.state.permlink}`} class='articlelink'>        
                <center class="crop"> 
                    { this.state.image ? <img src={this.state.image} class="img-responsive center-block" alt=""/> : <img src={noImage} alt="No Image" /> }
                </center>
                <p className='link'>{this.state.title}</p>
            </Link>
            </div>
        )
    }
}