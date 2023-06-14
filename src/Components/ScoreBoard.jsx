const ScoreBoard = ({ score }) => {
    return (
      <div className="score-board">
        <h2 style={{fontSize: '16px', fontWeight: '500'}}>Current Score: {score}</h2>
      </div>
    )
  }
  
  export default ScoreBoard