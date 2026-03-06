import styles from "../styles";

interface LoginPageProps {
  login: () => void;
}

const LoginPage = ({ login }: LoginPageProps) => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>⬡ OCO Smart Escrow</h1>
        <p style={styles.subtitle}>Log In to OCO</p>
        <button style={styles.primaryBtn} onClick={login}>
          Login with Email
        </button>
      </div>
    </div>
  );
}

export default LoginPage;