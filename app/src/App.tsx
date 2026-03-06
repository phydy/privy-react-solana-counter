import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CounterButton } from './counter/counter-button'
import { usePrivy } from '@privy-io/react-auth'
import LoginPage from './counter/login'
import { useWallets } from '@privy-io/react-auth/solana'
import LogOutButton from './counter/logout'

function App() {
  const {login, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    if (!authenticated) return;
  }, [authenticated, wallets]);

  if (!authenticated) {
    return <LoginPage login={login}/>
  }
  console.log("User: ", user?.wallet?.address);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
          <><LogOutButton /></>
          <><CounterButton /></>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
