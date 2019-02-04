import React, {Component} from 'react';
import './Home.css'

class Home extends Component{
    render(){
        const buttonStyle = {
            backgroundColor: 'gray',
            border: '1px solid black'
        };
        return (
            <div className="Home">
                <h1>Welcome to Steem-Chess</h1>

                <p>
                    Paragraph Example
                </p>
                <p>
                    <button style={buttonStyle}>Click me!</button>
                </p>
            </div>
        );
    }
}

export default Home;