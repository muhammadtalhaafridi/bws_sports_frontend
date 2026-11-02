import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GuestRoute, ProtectedRoute } from "./components/ProtectedRoute";
import { About } from "./pages/About";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Contact } from "./pages/Contact";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MyOrders } from "./pages/MyOrders";
import { NotFound } from "./pages/NotFound";
import { OrderDetails } from "./pages/OrderDetails";
import { ProductDetails } from "./pages/ProductDetails";
import { Products } from "./pages/Products";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />

        <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
