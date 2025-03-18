import Box from '@mui/material/Box';
import Wheel from './components/Wheel/Wheel';
import PlayerList from './components/Players/PlayerList';
import PlayersContextProvider from './store/players-context';
import { AuthProvider } from './store/auth-context'; 
import LoginForm from './components/Login/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <AuthProvider>
      <PlayersContextProvider>
        <Box width="100vw" display="flex" justifyContent="space-around">
          <Wheel />
          <PlayerList />
          <LoginForm />
        </Box>
        <ToastContainer />
      </PlayersContextProvider>
    </AuthProvider>
  );
}

export default App;
