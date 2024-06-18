import React, { useState } from "react";
import { AuthApi } from "../../Apis/auth.api";
import AlertPopup from "../../components/base/AlertPopup";
import { AlertPopupModel } from "../../Model/alert";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export interface Props {
  onSetUser: any;
}

export default function LoginContainer({ onSetUser }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  const onLogin = async () => {
    setAlert(null);
    if(!email){
      setAlert({
        type: "warning",
        title: "Email is empty!",
      });
      return;
    } else if(!password){
      setAlert({
        type: "warning",
        title: "Password is empty!",
      });
      return;
    }
    await AuthApi.login(email, password)
      .then((data) => {
        onSetUser(data);
        navigate(`/`)
      })
      .catch((errorMessage) => {
        setAlert({
          type: "warning",
          title: errorMessage,
        });
      });
  };

  const onSignup = async () => {
    setAlert(null);
    let pattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!pattern.test(email)) {
      setAlert({
        type: "warning",
        title: "Email is incorrect!",
      });
      return;
    } else if (password.length < 6) {
      setAlert({
        type: "warning",
        title: "At least 6 characters!",
      });
      return;
    }
    
    await AuthApi.register(email, password)
      .then((data) => {
        setEmail("");
        setPassword("");
        setIsLogin(true);
      })
      .catch((errorMessage) => {
        setAlert({
          type: "warning",
          title: errorMessage,
        });
      });
  };

  return (
    <>
      <div className="auth-container">
        <div className="title">
          <FontAwesomeIcon className="shrimp_icon" icon={solid("shrimp")} />   
          <h4>SHRIMPLIFY</h4>
          <FontAwesomeIcon className="shrimp_icon" icon={solid("shrimp")} />   
        </div> 
        {isLogin ? (
          <div className="auth-wrap">
            
            <div className="header_title">
              <h4>Login</h4>
            </div>
            <div className="content">
              <input
                type="mail"
                placeholder="Email"
                value={email.toString()}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password.toString()}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="auth-btn" onClick={() => onLogin()}>
                Login
              </button>
              <button className="link-btn" onClick={() => setIsLogin(false)}>
                Create a new account
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-wrap">
            <div className="header_title">
              <h4>Signup</h4>
            </div>
            <div className="content">
              <input
                type="mail"
                placeholder="Example: a@gmail.com"
                value={email.toString()}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password.toString()}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => {
                  if (e.target.value !== password) {
                  }
                }}
              />
              <button className="auth-btn" onClick={() => onSignup()}>
                Signup
              </button>
              <button className="link-btn" onClick={() => setIsLogin(true)}>
                Already have account?
              </button>
            </div>
          </div>
        )}
      </div>
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}
