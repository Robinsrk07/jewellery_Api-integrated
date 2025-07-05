// src/StateManagement/posSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemData:[], // This will act as the cart (array of items)
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // Add a single item to the cart
    addItemToCart: (state, action) => {
      state.itemData.push(action.payload);
    },

    // Optionally, remove an item by index or UUID
    removeItemFromCart: (state, action) => {
      const uuidToRemove = action.payload;
      state.itemData = state.itemData.filter(item => item.uuid !== uuidToRemove);
    },

    // Clear entire cart
    clearItemData: (state) => {
      state.itemData = [];
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearItemData } = posSlice.actions;
export default posSlice.reducer;
