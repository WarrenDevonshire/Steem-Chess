import React, {Component} from 'react';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import { loadState } from '../localStorage';
import './UpVote.css'
import Slider from '../../shared/components/utils/Slider/Slider';

const client = new Client('https://api.steemit.com');

let opts = {...NetConfig.net};

 export default class UpVote extends Component{

    constructor(props){

        super(props);

        const localDB = loadState();
        
        this.state = {

            account: localDB.account, // user who is voting
            key: localDB.key,
            author: this.props.author, // author of post to be voted on
            permlink: this.props.permlink, // permlink of post to be voted on
            weight: 0, // weight of vote
            weightId: "voteWeight" + this.props.id, // unique id for each vote weight input
            voteButtonValue: "Open voting UI",
            expanded: false

        };

        this.pushVote = this.pushVote.bind(this);
        this.expandDropdown = this.expandDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.weightChanged = this.weightChanged.bind(this);

    }

    pushVote() {

        // check if user is logged in before attempting to post a comment
        if (this.state.account == null) {

            this.props.history.push('/Login');
            return;

        }

        var pKey;

        // if user is logged in, gen privateKey obejct from stored posting key
        try {

            pKey = PrivateKey.fromString(this.state.key);

        } catch (e) {

            console.error(e);

            // check for garbage login, redirect to login if privatekey can't be generated
            // this exception is thrown if password is invalid or is not a posting key, does not check for username/password association
            if (e.message === "private key network id mismatch") {

                alert("Bad password, please login again.");
                this.props.history.push('/Login');
                return;

            } else {

                // if any other exception is thrown, redirect to home
                alert("An error occurred when generating key. See console for details.");
                this.props.history.push('/');
                return;

            }

        } 

        // check for useless vote
        if (this.state.weight === 0) {

            alert("Please select a weight for your vote.");
            return;

        }
    
        // construct a vote object to broadcast
        const vote = {

            voter: this.state.account,
            author: this.state.author,
            permlink: this.state.permlink,
            weight: parseInt(this.state.weight)

        };

        // attempt to broadcast vote
        client.broadcast.vote(vote, pKey)
        .then(result => {

            console.log('Success! Vote Has Been Submitted:', result);
            alert("Success.");

        },
        function (error) {

            console.error(error);

                // check for bad username with valid password
                // TODO: can't redirect to login when in .then, need to pass instance of this in somehow
                if (error.message.includes("unknown key")) {

                    alert("Bad username, please login again.");
                    this.props.history.push('/Login');
                    return;
                    
                } else {

                    // all other exceptions
                    alert("An error occurred when broadcasting. See console for details.");

                }

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

        this.setState({ expanded: true });
        this.setState({ voteButtonValue: "Close voting UI" });

    }

    closeDropdown() {

        this.setState({ expanded: false });
        this.setState({ voteButtonValue: "Open voting UI" });

    }

    weightChanged(value) {

        this.setState({ weight: value });

    }


    render(){

        return (  
            <div className="upvote">

                <div id="upVote"><br />
                <button onClick={() => this.handleClick()} id="openVotes" class='smallBtn'>{this.state.voteButtonValue}</button>
                { this.state.expanded ? <Slider id={this.state.weightId} min='-10000' max='10000' step='100' onValueChanged={this.weightChanged} class='input'/> : null } 
                { this.state.expanded ? <button id="pushVoteBtn" class='smallBtn' onClick={() => this.pushVote()}>Push vote</button> : null } 
                </div>                    
            
            </div>
        )
    }
}

