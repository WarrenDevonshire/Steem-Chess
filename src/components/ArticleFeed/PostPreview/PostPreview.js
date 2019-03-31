import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class PostPreview extends Component {

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

    render() {

        return (

            <div className="PostPreview">

                <Link to={`Post/@${this.state.author}/${this.state.permlink}`}>{this.state.title}</Link>
                <center><img src={this.state.image} class="img-responsive center-block" alt=""/></center>
                <p>by {this.state.author}</p>
                <p class="list-group-item-text text-right text-nowrap">{this.state.created}</p>

            </div>
        )
    }
}