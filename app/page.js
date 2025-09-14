"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, achievementsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/achievements"),
      ]);

      const [projects, skills, achievements] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        achievementsRes.json(),
      ]);

      setStats({
        projects: projects.length || 0,
        skills: skills.length || 0,
        achievements: achievements.length || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: "🚀",
      color: "bg-blue-500",
      href: "/projects",
    },
    {
      title: "Skills",
      count: stats.skills,
      icon: "💡",
      color: "bg-green-500",
      href: "/skills",
    },
    {
      title: "Achievements",
      count: stats.achievements,
      icon: "🏆",
      color: "bg-purple-500",
      href: "/achievements",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfolio Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your projects, skills, and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.loading ? "..." : card.count}
                  </p>
                </div>
                <div
                  className={`${card.color} rounded-full p-3 text-white text-2xl`}
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
              href="/projects"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
            >
              Add New Project
            </Link>
            <Link
              href="/skills"
              className="block w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center"
            >
              Add New Skill
            </Link>
            <Link
              href="/achievements"
              className="block w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-center"
            >
              Add New Achievement
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Portfolio Items</span>
              <span className="font-semibold">
                {stats.loading
                  ? "..."
                  : stats.projects + stats.skills + stats.achievements}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: stats.loading
                    ? "0%"
                    : `${Math.min(
                        100,
                        ((stats.projects + stats.skills + stats.achievements) /
                          20) *
                          100
                      )}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Keep building your portfolio! Add more projects, skills, and
              achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
