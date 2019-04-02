import React, {Component} from 'react';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import { loadState } from '../localStorage';

const client = new Client('https://api.steemit.com');

let opts = {...NetConfig.net};

 export default class UpVote extends Component{

    constructor(props){

        super(props);

        const localDB = loadState();

        this.state = {

            username: 'nisarg258',
            PrivateKey: '5KdDmisvxHXhEQ5UbAdibZtx4LcoJ2dDA2jjz9XP1f4xn8PREhy',
            author: this.props.author,
            permlink: this.props.permlink,
            weight: this.props.weight

        };

        this.pushVote = this.pushVote.bind(this);

    }

    pushVote() {
    
        //creating a vote object
        const vote = {
            voter: 'nisarg258',
            author: this.props.author,
            permlink: this.props.permlink,
            weight: '10', //needs to be an integer for the vote function
        };

        client.broadcast.vote(vote, '5KdDmisvxHXhEQ5UbAdibZtx4LcoJ2dDA2jjz9XP1f4xn8PREhy').then(result => {

            console.log('Success! Vote Has Been Submitted:', result);
            result.dangerouslySetInnerHTML = 'Success! see console for full response.';

        },

            function (error) {

                console.log('error', error);

            })

        window.onload = () => {

            var upvoteweightslider = document.getElementById('voteWeight');
            var currentweightslider = document.getElementById('currentWeight');

            currentweightslider.dangerouslySetInnerHTML = upvoteweightslider.value;
            upvoteweightslider.oninput = function () {

                currentweightslider.dangerouslySetInnerHTML = this.value;
            };

        }
    }


    render(){

        return (  
            <div className="upvote">
                <div id="upVote"><br /><input id="pushVoteButton" type="button" value="Vote Here" onClick={() => this.pushVote()} /></div>  

                         
            </div>
        )
    }
}

