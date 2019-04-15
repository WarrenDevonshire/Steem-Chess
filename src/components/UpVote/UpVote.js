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
        var pKey;

        // check if user is logged in before attempting to gen privateKey object
        if (localDB.account == null) {

            pKey = null;

        } else {

            pKey = PrivateKey.fromString(localDB.key);
            
        }

        this.state = {

            account: localDB.account,
            privateKey: pKey,
            author: this.props.author,
            permlink: this.props.permlink,
            weight: this.props.weight,
            weightId: "voteWeight" + this.props.id,
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

    expandDropdown() {

        this.setState( {expanded: true} );

    }

    closeDropdown() {

        this.setState( {expanded: false} );

    }


    render(){

        return (  
            <div className="upvote">

                <div id="upVote"><br /><input id="expandVote" type="button" value="Open voting UI" onClick={() => this.expandDropdown()} /></div>  
                { this.state.expanded ? <input id={this.state.weightId} defaultValue="10" /> : null } 
                { this.state.expanded ? <button id="pushVote" onClick={() => this.pushVote()}>Push vote</button> : null } 
                { this.state.expanded ? <button id="closeVote" onClick={this.closeDropdown}>Close voting UI</button> : null }                       
            
            </div>
        )
    }
}

