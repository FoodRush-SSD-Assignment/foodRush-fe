import React, { useState, useEffect } from "react";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    // Later: Send request to search restaurants/items based on `searchQuery`
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">
        Welcome back, <span className="text-red-600">{user.firstname}!</span>
      </h1>
      <p className="text-gray-600 mb-8">
        Start exploring delicious restaurants and dishes near you.
      </p>

      <form onSubmit={handleSearch} className="max-w-xl flex">
        <input
          type="text"
          placeholder="Search for restaurants or items..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-6 rounded-r-lg hover:bg-red-700 transition-all"
        >
          Search
        </button>
      </form>

      {/* Placeholder for future results */}
      <div className="mt-10 text-gray-500">
        🔍 Search results will be displayed here...
      </div>
    </div>
  );
};

export default LandingPage;
