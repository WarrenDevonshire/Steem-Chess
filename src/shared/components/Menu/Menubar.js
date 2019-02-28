import React, {Component} from 'react';
import './Menubar.css';

class Menubar extends Component{
    render(){
        return (  
            <div className="Menu">
                <h1>Steem Chess</h1>
                <ul>
                    <li>Play</li>
                    <li>Trending</li>
                    <li>New</li>
                    <li>Hot</li>                    
                </ul>
                <form>
                    <input type="text" placeholder="Search"/>
                    <button type="submit"><i class='fa fa-search'></i></button>
                </form>
            </div>
        )
    }
}

export default Menubar;