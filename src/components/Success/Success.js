import React, {Component} from 'react';

class Success extends Component {

    constructor(props) {
        super(props);
        this.state = {
            api: this.props.api
        };
    }

    componentDidMount() {
        console.log(this.props.location.search); // "?filter=top&origin=im"
        let token = new URLSearchParams(this.props.location.search).get('access_token');
        console.log(`Token: ${JSON.stringify(token)}`);
        this.props.history.push('/');
    }

    render() {
        return (
            <div className={Success}>

            </div>
        )
    }
}

export default Success;