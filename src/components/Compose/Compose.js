import React, { Component } from 'react';
import './Compose.css';
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration';
import { loadState } from "../../components/localStorage";
import { Link } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

let opts = { ...NetConfig.net };

const client = new Client(NetConfig.url, opts);

// TODO: when switching from a header font to normal, clicking once switches the editor to normal
// but the selector still says header that was selected, have to click again to make the selector say 'normal'

// TODO: make header dropdown wider so text doesn't clip with arrows, CSS?

// define custom image button
const CustomImage = () => <span>IMG</span>;

// define custom toolbar using custom image button
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
            <button className="ql-image">
                <CustomImage />
            </button>
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

// implements embedding images with URL
function insertImage() {

    var range = this.quill.getSelection();
    var value = prompt('Enter image URL');
    if (value) { // avoid adding anything to body if user cancels prompt

        this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
        
    } 

}

export default class Compose extends Component {

    constructor(props) {

        super(props);

        // postSubmitted must be set to false before checking for redirect so that
        // render does not crash when trying to access it in the case of a user not being logged in
        this.state = {

            postSubmitted: false,
            postBody: ""

        };

        const localDB = loadState();

        // check if user is logged in, redirect if not
        if (localDB.account == null) {

            this.props.history.push('/Login');
            return;

        }

        // if user is logged in, gen privateKey obejct from stored posting key
        const pKey = PrivateKey.fromString(localDB.key);

        this.state = {

            account: localDB.account,
            privateKey: pKey,
            editor: false, // whether or not the quill editor is being used instead of markdown
            editorButtonValue: "Switch to editor",
            modules: {
                
                toolbar: {
                    
                    container: "#toolbar", // define custom toolbar as container for quill
                    handlers: {

                        image: insertImage // define image function for image button

                    }

                }

            }

        };

        this.pushPost = this.pushPost.bind(this);
        this.switchEditor = this.switchEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);;

    }

    pushPost() {

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

    switchEditor() {

        // switch editor based on which is currently being used
        // check for value that happens when text is deleted in editor and switched to markdown
        if (this.state.editor) {

            if (this.state.postBody === "<p><br></p>") {

                this.setState({ postBody: "" });

            }
            this.setState({ editor: false });
            this.setState({ editorButtonValue: "Switch to editor" });

        } else {

            this.setState({ editor: true });
            this.setState({ editorButtonValue: "Switch to markdown" });

        }

    }

    handleChange(value) {

        // update postBody based on which editor is being used
        if (this.state.editor) {

            this.setState({ postBody: value });

        } else {

            var newBody = document.getElementById('body').value;
            this.setState({ postBody: newBody });

        }

    }

    render() {

        return (

            <div class="container" id="content"><br />
                <h4>Submit a post to the Steem blockchain</h4>
                Title of post: <input id="title" class='input' type="text" size="65" class="form-control" /><br />
                <button id="switchEditorBtn" onClick={this.switchEditor}>{this.state.editorButtonValue}</button>                
                {this.state.editor ? <div className="text-editor"><CustomToolbar />
                    <ReactQuill modules={this.state.modules} placeholder={"Write your post here..."} defaultValue={this.state.postBody} onChange={this.handleChange} /></div>
                    : <textarea id="body" class="form-control" rows="3" onChange={this.handleChange} placeholder="Write your post here..." defaultValue={this.state.postBody} />}
                <br />Tags: <input id="tags" class='input' type="text" size="65" class="form-control" defaultValue="chess" /><br />
                <em>Separate tags with spaces.</em><br /><br />
                <input id="submitPostBtn" type="button" value="Submit post!" onClick={() => this.pushPost()} class="btn btn-primary" /><br />
                {this.state.postSubmitted ? <Link to={`Post/@${this.state.account}/${this.state.permlink}`}><h1>View new post</h1></Link> : null}
            </div>

        )

    }

}