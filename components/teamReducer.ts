import React from "react";
import { ActiveVehicle } from "./rules/vehicles";
import { Team } from "./team";

interface AddVehicleAction {
  type: "addVehicle";
  vehicle: ActiveVehicle;
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

type VehicleAction =
  | AddVehicleAction
  | RemoveVehicleAction
  | UpdateVehicleAction
  | UpdateTeamNameAction;

const reducer: React.Reducer<Team, VehicleAction> = (state, action) => {
  switch (action.type) {
    case "addVehicle":
      return {
        ...state,
        vehicles: [...state.vehicles, action.vehicle]
      };
    case "removeVehicle":
      return {
        ...state,
        vehicles: [
          ...state.vehicles.slice(0, action.index),
          ...state.vehicles.slice(action.index + 1)
        ]
      };
    case "updateVehicle":
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle, index) =>
          index === action.index ? action.vehicle : vehicle
        )
      };
    case "updateTeamName":
      return {
        ...state,
        name: action.name
      };
    default:
      throw new Error(`unknown vhicle reducer action: ${action}`);
  }
};

export default reducer;
