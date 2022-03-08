import React, { useState, createContext, useContext } from 'react';
import SearchBox from '../components/SearchBox';
import './App.css';
import Cities from '../components/Cities';
import { Button } from '../components/Button';
import Time from '../components/Time';



function App() {

  const [components, setComponents] = useState([]); 
  const LocationContext = createContext(); // react global context for retrieving selected locations (incomplete)
  
  function addComponent() { 
    
    setComponents([components]); 
    
  } 

  // suggestions() returning mapped location names for searchbox suggestions

  function suggestions() {

    const cities = Cities.map(function(item) {
      
      return item['city_ascii'] + ' | ' + item['admin_name'] + ' | ' + item['country'];

    }).toString().split(',');

    return cities;

  }

  // placeholder function for debugging

  function location() {

    return 'lat=40.772147000000004&lng=-74.02289375';

  }

    return (
      <div className="App">
      	<p className="title">WORLDTIME</p>
        <div className="search" id="searchId"><SearchBox items={ suggestions() }/></div>
        <div className="container" id="timeComponent"><Time loc={ location() }/></div>

      {/* adding new locations onclick (incomplete) */}
        <Button className="addCity" onClick={addComponent} text="ADD"/> 
        {components.map((item, i) => ( <div className="container" id="timeComponent">
          <LocationContext.Provider value={location}><Time loc= { location }/>
          </LocationContext.Provider></div> ))}
      </div>
    );
}

export default App;
