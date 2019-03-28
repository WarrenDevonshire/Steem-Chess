import React, {Component} from 'react';
import './JoinGameBox.css';
import ComboBox from '../Combo Box/ComboBox'
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class JoinGameBox extends Component{
    constructor(props) {
        super(props);

        this.state = {
            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: ""
        };


        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.grabJoinData = this.grabJoinData.bind(this);
    }

    filterChanged(value) {
        console.log(value);
        this.setState({filterValue: value});
    }

    //TODO
    joinViewChanged(e) {
        console.log(e);
    }

    //TODO
    joinGame(e) {
        console.log(e);
    }

    //TODO
    grabJoinData(e){

    }

    render() {
        return(
            <div className={JoinGameBox} class='JoinGameBox'>
                <div className="horizontal">
                    <label class="filter">Filter</label>
                    <ComboBox class='ComboBox' options={this.state.filterOptions}
                              onSelectedChanged={this.filterChanged}/>
                    <ToggleSwitch checked={false}
                                  falseText="Grid"
                                  trueText="Card"
                                  offColor="#0000ff"
                                  onChange={this.joinViewChanged}/>
                </div>
                <hr noshade="true"/>
                <ReactTable
                    data={this.grabJoinData()}
                    columns={[{
                        Header: "Name",
                        accessor: 'name'
                    },
                        {
                            Header: "Type",
                            accessor: 'type'
                        },
                        {
                            Header: "Time",
                            accessor: 'time'
                        },
                        {
                            Header: "Posted",
                            accessor: 'posted'
                        }]}
                    showPagination={false}
                    className="table"
                    resizable={false}/>
                <hr noshade="true"/>
                <button onClick={e => this.joinGame(e)} class='Button'>Join</button>
            </div>
            );
    }
}

export default JoinGameBox;