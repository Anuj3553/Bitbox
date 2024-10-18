import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Input, Button, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import "./css/Login.css";
import toast from "react-hot-toast";

const host = "http://localhost:5000";

const Login = ({ mode, showAlert }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        showAlert("Logged in Successfully", "success");
        toast.success("Login Successfully!");
        navigate("/");
      } else {
        showAlert("Invalid Credentials", "danger");
        toast.error("Login failed!");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again later.", "danger");
      console.error("Error during login:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${host}/api/auth/ResetByEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Reset email sent successfully!");
        setForgotPasswordModalVisible(false);
        setForgotEmail("");
      } else {
        showAlert(data.message || "Failed to send reset email", "danger");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      showAlert("An error occurred. Please try again later.", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="wrapper"
      style={{
        backgroundColor: mode === "dark" ? "black" : "white",
        color: mode === "dark" ? "white" : "black",
      }}
    >
      <form onSubmit={handleSubmit} className="form" style={{
        backgroundColor: mode === "dark" ? "black" : "white",
        color: mode === "dark" ? "white" : "black",
      }}>
        <h1 className="title">Login</h1>
        <span className="title-line"></span>
        <div className="inp">
          <Input
            prefix={<UserOutlined />}
            type="email"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            autoComplete="on"
            required
            style={{
              backgroundColor: mode === "dark" ? "black" : "white",
              color: mode === "dark" ? "white" : "black",
            }}
          />
        </div>

        <div className="inp">
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            autoComplete="on"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            style={{
              backgroundColor: mode === "dark" ? "black" : "white",
              color: mode === "dark" ? "white" : "black",
            }}
            required
          />
        </div>

        <Button className="submit" type="submit" disabled={loading}>
          {loading ? <Spin size="small" /> : "Login"}
        </Button>

        <p className="footer" style={{
        backgroundColor: mode === "dark" ? "black" : "white",
        color: mode === "dark" ? "white" : "black",
      }}>
          Don&apos;t have an account?
          <Link className="link" to="/Signup">
            {" "}
            Sign Up
          </Link>
        </p>

        <Button
          style={{ backgroundColor: "#6366f1", color: "#FFFFFF" }}
          onClick={() => setForgotPasswordModalVisible(true)}
          className="mt-3"
        >
          Forgot Password?
        </Button>
      </form>

      <div className="banner" >
        <h1 className="wel_text" style={{
        
        color: mode === "dark" ? "black" : "white",
      }}>
          WELCOME
          <br />
          BACK!
        </h1>
        <p className="para" style={{
        
        color: mode === "dark" ? "black" : "white",
      }}>
          Please Sign In here
          <br />
          with your real info
        </p>
      </div>

      <Modal
        title="Reset Password"
        visible={forgotPasswordModalVisible}
        onOk={handleForgotPassword}
        onCancel={() => setForgotPasswordModalVisible(false)}
        okText="Submit"
        okButtonProps={{
          style: { backgroundColor: "#6366f1", color: "#000" },
        }}
        cancelButtonProps={{
          style: { backgroundColor: "#000000" },
        }}
      >
        <div className="p-4">
          <p className="text-red-600 text-sm">
            Enter your email and we will send you a link to reset your password
          </p>
          <Input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

Login.propTypes = {
  showAlert: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default Login;
