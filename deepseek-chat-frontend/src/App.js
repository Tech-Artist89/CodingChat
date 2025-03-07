import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import ChatContainer from './components/ChatContainer';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>DeepSeek-Coder Chat</h1>
        </header>
        <main>
          <ChatContainer />
        </main>
        <footer>
          <p>Powered by ollama deepseek-coder-v2:16b</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;