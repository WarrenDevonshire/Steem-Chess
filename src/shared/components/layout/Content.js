import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router-dom';
import Play from "../../../components/Play";
import Hot from "../../../components/Hot";
import New from "../../../components/New";
import Trending from '../../../components/Trending';

const Content = props => {

    const { children } = props;

    return (
        <main>
            <div>
            <Switch>
                <Route path="/Play" Component={Play}>Play</Route>
                <Route exact path="/" Component={Trending}>Trending</Route>
                <Route path="/New" Component={New}>New</Route>
                <Route path="/Hot" Component={Hot}>Hot</Route>
            </Switch>
            {children}
            </div>
        </main>
    );
};

Content.propTypes = {
    children: PropTypes.element.isRequired
};

export default Content;

