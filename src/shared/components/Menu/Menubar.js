import React, {Component} from 'react';
import './Menubar.css';
import {Link} from 'react-router-dom';


class Menubar extends Component{
    render(){
        return (  
            
            
            <div className="Menu">
                <h1>Steem Chess</h1>
                <ul>
                    <li> <Link to="/Play">Play</Link></li>
                    <li> <Link to="/">Trending</Link></li>
                    <li> <Link to="/New">New</Link></li>
                    <li> <Link to="/Hot">Hot</Link></li>
                    <li> <Link to="/Compose">Compose</Link></li>        
                </ul>
            
                <form>
                    <input type="text" />
                    <button type="submit">Search</button>
                </form>
            </div>
            
        )
    }
}

export default Menubar;