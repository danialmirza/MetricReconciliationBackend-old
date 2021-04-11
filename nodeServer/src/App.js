import React from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component {
	render() {
  	return (
    	<div>
        <Router>
        <Switch>
          <Route path="/query" component={QueryForm} />
          <Route path="/reporter" component={ReporterForm} />
          <Route path="/usertype" component={UserType} />
          <Route path="/" component={LoginForm} />
        </Switch>
        </Router>
    	</div>
    );
  }	
}

class LoginForm extends React.Component {
  state = { name: '', password: '', show_error: false};

  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await axios.post('http://localhost:5000/login', {
      name : this.state.name,
      password : this.state.password
    });
    this.setState({ name: '', password: '' });

    if (resp.data.auth) {
      this.setState({show_error: false})
      this.props.history.push(`/usertype`)
    }
    else {
      this.setState({show_error: true})
    }
  };

	render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
      <span className="formtext"><p style={{'fontWeight':'bold','fontSize':'3vw'}}>Sign In</p></span>
      NTID:&nbsp;
    	  <input 
          type="text" 
          value={this.state.name}
          onChange={event => this.setState({ name: event.target.value})}
          placeholder="NTID" 
          required 
        /> <br/>
        Password:&nbsp;
        <input 
          type="password" 
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value})}
          placeholder="Password" 
          required 
        /> <br/>
        <button>Login</button>
        {this.state.show_error ? <p>User not found!</p>:null}
    	</form>
    );
  }
}

class UserType extends React.Component {
  render() { 
    return(
      <div>
      <span className="headertext"><p style={{'fontWeight':'bold','fontSize':'3vw'}}>Select User Type</p></span>
      <button onClick={event => this.props.history.push('/reporter')}>Reporter</button> <br/>
      <button onClick={event => this.props.history.push('/query')}>Query</button>
      </div>
    );
  }
}

class ReporterForm extends React.Component {
  state = { reporter: '', 
            metricName: '',
            database: 'NDW',
            schema: '',
            table: '',
            metricId: '',
            metricCol: '',
            excl_bulk: false,
            excl_resi: true,
            excl_courtesy: false,
            ned: true,
            cen: true,
            wes: true,
            timeCol: '',
            timeDensity: 'D',
            startDate: '',
            endDate: ''
          };

  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await axios.put('http://localhost:5000/report', {
      reporter: this.state.reporter, 
      metricName: this.state.metricName,
      database: this.state.database,
      schema: this.state.schema,
      table: this.state.table,
      metricId: this.state.metricId,
      metricCol: this.state.metricCol,
      exclusions: {'excl_bulk': this.state.excl_bulk, 
                  'excl_resi': this.state.excl_resi, 
                  'excl_courtesy': this.state.excl_courtesy},
      geos: [this.state.ned, this.state.cen, this.state.wes],
      timeCol: this.state.timeCol,
      timeDensity: this.state.timeDensity,
      dateRange: {'start_date':this.state.startDate, 'end_date':this.state.endDate}
    });

    this.setState({ reporter: '', 
            metricName: '',
            database: 'NDW',
            schema: '',
            table: '',
            metricId: '',
            metricCol: '',
            excl_bulk: false,
            excl_resi: true,
            excl_courtesy: false,
            ned: true,
            cen: true,
            wes: true,
            timeCol: '',
            timeDensity: 'D',
            startDate: '',
            endDate: '' });
            
    this.props.history.push(`/usertype`)
  
  };
    
  render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
      <span className="formtext"><p style={{'fontWeight':'bold','fontSize':'3vw'}}>Add New Metric</p></span>
    	  Metric Name*:&nbsp;
        <input 
          type="text" 
          value={this.state.metricName}
          onChange={event => this.setState({ metricName: event.target.value})}
          placeholder="metric name" 
          required 
        /> <br/>
        Database*:&nbsp;
        <select 
          value={this.state.database}
          onChange={event => this.setState({ database: event.target.value})}>
            <option value="NDW">NDW</option>
            <option value="MELD">MELD</option>
          required 
        </select> <br/>
        Schema*:&nbsp;
        <input 
          type="text" 
          value={this.state.schema}
          onChange={event => this.setState({ schema: event.target.value})}
          placeholder="schema" 
          required 
        /> <br/>
        Table*:&nbsp;
        <input 
          type="text" 
          value={this.state.table}
          onChange={event => this.setState({ table: event.target.value})}
          placeholder="table" 
          required 
        /> <br/>
        Metric Id*:&nbsp;
        <input 
          type="text" 
          value={this.state.metricId}
          onChange={event => this.setState({ metricId: event.target.value})}
          placeholder="metric Id" 
          required 
        /> <br/>      
        Metric Column*:&nbsp;
        <input 
          type="text" 
          value={this.state.metricCol}
          onChange={event => this.setState({ metricCol: event.target.value})}
          placeholder="metric column" 
          required 
        /> <br/><br/>

        Exclude Bulk?*&nbsp;
        <input 
          type="radio" 
          value="Yes"
          checked={this.state.excl_bulk === true}
          onChange={event => this.setState({ excl_bulk: event.target.checked})}
          required 
        /> Yes 
        <input 
          type="radio" 
          value="No"
          checked={this.state.excl_bulk === false}
          onChange={event => this.setState({ excl_bulk: event.target.checked})}
          required 
        /> No <br/>

        Resi?*&nbsp;
        <input 
          type="radio" 
          value="Yes"
          checked={this.state.excl_resi === true}
          onChange={event => this.setState({ excl_resi: event.target.checked})}
          required 
        /> Yes 
        <input 
          type="radio" 
          value="No"
          checked={this.state.excl_resi === false}
          onChange={event => this.setState({ excl_resi: event.target.checked})}
          required 
        /> No <br/> 

        Exclude Courtesy?*&nbsp;
        <input 
          type="radio" 
          value="Yes"
          checked={this.state.excl_courtesy === true}
          onChange={event => this.setState({ excl_courtesy: event.target.checked})}
          required 
        /> Yes 
        <input 
          type="radio" 
          value="No"
          checked={this.state.excl_courtesy === false}
          onChange={event => this.setState({ excl_courtesy: event.target.checked})}
          required 
        /> No <br/><br/>

        Divisions*&nbsp;
        <input 
          type="radio" 
          value="NED"
          checked={this.state.ned === true}
          onChange={event => this.setState({ ned: event.target.checked})}
          required 
        /> NED 
        <input 
          type="radio" 
          value="CEN"
          checked={this.state.cen === false}
          onChange={event => this.setState({ cen: event.target.checked})}
          required 
        /> CEN
        <input 
          type="radio" 
          value="WES"
          checked={this.state.wes === false}
          onChange={event => this.setState({ wes: event.target.checked})}
          required 
        /> WES <br/><br/>

        Time Column*:&nbsp;
        <input 
          type="text" 
          value={this.state.timeCol}
          onChange={event => this.setState({ timeCol: event.target.value})}
          placeholder="time column" 
          required 
        /><br/>
        Time Granularity*:&nbsp;
        <select 
          value={this.state.timeDensity}
          onChange={event => this.setState({ timeDensity: event.target.value})}>
            <option value="D">Daily</option>
            <option value="W">Weekly</option>
            <option value="M">Monthly</option>
            <option value="Y">Yearly</option>
            <option value="DW">Day of Week</option>
          required 
        </select> <br/><br/>

        Start Date*:&nbsp;
        <DatePicker 
          selected={this.state.startDate}
          onChange={date => this.setState({ startDate: date})} /><br/>

        End Date*:&nbsp;
        <DatePicker 
          selected={this.state.endDate}
          onChange={date => this.setState({ endDate: date})} /><br/><br/>

        <button>Submit</button>
    	</form>
    );
  }
}

class QueryForm extends React.Component {
  state = { metricName: '',
            table: '',
            show_error: false
          };

  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await axios.post('http://localhost:5000/query', {
      metricName : this.state.metricName,
      table : this.state.table
    });

    this.setState({ metricName: '',
    table: '',
     show_error: false});

    if (resp.data.status) {
      this.setState({show_error: false})
      this.props.history.push(`/usertype`)
    }
    else {
      this.setState({show_error: true})
    }

    console.log(resp)
  
  };
    
  render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
      <span className="formtext"><p style={{'fontWeight':'bold','fontSize':'3vw'}}>Query Metrics</p></span>
    	  Metric Name*:&nbsp;
        <input 
          type="text" 
          value={this.state.metricName}
          onChange={event => this.setState({ metricName: event.target.value})}
          placeholder="metric name" 
          required 
        /> <br/>

        Table*:&nbsp;
        <input 
          type="text" 
          value={this.state.table}
          onChange={event => this.setState({ table: event.target.value})}
          placeholder="table" 
          required 
        /> <br/>
        <button>Query</button>
        {this.state.show_error ? <p>Metric not defined!</p>:null}
    	</form>
    );
  }
}

export default App;
