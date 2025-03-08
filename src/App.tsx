import { DroneFlightCalculator } from "./components/DroneFlightCalculator";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen break-words flex flex-col items-center justify-center bg-background px-4 md:px-8 pt-4 md:pt-8 pb-[calc(2rem+6vh)]">
      <div className="w-full max-w-7xl">
        <div className="w-full text-center mb-8">
          <h1 className="w-full text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            Drone Flight Calculator
          </h1>
          <p className="w-full text-lg md:text-xl text-muted-foreground mt-2">
            Calculate and compare flight times for different battery
            configurations
          </p>
        </div>
        <DroneFlightCalculator />
      </div>
    </div>
  );
}

export default App;
