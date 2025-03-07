import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    const response = await api.sendChatMessage(message);
    return response;
  }
);

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Benutzer-Nachricht direkt aus action.meta.arg holen!
        state.messages.push({
          id: Date.now().toString(),
          content: action.meta.arg,
          sender: 'user',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // KI-Antwort hinzufügen
        state.messages.push({
          id: (Date.now() + 1).toString(),
          content: action.payload.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
