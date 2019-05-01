import React, {Component} from 'react';
import { loadState } from "../../components/localStorage";
import { Client } from 'dsteem';
import { get } from 'http';
import { PrivateKey } from 'dsteem';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Edit.css'

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

  function insertImage() {

    var range = this.quill.getSelection();
    var value = prompt('Enter image URL');
    if (value) { // avoid adding anything to body if user cancels prompt

        this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
        
    } 

}

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

            account: localDB.account,
            author: this.props.author, // author of post to be voted on
            privateKey: pKey,
            editor: false, // whether or not the quill editor is being used instead of markdown
            editorButtonValue: "Switch to editor",
            submitPostBtn: false,
            modules: {
                
                toolbar: {
                    
                    container: "#toolbar", // define custom toolbar as container for quill
                    handlers: {

                        image: insertImage // define image function for image button

                    }
                }
            }
        }; 
        this.pushEditedPost = this.pushEditedPost.bind(this);
    }

    
    showEditor (){

        if(document.getElementById('account').value === "author") {

            this.setState({editorButtonValue: true});
            return;
        } else {

            alert("Please Login to edit your post");
            this.setState({editorButtonValue: false});
        }
    }

    pushEditedPost (){

         // check that all fields are populated
         if (document.getElementById('title').value === "" || this.state.postBody === "" || document.getElementById('tags').value === "") {

            alert("Please fill out all fields.");
            return;

        }

        //get title
        const title = document.getElementById('title').value;
        //get tags and convert to array list
        const tags = document.getElementById('tags').value;
        const taglist = tags.split(' ');
        //check that chess is included in tags
        if (!taglist.includes("chess")) {

            alert("Tags must contain 'chess'");
            return;

        }
        //make simple json metadata including only tags
        const json_metadata = JSON.stringify({ tags: taglist });
        //generate random permanent link for post
        const permlink = Math.random()
            .toString(36)
            .substring(2);

        this.setState({ permlink: permlink });

        const payload = {
            author: this.state.account,
            body: this.state.postBody,
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0],
            permlink: permlink,
            title: title,
        };
        console.log('client.broadcast.comment:', payload);
        client.broadcast.comment(payload, this.state.privateKey).then(result => {
            alert("Success.");
            this.setState({ postSubmitted: true });
            document.getElementById("submitPostBtn").disabled = true;
        },
            function (error) {
                console.error(error);
                alert("An error occurred when broadcasting. See console for details.");
            }
        );

    
    }

    //patches edits to the old content
    //performEdit(text, out) {

        //if( this.state.postBody ||text === '')
        //return undefined;
        //list of patches to turn text to out 
        //const patch_make = dmp.patch_make(text, out); 
       //turns patch to text
        //const patch = dmp.patch_toText(patch_make);
        //return patch;
    //}

    handleClick() {

        this.setState({submitPostBtn: true});
    }

    openEditor() {

        if(this.state.editorButtonValue) {

                this.setState({editor: true});
        }
        this.setState({ submitPostBtn: true});
    }

    
    render() {

        return (
            
            <div class="container" id="content"><br />

            <input id="submitPostBtn" class="smallBtn" value="Submit post!" onClick={() => this.pushEditedPost()}  class="btn btn-primary" /><br />
            {this.state.postSubmitted ? <h1>View new post</h1>: null}

            <button onClick={() => this.openEditor()} {...() => this.handleClick()} id={"editing"} class='smallBtn'>Edit</button>            
            {this.state.editor ? <div className="text-editor">

            <h4>Submit a Edited post to the Steem blockchain</h4>
            Edited Title: <input id="title" class='input' type="text" size="65" class="form-control" /><br />

            <br />Tags: <input id="tags" class='input' type="text" size="65" class="form-control" defaultValue="chess" /><br />
            <em>Separate tags with spaces.</em><br /><br />

            <CustomToolbar />
            <ReactQuill modules={this.state.modules}/></div> : null}

            

            
      
        </div>
        
        )
    }

}


