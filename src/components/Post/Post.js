import React, {Component} from 'react';
import './Post.css';
import { Client } from 'dsteem';

const client = new Client('https://api.steemit.com');
const Remarkable = require('remarkable');

// this will just fetch an article to display until this component gets hooked up to the article feed component
function openPost() {
    
    const query = {
        tag: 'chess',
        limit: 1,
    };
    
    client.database
        .getDiscussions('trending', query) // fetch most recent post and store author/permlink
        .then(result => {

            const postAuthor = result[0].author;
            const postPerm = result[0].permlink;

            // fetch post content
            client.database.call('get_content', [postAuthor, postPerm]).then(result => {

                const md = new Remarkable({ html: true, linkify: true });
                const body = md.render(result.body);
                const content = `<div class='pull-right'></div><br><h2>${
                    result.title
                }</h2><br>${body}<br>`;
        
                document.getElementById('postBody').style.display = 'block';
                document.getElementById('postBody').innerHTML = content;

                // fetch post comments
            client.database
            .call('get_content_replies', [postAuthor, postPerm])
            .then(result => {

                const comments = [];
                for (var i = 0; i < result.length; i++) {
                    comments.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                    <div class="d-flex w-100 justify-content-between">\
                      <h5 class="mb-1">@${result[i].author}</h5>\
                      <small class="text-muted">${new Date(
                          result[i].created
                      ).toString()}</small>\
                    </div>\
                    <p class="mb-1">${md.render(result[i].body)}</p>\
                    <small class="text-muted">&#9650; ${
                        result[i].net_votes
                    }</small>\
                  </div>`
                    );
                }

                document.getElementById('postComments').style.display = 'block';
                document.getElementById(
                    'postComments'
                ).innerHTML = comments.join('');

            });
            });
        })


        .catch(err => {

            console.log(err);
            alert('Error occured, please reload the page');

        });
}

export default class Post extends Component{

    render(){

        return (  
            <div className="Post">
                <div id="postBody" styles="display: none;"></div>	
                <h1>Comments</h1>
                <div id="postComments" styles="display: none;" class="list-group"></div>
                {openPost()}
            </div>
            
        )
    }
}