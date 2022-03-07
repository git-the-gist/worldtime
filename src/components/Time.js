import React, { Component } from 'react';
import './clockbox.css';
import ReactCountryFlag from "react-country-flag"

var apikey = 'YFXODDQLW1F2';
 
class Time extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loc: '',
		}
	}

	componentDidMount() {
		const { loc } = this.props;

		var apicall = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + apikey + '&format=json&by=position&' + loc;
		fetch(apicall)
			.then(response => response.json())
			.then(data => { 
				this.setState({ data: data, }) 
				var setTime = this.state.data.formatted;
				var time = new Date(setTime);
				this.timerID = setInterval(setClock, 1000);
				
				const hourHand = document.querySelector('[data-hour-hand]');
				const minuteHand = document.querySelector('[data-minute-hand]');
				const secondHand = document.querySelector('[data-second-hand]');
				const digitalClock = document.querySelector('[data-digital-clock]');
                setTimeout(function () {
			        setInterval(function(){
				                    time.setSeconds(time.getSeconds()+1)
				                    digitalClock.textContent = time.toLocaleTimeString();
				                }, 1000)
			    }, 1000);

				var secondsRatio = time.getSeconds() / 60;
				var minutesRatio = (secondsRatio + time.getMinutes()) / 60;
				var hoursRatio = (minutesRatio + time.getHours()) / 12;

				var timeRatios = () => 
					{
						return secondsRatio += (6/360),
						minutesRatio += (0.1/360),
						hoursRatio += ((1/120)/360);
					}
				this.timerID = setInterval(timeRatios, 1000);

				function setClock() {
					setRotation(secondHand, secondsRatio);
					setRotation(minuteHand, minutesRatio);
					setRotation(hourHand, hoursRatio);
				}  

				function setRotation(element, rotationRatio) {
					element.style.setProperty('--rotation', rotationRatio * 360);
				}

				
				}
			)
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	

	render() {
		const { loc } = this.state;
	    var date = new Date(this.state.data.formatted)
	    var day = date.getDay();
		var location = String(this.state.data.zoneName);
		var n = location.lastIndexOf('/');
		var city = location.substring(n + 1).replace(/_/g, " ");
		var countryCode = this.state.data.countryCode;
		const days_dictionary = { 
			    'Mon': 1, 
			    'Tue': 2, 
			    'Wed': 3,
			    'Thu': 4,
			    'Fri': 5,
			    'Sat': 6,
			    'Sun': 0

		};

		var keys = Object.keys(days_dictionary);

		var weekDay = () => {
			for(var i = 0; i < keys.length;i++)
			{
			   if (day === days_dictionary[keys[i]]) {
			   	return String(keys[i]);
		   		}
			}
		}
		
		return (
			<div className="clock">
				<div className="hand hour" data-hour-hand></div>
				<div className="hand minute" data-minute-hand></div>
				<div className="hand second" data-second-hand></div>
				<div className="number number1">1</div>
				<div className="number number2">2</div>
				<div className="number number3">3</div>
				<div className="number number4">4</div>
				<div className="number number5">5</div>
				<div className="number number6">6</div>
				<div className="number number7">7</div>
				<div className="number number8">8</div>
				<div className="number number9">9</div>
				<div className="number number10">10</div>
				<div className="number number11">11</div>
				<div className="number number12">12</div>
				<div className="data-container">
			        <div className="flag"><ReactCountryFlag countryCode={ countryCode } svg /><br/></div>
					<div className="location"><p> { city }<br/></p></div>
					<div className="day"><p> { weekDay() }</p></div>
					<div className="time" data-digital-clock><p></p></div>
				</div>
			</div>

			);
	}

	
}

export default Time;