import Timer from '../Timer/Timer';
import GameInfo from '../GameInfo/GameInfo';
import Board from '../Board/Board';

export default class LiveMatch extends Component {

        render(){

            return (

                <div id="liveMatch">
                
                    <Timer />
                    <GameInfo />
                    <Board />
                
                </div>

            )

        }

}