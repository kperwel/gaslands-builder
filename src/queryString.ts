import React from "react";

type Isomorphism<T, V> = {
  to: (t: T) => V;
  from: (v: V) => T;
};

export function useQueryString<T>(
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

export function useQueryStringReducer<T, A>(
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
