import React, { Component } from 'react';
import './searchbox.css';


class SearchBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestions: [],
			text: '',
		};
	}

	// dynamically matching searchbox values to suggestions

	onTextChanged = (e) => {
		const { items } = this.props;
		const value = e.target.value;
		let suggestions = [];
		if (value.length > 0) {
			const regex = new RegExp(`^${value}`, 'i');
			suggestions = items.sort().filter(v => regex.test(v));
		}
		this.setState(() => ({ suggestions, text: value }));
	}

	// letting user select suggestion to fill searchbox

	suggestionSelected (value) {
		this.setState(() => ({
			text: value,
			suggestions: [],
		}))
		const { text } = this.props;
		console.log(value);
	}

	// dynamically rendering suggestions

	renderSuggestions () {
		const { suggestions } = this.state;
		if (suggestions.length === 0) {
			return null;
		}
		return (
			<ul>
				{suggestions.map((item) => <li className="suggestionsBox" onClick={() => this.suggestionSelected(item)}>{item}</li>)}
			</ul>
		);
	}

	render() {
		const { text } = this.state;
		return (
			<div  className="text-input">
				<input value={text} onChange={this.onTextChanged} type="text" id="text1" placeholder="search city.." />
				{this.renderSuggestions()}
			</div>
			/*<div className="prime">
				<div className="wrapper">
					<input value={text} onChange={this.onTextChanged} className="form-control" id="text1" type="text" aria-label="Search"/>
					{this.renderSuggestions()}
					<button type="submit"><i className="fa fa-search"></i></button>
				</div>
			</div>*/


		);

	}
}

export default SearchBox;