import React, {Component} from 'react';
import './Table.css'

//Options should be passed in with the form:
//[[id, [data]]],[id, [data]],[id, [data]]]
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            rowSelected: 0
        }
    }

    rowClicked(e) {
        console.log(e.target.value);
        this.setState({rowSelected:e.target.value});
        this.props.onSelectedRowChanged(e.target.value);
    };

    render() {
        var rows = this.props.rows.map(([index, text]) =>
            <option key={index}
                id={index}
                className="row"
                value={text}>{text}</option>
            )
        return (
            <table className="table"
                onChange={e => this.optionClicked(e)}>
                {rows}
            </table>
        );
    }
}

export default Table;