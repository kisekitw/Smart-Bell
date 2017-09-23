import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import ImagesUploader from 'react-images-uploader';
import * as actions from '../actions';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';

class AddVisitor extends Component {
    constructor(props) {
        super(props);
        this.makePhoto = this.makePhoto.bind(this);
        this.state = {
            classVisitorForm: "",
            classMakePhotoForm: "displayNone",
            addVisitorSucceed: 'false',
            photo_accept: ""
        };
    }

    handleHideOrShow(hideOrShow) {
        this.setState({
            classVisitorForm: "displayNone",
            addVisitorSucceed: hideOrShow,
            classMakePhotoForm: ""
        });
    }

    componentDidMount() {
        this.props.ws.onmessage = msg => {
            if (typeof msg.data === "string") {
                if (msg.data == 'success') {
                    this.setState({photo_accept: true});
                } else if (msg.data == 'fail') {
                    this.setState({photo_accept: false});
                }
            }
        };
    }

    componentWIllUpdate() {
        if (this.props.photoUpload == 'success') {
            this.props.ws.send("photo_upload");
        }
    }

    componentWillUnmount() {
        this.setState({photo_accept: ""});
    }

    handleFormSubmit(formProps) {
        this.props.addVisitor(formProps);
        this.handleHideOrShow('true')
    }

    makePhoto() {
        this.props.ws.send("photo_make");
    }

    handleFileUpload = e => {
        this.props.uploadDocument({
            file: e.target.files[0]
        });
    };

    render() {
        const { handleSubmit, fields: { firstname, lastname, email }} = this.props;
        
        return (
            <div>
                <form className={this.state.classVisitorForm + " fadeIn"} onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <fieldset className="form-group">
                        <label>First name:</label>
                        <input className="form-control" {...firstname} />
                        {firstname.touched && firstname.error && <div className="error">{firstname.error}</div>}
                    </fieldset>
                    <fieldset className="form-group">
                        <label>Last name:</label>
                        <input className="form-control" {...lastname} />
                        {lastname.touched && lastname.error && <div className="error">{lastname.error}</div>}
                    </fieldset>
                    <fieldset className="form-group">
                        <label>E-mail address:</label>
                        <input type="email" className="form-control" {...email} />
                        {email.touched && email.error && <div className="error">{email.error}</div>}
                    </fieldset>
                    
                    
                    <button action="submit" className="btn btn-primary">Add visitor</button>
                </form>

                <button onClick={this.makePhoto} className="btn btn-primary">Make photo</button>
                <input type="file" onChange={this.handleFileUpload} />
                <br />
                <div className={this.state.classMakePhotoForm + " fadeIn"}>
                    <p>Basic information is saved.</p>
                    <p>Please save your photo via either 'Make photo' or 'File upload'</p>
                    <button onClick={this.makePhoto} className="btn btn-primary">Make photo</button>
                    <br />
                    <form  method="post">
                        <fieldset className="form-group">
                            <label>Or Choose a photo from your PC:</label>
                            <input type="file" 
                                onChange={
                                    (e)=> {
                                        e.preventDefault();
                                        const files = [ ...e.target.files ];
                                        const filePath = 
                                        console.log(files);
                                    }
                                } 
                                className="form-control" />
                        </fieldset>
                        <button className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        );
    }
}

function validate(formProps) {
    const errors = {};

    if (!formProps.firstname) {
        errors.firstname = 'Please enter firstname';
    }

    if (!formProps.lastname) {
        errors.lastname = 'Please enter lastname';
    }
    if (!formProps.email) {
        errors.email = 'Please enter email';
    }
    return errors;
}


function mapStateToProps(state) {
    return { errorMessage: state.bell.error, ws: state.bell.socket, addFlag: state.bell.visitor_add,
                photoUpload: state.bell.photo};
}

export default reduxForm({
    form: 'add-visitor',
    fields: ['firstname', 'lastname', 'email'],
    validate
}, mapStateToProps, actions)(AddVisitor);
