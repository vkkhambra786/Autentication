import React, { useState } from "react";
import { Link } from "react-router-dom";
export const Forget = () => {
  let [nuller, ide, token] = window.location.pathname.split("/");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = async () => {
    console.log(password, confirmPassword);
  };
  return (
    <>
      {ide ? (
        token ? (
          <>
            <h1>Reset the password</h1>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="text"
              placeholder="Reset the password"
            />
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              type="text"
              placeholder="Confirm password"
            />
            <button onClick={updatePassword}>Reset</button>
          </>
        ) : (
          <h1>
            This is Our Main HomePage <Link to={"/"}>Go home</Link>
          </h1>
        )
      ) : (
        <h1>
          This is Our Main HomePage{""}
          <Link target="_blank" to={"/"}>
            Go home
          </Link>
        </h1>
      )}

      {
        <div>
          <Link to={"/login"}>Login c</Link>
          <Link to={"/register"}> Register</Link>
        </div>
      }
    </>
  );
};
