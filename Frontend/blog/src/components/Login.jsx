// export const Login =() => {

//     return(
//         <>
//         <h1>Welcome to Login</h1>
//         <Link to={"/register"}>Signup page</Link>
//         </>
//     )
// }

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [username, setUserName] = useState(""s);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const makeSignInRequest = async (e) => {
    e.preventDefault();
    let data;
    try {
      data = await fetch("http://localhost:7448/blog/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
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
      <h1>Welcome to LoginPage</h1>
      <form
        onSubmit={(e) => {
          makeSignInRequest(e);
        }}
      >
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
        <button type="submit">SignIn</button>
      </form>
    </>
  );
};

//// import React, { useState } from "react";
/// import "./login.css";
// import axios from "axios";
// //import { useHistory } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

// export const Login = ({ setLoginUser }) => {
//   //const history = useHistory();
//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({
//       ...user,
//       [name]: value,
//     });
//   };

//   const login = () => {
//     axios.post("http://localhost:9002/login", user).then((res) => {
//       alert(res.data.message);
//       setLoginUser(res.data.user);
//       // history.push("/");
//       navigate("/");
//       <Link to={"/"}></Link>;
//     });
//   };

//   return (
//     <div className="login">
//       {console.log("User", user)}
//       <h1>Login</h1>
//       <input
//         type="text"
//         name="email"
//         value={user.email}
//         onChange={handleChange}
//         placeholder="Enter your Email"
//       ></input>
//       <input
//         type="password"
//         name="password"
//         value={user.password}
//         onChange={handleChange}
//         placeholder="Enter your Password"
//       ></input>
//       <div className="button" onClick={login}>
//         {" "}
//         Login
//       </div>
//       <div>or</div>

//       <div
//         className="button"
//         onClick={() => <Link to={"/register"}>Register</Link>}
//       >
//         Register{" "}
//       </div>
//     </div>
//   );
// };

// //export default Login;

// //
