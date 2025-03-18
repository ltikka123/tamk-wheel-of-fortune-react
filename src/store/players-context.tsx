import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Player } from "../models/player.model";
import { AuthContext } from "./auth-context";
import { toast } from "react-toastify";
import { fetchList, addToList, removeFromList } from "../api/lists";

type PlayersContextObj = {
  players: Player[];
  addPlayer: (player: Player) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
};

export const PlayersContext = createContext<PlayersContextObj>({
  players: [],
  addPlayer: async () => {},
  removePlayer: async () => {},
});

interface Props {
  children: React.ReactNode;
}

const PlayersContextProvider = ({ children }: Props) => {
  //change the number of players below to change the number of random generated players, do not go under 4, not working atm
  const [players, setPlayers] = useState<Player[]>([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isAuthenticated) {
      setPlayers([]); // if user is not logged in, clear players
      return;
    }

    fetchList("players")
      .then((data) => {
        if (!data.error) {
          setPlayers(transformPlayersData(data)); // transform objects from {id: num, data: string} to {id: num, name: string}
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch players.");
        console.error("Failed to fetch players:", error);
      });
  }, [authCtx.isAuthenticated]);

  const transformPlayersData = (
    data: { id: number; data: string }[]
  ): Player[] => {
    return data.map(
      ({ id, data }: { id: number; data: string }): Player => ({
        id: id.toString(),
        name: data,
      })
    );
  };

  const addPlayer = async (player: Player) => {
    addToList("players", player.name)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          setPlayers(transformPlayersData(data));
        }
      })
      .catch((error) => console.log("Failed to add player: " + error));
  };

  const removePlayer = async (id: string) => {
    removeFromList("players", id)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          setPlayers(transformPlayersData(data));
        }
      })
      .catch((error) => console.log("Failed to remove player: " + error));
  };

  const contextValue: PlayersContextObj = {
    players: players,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
  };

  return (
    <PlayersContext.Provider value={contextValue}>
      {children}
    </PlayersContext.Provider>
  );
};

export default PlayersContextProvider;
