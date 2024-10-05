import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import ErrorCom from "./Components/ErrorCom";
import Tasks from "./pages/Tasks";
import Boost from "./pages/Boost";
import Stats from "./pages/Stats";
import Cards from './pages/Cards'
import Ref from "./pages/Ref";
import store from "./store";
// import DeviceCheck from "./Components/DeviceCheck";
import Plutos from "./pages/Plutos";
// import TasksList from "./pages/TasksList";
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/",
        element: <Plutos />,
      },
      {
        path: "/ref",
        element: <Ref />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      // {
      //   path:"/taskslist",
      //   element: <TasksList />,
      // },
      {
        path: "/boost",
        element: <Boost />,
      },
      {
        path: "/cards",
        element: <Cards />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(



  // <DeviceCheck>
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
  // </DeviceCheck>

);
