import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Verifyotp from "../features/auth/pages/Verifyotp";
import Profile from "../features/auth/pages/Profile";
import MainLayout from "../layouts/MainLayout";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../features/auth/auth.slice";
import { AuthServices } from "../features/auth/services/auth.service";
import PubliC from "./protected/Public";
import Protected from "./protected/Protected";
import SellerDashboard from "../features/dashboard/pages/SellerDashboard";
import MyRestaurant from "../features/restaurant/pages/MyRestaurant";
import CreateRestaurant from "../features/restaurant/pages/CreateRestaurant";
import ManageCategory from "../features/restaurant/pages/ManageCategory";
import ManageMenu from "../features/restaurant/pages/ManageMenu";

const AppRoutes = () => {
  console.log("appRoutes");
  let dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let res = await AuthServices.getCurrentUser();
        dispatch(setUser(res?.data));
      } catch (error) {
        dispatch(setUser(null));
        console.log("error in me api", error);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [dispatch]);

  let router = createBrowserRouter([
    {
      path: "/",
      element: <PubliC />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            { path: "", element: <Login /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "verifyotp", element: <Verifyotp /> },
          ],
        },
      ],
    },

    {
      path: "/home",
      element: <Protected />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            { path: "", element: <SellerDashboard /> },
            { path: "restaurant", element: <MyRestaurant /> },
            { path: "restaurant/create", element: <CreateRestaurant /> },
            { path: "restaurant/categories", element: <ManageCategory /> },
            { path: "restaurant/menus", element: <ManageMenu /> },
          ],
        },
      ],
    },

    {
      path: "/profile",
      element: <Protected />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            { path: "", element: <Profile /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;