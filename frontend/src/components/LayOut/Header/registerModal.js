import React from "react"
import { Modal, Input, Button, notification } from "antd";
import "./Header.css"

class RegisterModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  }
  render() {
    return (
      <Modal
        title="Registration"
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={this.props.width || 520}
        centered
        destroyOnClose
        okText="Register"
        className="my-modal"
      >
        <form ref={el => this.myForm = el}>
          <p>Your login: </p> 
          <Input placeholder="Login" className="login" onChange={(data) => this.setState({ login: data.target.value })} />
          
          <p>Your email: </p> 
          <Input placeholder="Email" className="login" onChange={(data) => this.setState({ email: data.target.value })} />
          
          <p>Your password: </p> 
          <Input.Password placeholder="Password" className="damn" onChange={(data) => this.setState({ password: data.target.value })} />
          
          <p>Confirm password: </p> 
          <Input.Password placeholder="Confirm Password" className="damn" onChange={(data) => this.setState({ confirmPassword: data.target.value })} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div>
              <span>Already have an account? </span>
              <span 
                style={{ color: '#51CB63', cursor: 'pointer' }}
                onClick={this.props.onSwitchToLogin}
              >
                Sign In
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <Button onClick={() => {
                this.myForm.reset()
                this.props.onCancel()
              }} className="my-orange-button-outline">
                Cancel
              </Button>
              <Button type="primary" onClick={() => {
                this.handleRegister()
              }} className="my-orange-button-solid">
                Register
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    )
  }

  handleRegister = () => {
    const { login, email, password, confirmPassword } = this.state;
    
    if (login === "" || email === "" || password === "" || confirmPassword === "") {
      notification.warning({
        message: 'Incomplete data',
        description: 'Please fill in all fields',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    
    if (password !== confirmPassword) {
      notification.error({
        message: 'Passwords do not match',
        description: 'Please make sure passwords match',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    
    if (password.length < 6) {
      notification.warning({
        message: 'Weak password',
        description: 'Password must contain at least 6 characters',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    
    // Здесь будет API вызов для регистрации
    this.myForm.reset();
    this.setState({
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    
    notification.success({
      message: 'Registration successful!',
      description: 'Your account has been created. You can now log in to the system.',
      placement: 'bottomRight',
      duration: 3,
    });
    
    this.props.onCancel();
    setTimeout(() => {
      this.props.onSwitchToLogin();
    }, 500);
  }
}

export default RegisterModal
