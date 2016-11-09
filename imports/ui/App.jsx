import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import ReactDOM from 'react-dom';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

//App component - represents the whole application
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hideCompleted: false
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		//find the text field via React ref
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		//persist text
		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
		});

		//clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	//get tasks and render
	renderTasks() {
		let filteredTasks = this.props.tasks;

		if(this.state.hideCompleted) {
			filteredTasks = filteredTasks.filter(task => !task.checked);
		}

		return filteredTasks.map((task) => (
			<Task key={task._id} task={task} />
		));
	}

	toggleHideCompleted() {
		this.setState({
			hideCompleted: !this.state.hideCompleted,
		});
	}

	//render HTML on page
	render() {
		return (
			<div className="container">
				<header>
					<h1>Avrea Todo List ({this.props.incompleteCount})</h1>

					<label className="hide-completed">
						<input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
						Hide Completed Tasks
					</label>

					<AccountsUIWrapper />

					{this.props.currentUser ? 
					<form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" ref="textInput" placeholder="Type to add new tasks" />
					</form> : ''
					}
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
	incompleteCount: PropTypes.number.isRequired,
	currentUser: PropTypes.object
};

export default createContainer(() => {
	return {
		tasks: Tasks.find({}, {sort: { createdAt: -1}}).fetch(),
		incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
		currentUser: Meteor.user(),
	};
}, App);