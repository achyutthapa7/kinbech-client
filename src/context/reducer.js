export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      localStorage.setItem("CART", JSON.stringify([...state, action.payload]));
      return [...state, action.payload];
    case "REMOVE_FROM_CART":
      localStorage.setItem(
        "CART",
        JSON.stringify(state.filter((s) => s._id != action.payload))
      );
      return state.filter((s) => s._id != action.payload);
  }
};
