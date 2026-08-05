import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Products from "@/pages/Products";
import ProductEditor from "@/pages/ProductEditor";
import Inventory from "@/pages/Inventory";
import Campaigns from "@/pages/Campaigns";
import Analytics from "@/pages/Analytics";
import Delivery from "@/pages/Delivery";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductEditor />} />
          <Route path="/products/:id" element={<ProductEditor />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
