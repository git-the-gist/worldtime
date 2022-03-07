import React, { Component } from 'react';
import SearchBox from '../components/SearchBox';
import './App.css';
import Cities from '../components/Cities';
import { useState } from 'react'; 
import { Button } from '../components/Button';
import Time from '../components/Time';



function App() {

  const [components, setComponents] = useState([]); 
  
  function addComponent() { 
    
    setComponents([components]); 
    
  } 

  function suggestions() {
    return Cities.map(function(item) {

      var latLng = `lat=${item['lat']}&lng=${item['lng']}`;
      
      return item['city_ascii'] + ' | ' + item['admin_name'] + ' | ' + item['country'];

    }).toString().split(',');

  }

  // function searchedLocation() {
  //   console.log(latLng);
  //   return latLng;
  // }

  function location() {
    // var userLocation;
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   userLocation = `lat=${position.coords.latitude}&lng=${position.coords.longitude}`;
    //   console.log(userLocation);
    //   return userLocation;
    // }); 
    return 'lat=40.772147000000004&lng=-74.02289375';
  }

    return (
      <div className="App">
      	<p className="title">WORLDTIME</p>
        <div className="search" id="searchId"><SearchBox items={ suggestions() }/></div>
        <div className="container" id="timeComponent"><Time loc={ location() }/></div>
        <Button className="addCity" onClick={addComponent} text="ADD"/> 
        {components.map((item, i) => ( <div className="container" id="timeComponent"><Time loc={ location() }/></div> ))}
      </div>
    );
}

export default App;
