import React from 'react';
import {Link} from 'react-router-dom';
const Home=()=>(
    <div style={{padding: '2rem',textAlign: 'center'}}>
         <h1>TUDU-Smart Task Tracker</h1>
        <p>Your personal productivity tracker buddy 🧠</p>
        <Link to="/login">
      <button>Get Started</button>
      </Link>
    </div>
)
export default Home;