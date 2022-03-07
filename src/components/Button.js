import React from 'react'; 

const Button = (props) => { 
  
  return ( 
    
    <button className="addCity" onClick={props.onClick}>{props.text}</button> 
    
  ); 
  
} 

export {Button};