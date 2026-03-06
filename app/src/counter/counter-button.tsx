import { useIncrementCounter } from "./incriment";
//import { usePrivy } from "@privy-io/react-auth";

export function CounterButton() {
  const { sendTransaction } = useIncrementCounter();
  //const { login, authenticated } = usePrivy();

  return (
    <button onClick={sendTransaction }>
      { 'Incriment'}
    </button>
  );
}