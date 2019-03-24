import React, {Component} from 'react';

class Success extends Component {
    componentDidMount() {
        console.log(this.props.location.search); // "?filter=top&origin=im"
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