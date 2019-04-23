import React, {Component} from 'react';
import { loadState } from "../../components/localStorage";
import { Client } from 'dsteem';
import { get } from 'http';
import { PrivateKey } from 'dsteem';

const diff_match_patch = require('diff-match-patch');
const dmp = new diff_match_patch();
const client = new Client('https://api.steemit.com');
let o_body = '';
let o_permlink = '';

const CustomToolbar = () => (

    <div id="toolbar">
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="bullet" />
            <button className="ql-list" value="ordered" />
            <button className="ql-blockquote" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
        </span>
        <span className="ql-formats">
            <span className="ql-header">
                <span className="ql-picker-label" />
                <span className="ql-picker-options" />
                <select className="ql-header">
                    <option false />
                    <option value="3" />
                    <option value="2" />
                    <option value="1" />
                </select>
            </span>
        </span>
    </div>

  );

export default class Edit extends Component {
    constructor(props) {
        super(props);
       
        const localDB = loadState();

        // check if user is logged in, redirect if not
        if (localDB.account == null) {

            this.props.history.push('/Login');
            return;

        }

        const pKey = PrivateKey.fromString(localDB.key);

        this.state = {

            // this will store page number for browsing further articles in feed
            pageNumber: 0,
            posts: [],
            editorButtonValue: "Edit",
            postBody: ""

        };

        this.findPost(this.props.limit, this.props.sortMethod);        
    }


    async findPost() {
        const query = {
            tag: 'chess',
            tag: document.getElementById('username').value,
            limit: this.props.limit,
   };

    client.database
        .getDiscussions(this.props.sortMethod, query)
        .then(result => {
        
            document.getElementById('title').value = result[0].title;
            document.getElementById('body').value = result[0].body;
            document.getElementById('tags').value = JSON.parse(
            result[0].json_metadata
            ).tags.join(' ');
            o_body = result[0].body;
            o_permlink = result[0].permlink;
           
        })

        .catch(err => {

            alert('Error occured, please reload the page' + err);
        });
    }

    prevPage() {

        if (this.state.pageNumber > 0) {
            this.setState({pageNumber: this.state.pageNumber - 1});
        } else {
            alert("Already at first page!");
        }
    }

    nextPage() {
        this.setState({pageNumber: this.state.pageNumber + 1})
    }

    componentDidMount() {
        this.setState({pageNumber: 0});
    }

    //patches edits to the old content
    performEdit(text, out) {

        if( this.state.postBody ||text === '')
        return undefined;
        //list of patches to turn text to out 
        const patch_make = dmp.patch_make(text, out); 
        //turns patch to text
        const patch = dmp.patch_toText(patch_make);
        return patch;
    }


    render() {

        return (
            
                <div className="PerformEditing">
                
                <button onClick={() => this.performEdit()} id={"editing"} class='smallBtn'>{this.editorButtonValue}</button>
                <button id="PrevPage" onClick={() => this.prevPage()}>Previous Page</button>
                {this.state.pageNumber}
                <button id="NextPage" onClick={() => this.nextPage()}>Next Page</button>
            </div>

        )
    }

}