import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const makeSignupRequest = async (e) => {
    e.preventDefault();
    let data;
    try {
      data = await fetch("http://localhost:7448/blog/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      data = await data.json();
      if (data.status) {
        setIsAuth(true);
        navigate("/login");
      } else {
        console.log("error due to unresponse");
      }
    } catch (err) {
      console.log("eror from err");
      console.log(err.message);
    }
  };
  return (
    <>
      <h1>Welcome to our Register For Account on website</h1>
      <form
        onSubmit={(e) => {
          makeSignupRequest(e);
        }}
      >
        <input
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          type="text"
          placeholder="Enter your username"
          required
        />
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          required
          placeholder="Enter your email"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="Enter your password"
        />
        <button type="submit">Signup</button>
      </form>
      <Link to={"/login"}>Go to Login</Link>
    </>
  );
};
