import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "./App.css";

const cookies = new Cookies();

function App() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((err) => console.log(err));
  };

  const whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => console.log("You are logged in as: " + data.username))
      .catch((err) => console.log(err));
  };

  const isResponseOk = (response: any) => {
    if (response.status >= 200 && response.status <= 299)
      return response.json();
    else throw Error(response.statusText);
  };

  const login = (event: FormEvent) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUserName("");
        setPassword("");
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong username or password");
      });
  };

  const logout = () => {
    fetch("/api/logout/", {
      credentials: "same-origin",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
      })
      .catch((err) => console.log(err));
  };

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <p>You are logged in!</p>
          <button className="btn btn-primary me-2" onClick={whoami}>
            WhoAmI
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={username}
                onChange={handleUserNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <div>
                {error && <small className="text-danger">{error}</small>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
