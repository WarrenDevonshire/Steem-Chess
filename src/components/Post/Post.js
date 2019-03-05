import React, {Component} from 'react';
import './Post.css';
import { Client } from 'dsteem';

const client = new Client('https://api.steemit.com');
const Remarkable = require('remarkable');

//this will just fetch an article to display until this component gets hooked up to the article feed component
function openPost() {
    
    const query = {
        tag: 'chess',
        limit: 1,
    };
    
    client.database
        .getDiscussions('trending', query)
        .then(result => {
            client.database.call('get_content', [result[0].author, result[0].permlink]).then(result => {
                const md = new Remarkable({ html: true, linkify: true });
                const body = md.render(result.body);
                const content = `<div class='pull-right'></div><br><h2>${
                    result.title
                }</h2><br>${body}<br>`;
        
                document.getElementById('postBody').style.display = 'block';
                document.getElementById('postBody').innerHTML = content;
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
                {openPost()}
            </div>
        )
    }
}