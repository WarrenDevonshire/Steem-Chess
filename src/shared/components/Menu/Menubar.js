import React, {Component} from 'react';
import './Menubar.css';

class Menubar extends Component{
    render(){
        return (  
            <div className="Menu">
                <h1 href="/Home">Steem Chess</h1>
                <ul>
                    <li href="/Play">Play</li>
                    <li href="/Trending">Trending</li>
                    <li href="/New">New</li>
                    <li href="/Hot">Hot</li>                    
                </ul>
            
                <form>
                    <input type="text" placeholder="Search"/>
                    <button type="submit"></button>
                </form>
            </div>
        )
    }
}

export default Menubar;