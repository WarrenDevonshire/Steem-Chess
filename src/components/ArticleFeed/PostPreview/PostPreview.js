import React, {Component} from 'react';
import { Client, PrivateKey } from 'dsteem';
import { Link } from 'react-router-dom';

export default class PostPreview extends Component{

    constructor(props) {

        super(props);

        this.state = {

            json: JSON.parse(this.props.post.json_metadata),
            image: this.props.post.json.image ? this.props.post.json.image[0] : '',
            title: this.props.post.title,
            author: this.props.post.author,
            created: new Date(this.props.post.created).toDateString()

        };

        alert(this.state.title);

    }

    render(){

        return (  
            <div className="PostPreview">

                <Link to={`Post/${this.state.author}/${this.state.title}`}>{this.state.title}</Link>
                <p>by ${this.state.author}</p>
                <p class="list-group-item-text text-right text-nowrap">${this.state.created}</p>

            </div>
        )
    }
}