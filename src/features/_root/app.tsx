import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import {
  AuthPage,
  ForgetPassword,
  LoginPage,
  ResetPassword
} from "@/features/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Load Component for Pages
import { Default404, Vokadash } from "@/features/_global";
// import { Otp } from "@/features/otp";
import {
  SchoolRegister
} from "@/features/schools";
import { OTPPage } from "../auth/pages/otpPage.js";
import { TVLanding } from "../tv/pages/index.js";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <TVLanding />,
      errorElement: <Default404 />,
      children: [
        {
          path: "perpus-tv",
          element: <TVLanding />,
        },
      ]
    },
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/auth/register",
      element: <SchoolRegister />,
    },
    {
      path: "/otp",
      element: <OTPPage />,
    },
  ],
  {
    basename: APP_CONFIG.baseName,
  }
);

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash
      appName={APP_CONFIG.appName}
      menus={sidebarMenus}
      usermenus={usermenus}
    >
      <RouterProvider router={router} />
    </Vokadash>
  );
};

export const App = () => {
  return <RootApp />;
};
