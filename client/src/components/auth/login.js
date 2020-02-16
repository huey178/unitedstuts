import React, { useState, Fragment } from "react";

const Login = () => {
  const [dataForm, setDataForm] = useState({
    email: "",
    password: ""
  });

  const { email, password } = dataForm;

  const onChange = (e) =>
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign into Your Account
        </p>
        <form className='form' action='dashboard.html'>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <a href='register.html'>Sign Up</a>
        </p>
      </section>
    </Fragment>
  );
};

export default Login;
