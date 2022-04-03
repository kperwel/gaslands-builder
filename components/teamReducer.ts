import React from "react";
import createRandomCar from "./randomizers/vehicle";
import { ActiveVehicle } from "./rules/vehicles";
import { Team } from "./team";

interface AddVehicleAction {
  type: "addVehicle";
  vehicle: ActiveVehicle;
}

interface AddRandomVehicleAction {
  type: "addRandomVehicle";
  value: number;
}

interface RemoveVehicleAction {
  type: "removeVehicle";
  index: number;
}

interface UpdateVehicleAction {
  type: "updateVehicle";
  index: number;
  vehicle: ActiveVehicle;
}

interface UpdateTeamNameAction {
  type: "updateTeamName";
  name: string;
}

interface UpdateVehicleNameAction {
  type: "updateVehicleName";
  index: number;
  name: string;
}

type VehicleAction =
  | AddVehicleAction
  | RemoveVehicleAction
  | UpdateVehicleAction
  | UpdateTeamNameAction
  | UpdateVehicleNameAction
  | AddRandomVehicleAction;

const reducer: React.Reducer<Team, VehicleAction> = (state, action) => {
  switch (action.type) {
    case "addVehicle":
      return {
        ...state,
        vehicles: [...state.vehicles, action.vehicle],
      };
    case "addRandomVehicle":
      return {
        ...state,
        vehicles: [...state.vehicles, createRandomCar(action.value)],
      };
    case "removeVehicle":
      return {
        ...state,
        vehicles: [
          ...state.vehicles.slice(0, action.index),
          ...state.vehicles.slice(action.index + 1),
        ],
      };
    case "updateVehicle":
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle, index) =>
          index === action.index ? action.vehicle : vehicle
        ),
      };
    case "updateTeamName":
      return {
        ...state,
        name: action.name,
      };
    case "updateVehicleName":
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle, index) =>
          index === action.index ? { ...vehicle, name: action.name } : vehicle
        ),
      };
    default:
      throw new Error(`unknown vhicle reducer action: ${action}`);
  }
};

export default reducer;