import MainRoutes from '../src/routing/MainRoutes'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Toast from './components/Toast';

function App() {
    // const theme = useSelector ((state) => state.theme.value);

    // useEffect (() => {
    //     document.documentElement.setAttribute("data-theme", theme);
    // }, [theme]);
 
    return (
        <>
            <MainRoutes/>
            <Toast />
        </>
    )
}

export default App
