import PrivateRoutes from "./PrivateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectRoute from './ProtectRoute'

export const getRoutes = () => {
  const allRoute = [];
  PrivateRoutes.map(r => {
    r.element = (
      <ProtectRoute route={r}>
        {r.element}
      </ProtectRoute>
    );
  });
  return {
    path: "/",
    element: <MainLayout />,
    children: PrivateRoutes
  };
};
