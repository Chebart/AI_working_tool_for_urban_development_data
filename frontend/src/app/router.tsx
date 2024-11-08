import { createBrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import ErrorPage from './error/error';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [],
  },
]);
