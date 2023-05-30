import React from "react";
import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { isEmail } from "validator";


function ResetPassword() {
    const [email, setEmail] = React.useState('')
    const [successful, setSuccessful] = React.useState(false);

    const onChangeInput = (e) => {
        setEmail({ ...email, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Gọi phương thức submit form
            handleSubmit(event);
        }
    };
    const validEmail = (value) => {
        if (!isEmail(value)) {
            return (
                <div className="alert alert-danger" role="alert">
                    This is not a valid email.
                </div>
            );
        }
    };
    return (
        <div className="d-flex justify-content-center bor ">
            <div className="form-group" >
                <h1>Reset your password</h1>
                <div>
                    <p className="pl-3 m-0">Enter your e-mail and we'll send you instruction </p>
                    <p className="pl-3 m-0"> on how to reset your password.</p>
                </div>
                <TextField onSubmit={handleSubmit}
                    style={{
                        width: 370
                    }}
                    placeholder="Email Address"
                    onChange={e => {
                        onChangeInput(e)
                    }}
                    onKeyDown={handleKeyDown}
                    name="email"
                    validations={[validEmail]}

                // value={}
                />
                <div>
                    <Button type="submit" onClick={handleSubmit} className="btn btn-primary btn-block mt-3 mb-2">Send instruction</Button>
                </div>
                <p>Go back <a href="/login">login page.</a></p>
            </div>
        </div>
    );
}

export default ResetPassword;