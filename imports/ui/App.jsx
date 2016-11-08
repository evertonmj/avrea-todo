import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import ReactDOM from 'react-dom';
import Task from './Task.jsx';

//App component - represents the whole application
class App extends Component {
	handleSubmit(event) {
		event.preventDefault();
		//find the text field via React ref
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		//persist text
		Tasks.insert({
			text,
			createdAt: new Date(),
		});

		//clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	//get tasks and render
	renderTasks() {
		return this.props.tasks.map((task) => (
			<Task key={task._id} task={task} />
		));
	}

	//render HTML on page
	render() {
		return (
			<div className="container">
				<header>
					<h1>Avrea Todo List</h1>

					<form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" ref="textInput" placeholder="Type to add new tasks" />
					</form>
				</header>

				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		);
	}
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,	
};

export default createContainer(() => {
	return {
		tasks: Tasks.find({}, {sort: { createdAt: -1}}).fetch(),
	};
}, App);