import { Toaster } from "sonner";
import Game from "./components/connect4/Game";

function App() {
  return (
    <div className="w-full h-full min-h-screen bg-background text-foreground">
      <Game />
      <Toaster position="bottom-center" richColors />
    </div>
  )
}

export default App
