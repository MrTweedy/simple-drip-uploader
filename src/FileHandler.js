import React, {Component} from 'react'

class FileHandler extends Component{
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            apiKey: '',
            listId: '',
            minutes: '',
            emails: null,
            constantDelay: null,
            totalProcessed: 0,
            totalAdded: 0,
            totalUpdated: 0
        }
        this.fileInput = React.createRef();
        this.fileReader = new FileReader();
        this.fileReader.onload = (e) => {
            this.setState({ emails: e.target.result.split('\n').map(e => e.trim()) }, () => {setTimeout(this.send,1)});
        }
    }
    send = () => {
        if(!!this.state.apiKey && !!this.state.minutes && !!this.state.listId && !!this.state.emails){
            const constantDelay = this.state.minutes * 60000 / this.state.emails.length;
            this.setState({constantDelay}, () => {setTimeout(this.send2(0), 1)});
        } else {
            alert('Missing information. All fields are requied.');
        }        
    }
    send2 = (i) => {
        const specificDelay = i === 0 ? 0 : Math.round(this.state.constantDelay * Math.random() * 2);
        if(i < this.state.emails.length){
            console.log(`Trying ${this.state.emails[i]} in ${Math.round(specificDelay / 1000)} seconds.`);
            setTimeout(() => {this.send3(i, this.send2, this.send4, this.state)}, specificDelay);
        } else {
            alert('Finished!');
        }
    }
    send3 = (i, sendNext, retry, state) => {
        const poster = new XMLHttpRequest();
        poster.open('POST', 'http://portal.criticalimpact.com/api8/subscriber');
        poster.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        poster.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const response = JSON.parse(this.response);
                if(!!response.errorcode){
                    if(response.errorcode !== 2001 && response.data.data[0].dupe){
                        retry(state.emails[i], response.data.data[0].emailid, state);
                    } else {
                        console.log(`ERROR - ${state.emails[i]}: ${response.errormessage} (${state.totalProcessed++} of ${state.emails.length})`);
                    }
                } else {
                    console.log(`ADDED - ${state.emails[i]} (${state.totalProcessed++} of ${state.emails.length}, ${state.totalAdded++} New, ${state.totalUpdated} Duplicates)`);
                }
                sendNext(i + 1);
            }
        }
        poster.send(`apiKey=${this.state.apiKey}&email=${this.state.emails[i]}&listId=${this.state.listId}`);
    }
    send4 = (email, emailid, state) => {
        const poster = new XMLHttpRequest();
        poster.open('PUT', 'http://portal.criticalimpact.com/api8/subscriber');
        poster.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        poster.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const response = JSON.parse(this.response);
                if(!!response.errorcode){
                    console.log(`ERROR - ${email}: ${response.errormessage} (${state.totalProcessed++} of ${state.emails.length})`);
                } else {
                    console.log(`UPDATED - ${email} (${state.totalProcessed++} of ${state.emails.length}, ${state.totalAdded} New, ${state.totalUpdated++} Duplicates)`);
                }
            }
        }
        poster.send(`apiKey=${this.state.apiKey}&id=${emailid}&listId=${this.state.listId}`);
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.fileReader.readAsText(this.fileInput.current.files[0]);
    }
    handleInputChange = (event) => {
        let stateObject = {};
        let value = event.target.name === 'minutes' ? Number(event.target.value) : event.target.value
        stateObject[event.target.name] = value;
        this.setState(stateObject);
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <table><tbody>
                    <tr>
                        <td><label>Single-column CSV file with email addresses:</label></td>
                        <td><input name='emailsFile' type='file' ref={this.fileInput} /></td>
                    </tr>
                    <tr>
                        <td><label>API Key:</label></td>
                        <td><input name='apiKey' type='text' onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td><label>List ID:</label></td>
                        <td><input name='listId' type='text' onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td><label>Minutes over which to add addresses:</label></td>
                        <td><input name='minutes' type='number' onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                        <button type='submit'>Start</button>
                        </td>
                    </tr>
                </tbody></table>
            </form>
        )
    }
}

class FileHandlerPU extends Component{
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            apiKey: '********************',
            listId: '',
            minutes: '',
            emails: null,
            constantDelay: null,
            totalAdded: 0,
            totalDuplicates: 0
        }
        this.fileInput = React.createRef();
        this.fileReader = new FileReader();
        this.fileReader.onload = (e) => {
            this.setState({ emails: e.target.result.split('\n').map(e => e.trim()) }, () => {setTimeout(this.send,1)});
        }
    }
    send = () => {
        if(!!this.state.apiKey && !!this.state.minutes && !!this.state.listId && !!this.state.emails){
            const constantDelay = this.state.minutes * 60000 / this.state.emails.length;
            this.setState({constantDelay}, () => {setTimeout(this.send2(0), 1)});
        } else {
            alert('Missing information. All fields are requied.');
        }        
    }
    send2 = (i) => {
        const specificDelay = i === 0 ? 0 : Math.round(this.state.constantDelay * Math.random() * 2);
        if(i < this.state.emails.length){
            console.log(`Trying ${this.state.emails[i]} in ${Math.round(specificDelay / 1000)} seconds.`);
            const send2 = this.send2;
            const send3 = this.send3;
            const send4 = this.send4;
            const state = this.state;
            const poster = new XMLHttpRequest();
            poster.open('POST', 'https://api.postup.com/api/recipient')
            poster.setRequestHeader('Content-Type', 'application/json');
            poster.setRequestHeader('Authorization', `Basic ${state.apiKey}`)
            poster.onreadystatechange = function() {
                if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    const response = JSON.parse(this.response);
                    if(response.status === 'error'){
                        setTimeout(() => {send3(i, send4, send2, state)}, specificDelay);
                    } else {
                        const poster2 = new XMLHttpRequest();
                        poster2.open('GET', `https://api.postup.com/api/listsubscription/${state.listId}/${response.recipientId}`)
                        poster2.setRequestHeader('Content-Type', 'application/json');
                        poster2.setRequestHeader('Authorization', `Basic ${state.apiKey}`)
                        poster2.onreadystatechange = function() {
                            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                                const response2 = JSON.parse(this.response);
                                if(response2.status === 'error'){
                                    setTimeout(() => {send4(i, response.recipientId, send2, state)}, specificDelay);
                                } else {
                                    state.totalDuplicates++;
                                    i++;
                                    console.log(`${state.emails[i]} already exists. ${state.totalDuplicates} duplicates total.`);
                                    send2(i);
                                }
                            }
                        }
                        poster2.send();
                    }
                }
            }
            poster.send(`{"address":"${state.emails[i]}"}`);
        } else {
            alert('Finished!');
        }
    }
    send3 = (i, nextStep, nextEmail, state) => {
        console.log(`TRYING - ${state.emails[i]} (${i} of ${state.emails.length}`);
        const poster = new XMLHttpRequest();
        poster.open('POST', 'https://api.postup.com/api/recipient');
        poster.setRequestHeader('Content-Type', 'application/json');
        poster.setRequestHeader('Authorization', `Basic ${state.apiKey}`)
        poster.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const response = JSON.parse(this.response);
                if(!!response.recipientId){
                    nextStep(i, response.recipientId, nextEmail, state);
                } else {
                    console.log(`ERROR on user add - ${this.response}`);
                }
            }
        }
        poster.send(`{ "address":"${state.emails[i]}", "channel":"E" }`);
    }
    send4 = (i, recipientId, nextEmail, state) => {
        const poster = new XMLHttpRequest();
        poster.open('POST', 'https://api.postup.com/api/listsubscription');
        poster.setRequestHeader("Content-Type", "application/json");
        poster.setRequestHeader('Authorization', `Basic ${state.apiKey}` )
        poster.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                state.totalProcessed++
                const response = JSON.parse(this.response);
                if(response.status !== 'NORMAL'){
                    console.log(`ERROR on list subsciption - ${this.response})`);
                } else {
                    state.totalAdded++
                    console.log(`ADDED ${response.address}. ${i} of ${state.emails.length} processed; ${state.totalAdded} added, ${state.totalDuplicates} duplicates.`);
                }
                i++;
                nextEmail(i)
            }
        }
        poster.send(`{"recipientId":${recipientId}, "listId":${state.listId}, "status":"NORMAL"}`);
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.fileReader.readAsText(this.fileInput.current.files[0]);
    }
    handleInputChange = (event) => {
        let stateObject = {};
        let value = event.target.name === 'minutes' ? Number(event.target.value) : event.target.value
        stateObject[event.target.name] = value;
        this.setState(stateObject);
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <table><tbody>
                    <tr>
                        <td><label>Single-column CSV file with email addresses:</label></td>
                        <td><input name='emailsFile' type='file' ref={this.fileInput} /></td>
                    </tr>
                    <tr>
                        <td><label>List ID:</label></td>
                        <td><input name='listId' type='text' onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td><label>Minutes over which to add addresses:</label></td>
                        <td><input name='minutes' type='number' onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                        <button type='submit'>Start</button>
                        </td>
                    </tr>
                </tbody></table>
            </form>
        )
    }
}


export {FileHandler, FileHandlerPU};