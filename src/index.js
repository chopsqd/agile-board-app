import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import {CssBaseline} from '@mui/material'
import App from './App';
import RootStore from "./store";

const store = RootStore.create({})

export const StoreContext = createContext(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <StoreContext.Provider value={store}>
            <CssBaseline />
            <App/>
        </StoreContext.Provider>
    </React.StrictMode>
);

