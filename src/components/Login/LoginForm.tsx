import { Box, TextField, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../store/auth-context";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const authCtx = useContext(AuthContext);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameInput = e.target.value;
    setUsername(nameInput);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
  };

  const handleLogin = () => {
    // Try to login
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        authCtx.login(data.token);
      }) // If successful, save login data
      .catch((error) => toast.error("Failed to login"));
  };

  // TODO: check error handling
  const handleRegister = () => {
    // Try to register
    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(`Failed to register user '${username}'`);
        } else {
          // if registration was successful, create a players list for new user
          authCtx.login(data.token);
          fetch("http://localhost:3000/api/lists/players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + data.token, // user needs to be authenticated for this API call
            },
          });
        }
      })
      .catch((error) => toast.error("Failed to register"));
  };

  const handleLogout = () => {
    authCtx.logout();
  };
  return (
    <>
      {authCtx.isAuthenticated ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "white",
            mt: 1,
            height: 50,
          }}
        >
          <b>Logged in as:</b>
          <b>'{authCtx.username}'</b>
          <Button color="primary" onClick={handleLogout}>
            Log out
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "white",
            mt: 1,
            height: 260,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              fullWidth
              required
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default LoginForm;
