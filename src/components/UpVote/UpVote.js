import React, {Component} from 'react';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import { loadState } from '../localStorage';
import './UpVote.css'

const client = new Client('https://api.steemit.com');

let opts = {...NetConfig.net};

 export default class UpVote extends Component{

    constructor(props){

        super(props);

        const localDB = loadState();
        var pKey;

        // check if user is logged in before attempting to gen privateKey object
        if (localDB.account == null) {

            pKey = null;

        } else {

            pKey = PrivateKey.fromString(localDB.key);
            
        }

        this.state = {

            account: localDB.account, // user who is voting
            privateKey: pKey,
            author: this.props.author, // author of post to be voted on
            permlink: this.props.permlink, // permlink of post to be voted on
            weight: this.props.weight, // weight of vote
            weightId: "voteWeight" + this.props.id, // unique id for each vote weight input
            voteButtonValue: "Open voting UI",
            expanded: false

        };

        this.pushVote = this.pushVote.bind(this);
        this.expandDropdown = this.expandDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);

    }

    pushVote() {

        // check if user is logged in before attempting to post a comment
        if (this.state.account == null) {

            this.props.history.push('/Login');
            return;

        }
    
        //creating a vote object
        const vote = {

            voter: this.state.account,
            author: this.state.author,
            permlink: this.state.permlink,
            weight: parseInt(document.getElementById(this.state.weightId).value) //needs to be an integer for the vote function

        };

        client.broadcast.vote(vote, this.state.privateKey)
        .then(result => {

            console.log('Success! Vote Has Been Submitted:', result);
            alert("Success.");

        },
        function (error) {

            console.error(error);
            alert("An error occurred when broadcasting. See console for details.");

        })

    }

    handleClick() {

        if(this.state.expanded == false) {

            this.expandDropdown();

        } else {

            this.closeDropdown();

        }

    }

    expandDropdown() {

        this.setState( {expanded: true} );
        this.setState( {voteButtonValue: "Close voting UI"} );

    }

    closeDropdown() {

        this.setState( {expanded: false} );
        this.setState( {voteButtonValue: "Open voting UI"} );

    }


    render(){

        return (  
            <div className="upvote">

                <div id="upVote"><br />
                <button onClick={() => this.handleClick()} id={"openVotes"} class='smallBtn'>{this.state.voteButtonValue}</button>
                { this.state.expanded ? <input id={this.state.weightId} defaultValue="10" class='input'/> : null } 
                { this.state.expanded ? <button id="pushVote" class='smallBtn' onClick={() => this.pushVote()}>Push vote</button> : null } 
                </div>                    
            
            </div>
        )
    }
}

