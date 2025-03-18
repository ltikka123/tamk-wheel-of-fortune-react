import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import { FixedSizeList, ListChildComponentProps } from "react-window";

import { PlayersContext } from "../../store/players-context";
import { Player } from "../../models/player.model";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { AuthContext } from "../../store/auth-context";

const PlayerList = () => {
  const [newPlayerId, setNewPlayerId] = useState<string>("");
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [idError, setIdError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const playersCtx = useContext(PlayersContext);
  const authCtx = useContext(AuthContext);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idInput = e.target.value;

    if (idInput.trim() === "") {
      setIdError("ID is required");
    }

    if (idInput.trim().length > 0) {
      setIdError("");
    }
    // id must not over 7 letters
    if (idInput.trim().length > 7) {
      setIdError("ID must not exceed 7 letters");
    }

    setNewPlayerId(idInput);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameInput = e.target.value;

    if (nameInput.trim() === "") {
      setNameError("Name is required");
    }

    if (nameInput.trim().length > 0) {
      setNameError("");
    }

    setNewPlayerName(nameInput);
  };

  const handleAddPlayer = () => {
    if (idError !== "" || nameError !== "") return;

    // name needs to be provided and user authenticated
    if (
      newPlayerName === "" ||
      newPlayerName === null ||
      !authCtx.isAuthenticated
    ) {
      return;
    }

    if (playersCtx.players.some((player) => player.id === newPlayerId)) {
      setIdError("ID already exists");
      return;
    }

    const newPlayer: Player = {
      id: newPlayerId,
      name: newPlayerName,
    };
    playersCtx.addPlayer(newPlayer);
    setNewPlayerId(""); // Clear the ID field after adding a player
    setNewPlayerName(""); // Clear the Name field after adding a player
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  const renderRow = ({ index, style }: ListChildComponentProps) => (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText
          //primary={`${playersCtx.players[index].id} - ${playersCtx.players[index].name}`}
          primary={`${playersCtx.players[index].name}`}
        />
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => playersCtx.removePlayer(playersCtx.players[index].id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box sx={{ mt: 2, ml: 5 }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <TextField
          id="player-name-input"
          label="Name"
          variant="outlined"
          size="small"
          value={newPlayerName}
          sx={{ ml: 2 }}
          onChange={handleNameChange}
          onKeyDown={handleEnterKeyDown}
          error={nameError !== ""}
          helperText={nameError}
        />
        <Button
          variant="contained"
          onClick={handleAddPlayer}
          sx={{ ml: 2, height: 40 }}
        >
          Add
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: 400,
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={400}
          width={360}
          itemSize={46}
          itemCount={playersCtx.players.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Box>
  );
};

export default PlayerList;
