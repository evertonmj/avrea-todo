import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';

//App component - represents the whole application
class App extends Component {
	/*getTasks() {
		return [
			{_id: 1, text: 'This is task 1'},
			{_id: 2, text: 'This is task 2'},
			{_id: 3, text: 'This is task 3'},
		];
	}*/

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
		tasks: Tasks.find({}).fetch(),
	};
}, App);