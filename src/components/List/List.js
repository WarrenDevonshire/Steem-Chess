import React from 'react';
import './List.css'

// Since we don't have props, we can directly return our JSX.
const List = () => (
    <div className="TeamList">
        <ol>
            <li>
                Warren Devonshire
            </li>
            <li>
                Daniel Haluszka  
            </li>
            <li>
                Troy Pastirko
            </li>
            <li>
                Michael Naples
            </li>
        </ol>
    </div>
);

export default List;