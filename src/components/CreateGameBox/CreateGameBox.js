import React, {Component} from 'react';
import './CreateGameBox.css';

class CreateGameBox extends Component{
    constructor(props) {
        super(props);
        this.state = {
            timeControlOptions: ["Real Time", "Correspondence"],
            timeControlChosen: "Real Time",
            pieceChosen: "",
            startingColorText: "Starting Color",
            timePerSide: 5,
            increment: 5,

            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: ""
        };
    }

    pieceChanged(tag) {
        console.log(tag);
        this.setState({pieceChosen: tag});
        this.setState({startingColorText: "Starting Color: " + tag});
    }

    timePerSideChanged(value) {
        console.log(value);
        this.setState({timePerSide: value});
    }

    incrementChanged(value) {
        console.log(value);
        this.setState({increment: value});
    }

    timeControlChosen(value) {
        console.log(value);
        this.setState({timeControlChosen: value});
    }

    filterChanged(value) {
        console.log(value);
        this.setState({filterValue: value});
    }

    render() {
        return (
            <div className={CreateGameBox}>
                <Title title={'Create Game'}/>
            </div>
        );
    }
}
export default CreateGameBox;

function Title(props){
    return <h1>{props.title}</h1>
}
Title.defaultProps = {
    title: "Title"
};