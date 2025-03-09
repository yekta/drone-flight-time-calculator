import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simplified Battery interface without cell count
interface Battery {
  id: string;
  capacity: string; // mAh
  weight: string; // grams
  knownFlightTime?: string; // minutes
}

export function DroneFlightCalculator() {
  // Initialize state variables with updated default values
  const [droneWeight, setDroneWeight] = useState("430");
  const [mainBattery, setMainBattery] = useState<Battery>({
    id: "main",
    capacity: "1800",
    weight: "280",
    knownFlightTime: "6", // Updated default known flight time
  });

  // Update the default comparison battery values
  const [comparisonBatteries, setComparisonBatteries] = useState<Battery[]>([
    {
      id: "comp1",
      capacity: "1300",
      weight: "200",
    },
  ]);

  const addComparisonBattery = () => {
    const newBattery: Battery = {
      id: `comp${comparisonBatteries.length + 1}`,
      capacity: "1800",
      weight: "280",
    };
    setComparisonBatteries([...comparisonBatteries, newBattery]);
  };

  const removeComparisonBattery = (id: string) => {
    setComparisonBatteries(
      comparisonBatteries.filter((battery) => battery.id !== id)
    );
  };

  const updateComparisonBattery = (
    id: string,
    field: keyof Battery,
    value: string
  ) => {
    setComparisonBatteries(
      comparisonBatteries.map((battery) =>
        battery.id === id ? { ...battery, [field]: value } : battery
      )
    );
  };

  // Calculate flight time based on known flight time as baseline
  const calculateFlightTime = (
    battery: Battery,
    droneBaseWeight: number
  ): number => {
    // If this is the main battery with a known flight time, return that value
    if (battery.id === "main" && mainBattery.knownFlightTime) {
      return Number(mainBattery.knownFlightTime);
    }

    // For comparison batteries, calculate based on the main battery's known performance
    if (mainBattery.knownFlightTime) {
      // Calculate the ratio of capacity/weight compared to the main battery
      const mainBatteryCapacity = Number(mainBattery.capacity);
      const mainTotalWeight = droneBaseWeight + Number(mainBattery.weight);

      const comparisonCapacity = battery.capacity;
      const comparisonTotalWeight = droneBaseWeight + Number(battery.weight);

      // Calculate efficiency factor based on capacity and weight differences
      // More capacity = more flight time, more weight = less flight time
      const capacityRatio = Number(comparisonCapacity) / mainBatteryCapacity;
      const weightRatio = Number(mainTotalWeight) / comparisonTotalWeight;

      // Adjust the known flight time by the capacity and weight ratios
      // The weight impact is slightly reduced (0.8 power) to account for non-linear relationship
      return (
        Math.round(
          Number(mainBattery.knownFlightTime) *
            capacityRatio *
            Math.pow(weightRatio, 0.8) *
            10
        ) / 10
      );
    }

    // Fallback to a simple calculation if no known flight time
    return 0;
  };

  const mainFlightTime = Number(mainBattery.knownFlightTime) || 0;
  const totalWeight = Number(droneWeight) + Number(mainBattery.weight);

  return (
    <div className="w-full flex flex-col xl:flex-row justify-center items-center xl:items-start gap-2">
      <Card className="w-full max-w-2xl xl:max-w-sm">
        <CardHeader className="px-4 py-3.5 md:px-5 md:py-4">
          <CardTitle>Drone & Battery Specifications</CardTitle>
          <CardDescription>
            Enter your drone and current battery details.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-3.5 md:px-5 md:py-4 pt-2">
          <div className="grid gap-2 sm:grid-cols-2 text-left">
            <div className="w-full flex flex-col space-y-4">
              <div className="w-full flex flex-col space-y-2">
                <Label htmlFor="drone-weight">Drone Weight (g)</Label>
                <Input
                  inputMode="numeric"
                  id="drone-weight"
                  type="text"
                  value={droneWeight}
                  onChange={(e) => setDroneWeight(e.target.value)}
                />
              </div>

              <div className="w-full flex flex-col space-y-2">
                <Label htmlFor="battery-capacity">Battery Capacity (mAh)</Label>
                <Input
                  inputMode="numeric"
                  id="battery-capacity"
                  type="text"
                  value={mainBattery.capacity}
                  onChange={(e) =>
                    setMainBattery({
                      ...mainBattery,
                      capacity: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="w-full flex flex-col space-y-4">
              <div className="w-full flex flex-col space-y-2">
                <Label htmlFor="battery-weight">Battery Weight (g)</Label>
                <Input
                  inputMode="numeric"
                  id="battery-weight"
                  type="text"
                  value={mainBattery.weight}
                  onChange={(e) =>
                    setMainBattery({
                      ...mainBattery,
                      weight: e.target.value,
                    })
                  }
                />
              </div>

              <div className="w-full flex flex-col space-y-2">
                <Label htmlFor="known-flight-time">Known Flight Time (m)</Label>
                <Input
                  inputMode="numeric"
                  id="known-flight-time"
                  type="text"
                  value={mainBattery.knownFlightTime || ""}
                  onChange={(e) =>
                    setMainBattery({
                      ...mainBattery,
                      knownFlightTime: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Update the summary card with simplified text and layout */}
          <div className="px-4 py-3 bg-muted rounded-lg mt-6">
            <div>
              <h3 className="font-medium">Current Configuration</h3>
              <p className="text-2xl font-bold">{totalWeight}g</p>
            </div>
            <div className="mt-2 flex flex-wrap">
              <p>
                <span className="text-sm text-muted-foreground">
                  Capacity/Weight:{" "}
                </span>
                <span className="text-sm font-bold mr-4">
                  {(Number(mainBattery.capacity) / Number(totalWeight)).toFixed(
                    1
                  )}{" "}
                  mAh/g
                </span>
              </p>
              <p>
                <span className="text-sm text-muted-foreground">
                  Battery/Weight:{" "}
                </span>
                <span className="text-sm font-bold">
                  {Math.round(
                    (Number(mainBattery.weight) / Number(totalWeight)) * 100
                  )}
                  %
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader className="px-4 py-3.5 md:px-5 md:py-4">
          <CardTitle>Battery Comparison</CardTitle>
          <CardDescription>
            Compare different battery options to find the best balance.
          </CardDescription>
          <div className="w-full flex flex-row items-start justify-start pt-1">
            <Button
              className="w-full sm:max-w-36 gap-1 text-base"
              onClick={addComparisonBattery}
            >
              <Plus className="size-5 shrink-0 -ml-1.5" />
              Add Battery
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {/* Make the table responsive with horizontal scrolling on mobile */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Battery</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Capacity
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Weight</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Flight Time
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Total</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Cap/Weight
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium whitespace-nowrap">
                      Current
                    </TableCell>
                    <TableCell>{mainBattery.capacity}</TableCell>
                    <TableCell>{mainBattery.weight}g</TableCell>
                    <TableCell className="font-bold whitespace-nowrap">
                      {mainFlightTime} min
                    </TableCell>
                    <TableCell>{totalWeight}g</TableCell>
                    <TableCell>
                      {(
                        Number(mainBattery.capacity) / Number(totalWeight)
                      ).toFixed(1)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {comparisonBatteries.map((battery) => {
                    const flightTime = calculateFlightTime(
                      battery,
                      Number(droneWeight)
                    );
                    const batteryTotalWeight =
                      Number(droneWeight) + Number(battery.weight);
                    const capacityToWeight = (
                      Number(battery.capacity) / batteryTotalWeight
                    ).toFixed(1);

                    return (
                      <TableRow key={battery.id}>
                        <TableCell className="w-1/6 min-w-20 font-medium whitespace-nowrap">
                          Option {battery.id.replace("comp", "")}
                        </TableCell>
                        <TableCell className="w-1/6 min-w-20">
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={battery.capacity ?? ""}
                            onChange={(e) =>
                              updateComparisonBattery(
                                battery.id,
                                "capacity",
                                e.target.value
                              )
                            }
                            className="w-full h-8 text-base"
                          />
                        </TableCell>
                        <TableCell className="w-1/6 min-w-20">
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={battery.weight}
                            onChange={(e) =>
                              updateComparisonBattery(
                                battery.id,
                                "weight",
                                e.target.value
                              )
                            }
                            className="w-full h-8 text-base"
                          />
                        </TableCell>
                        <TableCell
                          className={`${
                            flightTime > Number(mainFlightTime)
                              ? "font-bold text-green-600 whitespace-nowrap"
                              : flightTime < Number(mainFlightTime)
                              ? "font-bold text-red-600 whitespace-nowrap"
                              : "font-bold whitespace-nowrap"
                          } w-1/6 min-w-20`}
                        >
                          {flightTime} min
                        </TableCell>
                        <TableCell className="w-1/6 min-w-20">
                          {batteryTotalWeight}g
                        </TableCell>
                        <TableCell className="w-1/6 min-w-20">
                          {capacityToWeight}
                        </TableCell>
                        <TableCell className="w-1/6 min-w-20">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeComparisonBattery(battery.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-full px-4 py-3 pb-5 sm:p-0 text-left flex flex-col mt-3">
            <h3 className="w-full font-medium mb-2">
              How the Comparison Works
            </h3>
            <p className="w-full text-sm text-muted-foreground">
              The calculator uses your current battery and known flight time as
              a baseline, then estimates how other batteries would perform by
              comparing:
            </p>
            <ul className="w-full text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
              <li>Capacity ratio (more mAh = more flight time)</li>
              <li>Weight impact (heavier = less flight time)</li>
              <li>Capacity-to-weight ratio as an efficiency metric</li>
            </ul>
            <p className="w-full text-sm text-muted-foreground mt-2">
              Green flight times indicate an improvement over your current
              battery, while red indicates reduced flight time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
