import React, {useEffect, useState} from "react";
import './App.css';

function App() {
    const [schedule, setSchedule] = useState<string[][]>([[]]);

  useEffect(() => {
    const fetchSchedule = () => {
      fetch('http://localhost:5000/getSchedule')
          .then(res => res.json())
          .then(res => {
              setSchedule(res);
          })
    }

    fetchSchedule()
  });

  return (
    <div className="App">
      <header className="App-header">
          {schedule?.length ? schedule?.map(column => column.map((str, index) => (
              <p style={{marginTop: index % 5 === 0 ? 50 : 5}}>{str}</p>
          ))) : <h2>Подождите немного...</h2>}
      </header>
    </div>
  );
}

export default App;
