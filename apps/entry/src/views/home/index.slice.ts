import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { fetchUser } from '@utils/apis';

export interface HomeManagerState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: HomeManagerState = {
  value: 0,
  status: "idle",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'appManager/fetchUser',
//   async (amount: number) => {
//     const response = await fetchUser(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const HomeManagerSlice = createSlice({
  name: "appManager",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value += action.payload;
  //     });
  // },
});

export const {
  increment,
  decrement,
  incrementByAmount,
} = HomeManagerSlice.actions;

export default HomeManagerSlice.reducer;
