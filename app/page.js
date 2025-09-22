"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    suppliers: 0,
    lowStock: 0,
    totalValue: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/suppliers"),
      ]);

      const [products, suppliers] = await Promise.all([
        productsRes.json(),
        suppliersRes.json(),
      ]);

      // Calculate low stock items (stock < 10)
      const lowStockItems = products.filter(
        (product) => product.stockQuantity < 10
      );

      // Calculate total inventory value
      const totalValue = products.reduce(
        (sum, product) => sum + product.price * product.stockQuantity,
        0
      );

      setStats({
        products: products.length || 0,
        suppliers: suppliers.length || 0,
        lowStock: lowStockItems.length || 0,
        totalValue: totalValue || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: "Total Products",
      count: stats.products,
      icon: "📦",
      color: "bg-blue-500",
      href: "/products",
    },
    {
      title: "Suppliers",
      count: stats.suppliers,
      icon: "🏢",
      color: "bg-green-500",
      href: "/suppliers",
    },
    {
      title: "Low Stock Items",
      count: stats.lowStock,
      icon: "⚠️",
      color: "bg-red-500",
      href: "/products?filter=low-stock",
    },
    {
      title: "Inventory Value",
      count: `$${stats.totalValue.toLocaleString()}`,
      icon: "💰",
      color: "bg-purple-500",
      href: "/products",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your products, suppliers, and stock levels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.loading ? "..." : card.count}
                  </p>
                </div>
                <div
                  className={`${card.color} rounded-full p-3 text-white text-xl`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/products"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
            >
              Add New Product
            </Link>
            <Link
              href="/suppliers"
              className="block w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center"
            >
              Add New Supplier
            </Link>
            <Link
              href="/products?filter=low-stock"
              className="block w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center"
            >
              View Low Stock Items
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Items in Stock</span>
              <span className="font-semibold">
                {stats.loading ? "..." : stats.products}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Suppliers</span>
              <span className="font-semibold">
                {stats.loading ? "..." : stats.suppliers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Need Restocking</span>
              <span
                className={`font-semibold ${
                  stats.lowStock > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {stats.loading ? "..." : stats.lowStock}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  stats.lowStock > 5
                    ? "bg-red-500"
                    : stats.lowStock > 0
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: stats.loading
                    ? "0%"
                    : `${Math.min(
                        100,
                        Math.max(10, (stats.products / 50) * 100)
                      )}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {stats.lowStock > 0
                ? `${stats.lowStock} items need restocking`
                : "All items are well stocked"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
