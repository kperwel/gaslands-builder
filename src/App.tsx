import React from "react";
import styles from "./App.module.css";
import { ActiveVehicle, vehicleTypes } from "./rules/vehicles";
import VehicleCard from "./VehicleCard";
import { Button, Menu, Navbar, Popover, Position } from "@blueprintjs/core";
import { defaultWeaponTypes, weaponTypes } from "./rules/weapons";

type Isomorphism<T, V> = {
  to: (t: T) => V;
  from: (v: V) => T;
};

function useQueryString<T>(
  initialState: T,
  iso: Isomorphism<T, string>
): [T, (v: T) => void] {
  const [desiredState, setDesiredState] = React.useState(() =>
    window.location.search
      ? iso.from(window.location.search.slice(1))
      : initialState
  );

  React.useEffect(() => {
    const handler = setTimeout(
      () =>
        window.history.replaceState(
          desiredState,
          "",
          `${window.location.pathname}?${iso.to(desiredState)}`
        ),
      10
    );

    return () => clearTimeout(handler);
  }, [desiredState, iso]);

  return [desiredState, setDesiredState];
}

function useQueryStringReducer<T, A>(
  reducer: React.Reducer<T, A>,
  initialState: T,
  iso: Isomorphism<T, string>
): [T, React.Dispatch<A>] {
  const [state, setState] = useQueryString(initialState, iso);

  const dispatch = React.useCallback(
    (action: A) => setState(reducer(state, action)),
    [reducer, state, setState]
  );

  return [state, dispatch];
}

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

type VehicleAction =
  | AddVehicleAction
  | RemoveVehicleAction
  | UpdateVehicleAction;

type VehicleTypeAbbreviation = string;
type WeaponTypeAbbreviation = string;
type CondensedActiveVehicle = [
  VehicleTypeAbbreviation,
  WeaponTypeAbbreviation[]
];

const App: React.FC = (): React.ReactElement => {
  const reducer = (state: ActiveVehicle[], action: VehicleAction) => {
    switch (action.type) {
      case "addVehicle":
        return [...state, action.vehicle];
      case "removeVehicle":
        return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1)
        ];
      case "updateVehicle":
        return state.map((vehicle, index) =>
          index === action.index ? action.vehicle : vehicle
        );
      default:
        throw new Error(`unknown vhicle reducer action: ${action}`);
    }
  };

  const [vehicles, dispatchVehicleAction] = useQueryStringReducer(reducer, [], {
    from: (queryString: string): ActiveVehicle[] => {
      try {
        const parsed: CondensedActiveVehicle[] = JSON.parse(
          decodeURIComponent(queryString)
        );
        return parsed.flatMap(
          (condensed: CondensedActiveVehicle): ActiveVehicle[] => {
            const [
              vehicleTypeAbbreviation,
              weaponTypeAbbreviations
            ] = condensed;
            const type = vehicleTypes.find(
              v => v.abbreviation === vehicleTypeAbbreviation
            );

            if (!type) {
              return [];
            }

            const weapons = weaponTypeAbbreviations.flatMap(abbr => {
              const weapon = weaponTypes.find(w => w.abbreviation === abbr);
              return weapon ? [weapon] : [];
            });

            return [
              {
                type,
                weapons
              }
            ];
          }
        );
      } catch (e) {
        console.warn("Unable to parse query string", e);
        return [];
      }
    },
    to: (state: ActiveVehicle[]): string => {
      const condensedState: CondensedActiveVehicle[] = state.map(v => [
        v.type.abbreviation,
        v.weapons.map(w => w.abbreviation)
      ]);
      return JSON.stringify(condensedState);
    }
  });

  const addVehicle = (vehicle: ActiveVehicle): void => {
    dispatchVehicleAction({ type: "addVehicle", vehicle });
  };

  const removeVehicle = (index: number): void => {
    dispatchVehicleAction({ type: "removeVehicle", index });
  };

  const updateVehicle = (index: number, vehicle: ActiveVehicle): void => {
    dispatchVehicleAction({ type: "updateVehicle", index, vehicle });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>Gaslands Builder</Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <main className={styles.main}>
        <div className={styles.controls}>
          <Popover
            content={
              <Menu>
                {vehicleTypes.map(type => (
                  <Menu.Item
                    key={type.name}
                    text={type.name}
                    onClick={() =>
                      addVehicle({
                        type,
                        weapons: defaultWeaponTypes
                      })
                    }
                  ></Menu.Item>
                ))}
              </Menu>
            }
            position={Position.BOTTOM}
            minimal
          >
            <Button>Add vehicle</Button>
          </Popover>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map((vehicle, index) => (
            <div
              className={styles.vehiclesItem}
              key={`${vehicle.type}-${index}`}
            >
              <VehicleCard
                vehicle={vehicle}
                onUpdate={updatedVehicle => {
                  updateVehicle(index, updatedVehicle);
                }}
                onDuplicate={() => {
                  addVehicle(vehicle);
                }}
                onRemove={() => {
                  removeVehicle(index);
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
