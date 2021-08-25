import { AsyncThunkPayloadCreator, AsyncThunk } from '@reduxjs/toolkit/dist/createAsyncThunk';
import type { Dispatch, AnyAction } from 'redux';

declare module '@reduxjs/toolkit' {
  type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  };

  export function createAsyncThunk<
    Returned,
    ThunkArg = void,
    ThunkApiConfig extends AsyncThunkConfig = { state: RootState }
  >(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
    options?: s,
  ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}
