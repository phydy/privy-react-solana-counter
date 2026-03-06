import { usePrivy } from "@privy-io/react-auth";

//interface LoginPageProps {
//  logout: () => void;
//}

const LogOutButton = () => {
    const {logout} = usePrivy();
  return (
    <button onClick={logout}>
      logout
    </button>
  );
}

export default LogOutButton;