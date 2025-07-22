import adminRoutes from "./adminRoutes";
import sellerRoutes from "./sellerRoutes";

const PrivateRoutes = [...adminRoutes, ...sellerRoutes];

export default PrivateRoutes;
