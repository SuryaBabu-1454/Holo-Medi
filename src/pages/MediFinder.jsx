import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaRegPlayCircle } from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { MdOutlineLibraryBooks } from "react-icons/md";
import Title from "../components/Title";

const MediFinder = () => {
  // State management
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Backend API base URL

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // Search handler
  const handleSearch = useCallback(async () => {
    const searchQuery = query.trim();
    if (!searchQuery) {
      setError("Please type something related to medical topics.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Make parallel API calls for books and videos
      const [booksResponse, videosResponse] = await Promise.all([
        axios.post(
          `${backendUrl}/suggest`,
          { genre: searchQuery },
          {
            headers: { "Content-Type": "application/json" },
          }
        ),
        axios.post(
          `${backendUrl}/video_search`,
          { query: searchQuery },
          {
            headers: { "Content-Type": "application/json" },
          }
        ),
      ]);

      // Process books response
      const booksData = booksResponse.data.suggested_books || [];
      const processedBooks = booksData.map((book) => ({
        ...book,
        thumbnail:
          book.thumbnail || "https://via.placeholder.com/150x200?text=No+Cover",
        authors: Array.isArray(book.authors)
          ? book.authors
          : [book.authors || "Unknown Author"],
      }));

      // Process videos response
      const videosData = videosResponse.data.videos || [];
      const processedVideos = videosData.map((video) => {
        const videoId = video.url.split("v=")[1] || "";
        return {
          ...video,
          videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          channelTitle: video.channel || "Unknown Channel",
          title: video.title || "No Title",
        };
      });

      setBooks(processedBooks);
      setVideos(processedVideos);

      // Update search history
      const newHistory = [
        searchQuery,
        ...history.filter(
          (item) => item.toLowerCase() !== searchQuery.toLowerCase()
        ),
      ].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Search error:", error);
      if (error.response) {
        setError(
          error.response.data.error || "Failed to fetch data. Please try again."
        );
      } else {
        setError("Failed to connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [query, history]);

  // Clear search results
  const handleClear = useCallback(() => {
    setQuery("");
    setBooks([]);
    setVideos([]);
    setError(null);
    setHasSearched(false);
  }, []);

  // Helper functions
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearch = (item) => {
    setQuery(() => {
      handleSearch(item); // Ensure search runs with the correct item
      return item; // Update the state
    });
  };

  useEffect(() => {
    if (query) handleSearch(query);
  }, [query]);

  // Combine and shuffle results
  const shuffledResults = [
    ...books.map((b) => ({ type: "book", data: b })),
    ...videos.map((v) => ({ type: "video", data: v })),
  ].sort(() => Math.random() - 0.5);

  const renderContent = () => {
    if (loading) {
      return [...Array(9)].map((_, index) => (
        <motion.div
          key={`loader-${index}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          className="border rounded-lg bg-gray-100 h-48"
        >
          <div className="h-full flex flex-col animate-pulse">
            <div className="h-3/4 bg-cyan-100"></div>
            <div className="p-2 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-3 bg-cyan-100 rounded w-1/2"></div>
            </div>
          </div>
        </motion.div>
      ));
    }

    if (!hasSearched) return null;

    // Check if there are any books or videos available
    const hasBooks = books.length > 0;
    const hasVideos = videos.length > 0;

    // Show specific messages when a tab is selected but has no content
    if (activeTab === "books" && !hasBooks) {
      return (
        <div className="col-span-full text-center py-10">
          <MdOutlineLibraryBooks className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl text-gray-600">No books found</h3>
          <p className="text-gray-500">
            Try a different search term or check the videos tab
          </p>
        </div>
      );
    }

    if (activeTab === "videos" && !hasVideos) {
      return (
        <div className="col-span-full text-center py-10">
          <GoVideo className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl text-gray-600">No videos found</h3>
          <p className="text-gray-500">
            Try a different search term or check the books tab
          </p>
        </div>
      );
    }

    // Original empty state for 'all' tab
    if (shuffledResults.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <h3 className="text-xl text-gray-600">No items found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      );
    }

    return shuffledResults.map((item, index) => {
      if (
        item.type === "book" &&
        (activeTab === "all" || activeTab === "books")
      ) {
        return (
          <motion.div
            key={`book-${item.data.title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
            onClick={() => window.open(item.data.infoLink, "_blank")}
          >
            <div className="border rounded-lg shadow hover:shadow-lg bg-green-50 h-48 overflow-hidden relative group">
              <MdOutlineLibraryBooks
                className="absolute top-2 right-2 bg-black p-1 rounded-full text-green-500 z-10"
                size={24}
              />

              {/* Conditional Rendering for Image or Gradient */}
              {item.data.thumbnail &&
              !item.data.thumbnail.includes("via.placeholder.com") ? (
                <img
                  src={item.data.thumbnail}
                  alt={item.data.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                  onError={(e) => (e.target.style.display = "none")} // Hide image if loading fails
                />
              ) : (
                <div className="w-full h-full flex items-end p-2 rounded-lg bg-gradient-to-b from-gray-500 to-gray-800 text-white text-center">
                  <span className="p-2 text-sm font-medium">
                    {item.data.title}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <h3 className="text-white font-medium text-sm line-clamp-1">
                  {item.data.title}
                </h3>
                <p className="text-white/80 text-xs">
                  {item.data.authors?.join(", ")}
                  {item.data.publishedDate &&
                    ` • ${item.data.publishedDate.substring(0, 4)}`}
                </p>
              </div>
            </div>
          </motion.div>
        );
      }

      if (
        item.type === "video" &&
        (activeTab === "all" || activeTab === "videos")
      ) {
        return (
          <motion.div
            key={`video-${item.data.videoId}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
          >
            <a href={item.data.url} target="_blank" rel="noopener noreferrer">
              <div className="border rounded-lg shadow hover:shadow-lg bg-blue-50 h-48 overflow-hidden relative group">
                <FaRegPlayCircle
                  className="absolute top-2 right-2 bg-black p-1 rounded-full text-red-500 z-10"
                  size={24}
                />
                <img
                  src={item.data.thumbnail}
                  alt={item.data.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Thumbnail")
                  }
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <h3 className="text-white font-medium text-sm line-clamp-1">
                    {item.data.title}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {item.data.channelTitle}
                  </p>
                </div>
              </div>
            </a>
          </motion.div>
        );
      }

      return null;
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-screen">
      <Title name={"Medi-Finder"} />

      {/* Introduction Section */}
      {!hasSearched && (
        <div className="text-center mb-6">
          <p className="text-gray-600 mx-10 text-lg">
            Discover medical books and educational videos. Search for topics
            like anatomy, pharmacology, or any medical subject to find relevant
            resources.
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex w-full md:w-2/3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search medical books or videos..."
            className="flex-1 border border-gray-300 p-4 rounded-l-lg focus:outline-none "
          />
          <button
            onClick={hasSearched ? handleClear : handleSearch}
            className={`p-4 rounded-r-lg text-white ${
              hasSearched
                ? "bg-red-500 hover:bg-red-600"
                : "bg-cyan-600 hover:bg-cyan-700"
            } transition-colors w-28 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : hasSearched ? (
              "Clear"
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg max-w-4xl mx-auto">
        <h3 className="font-medium text-gray-700 mb-2 text-center">
          Recent Searches:
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearch(item)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Navigation */}
            <div className="flex justify-end mb-6">
              {["all", "books", "videos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    activeTab === tab
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors ${tab === "all" ? "rounded-l-lg" : ""} ${
                    tab === "videos" ? "rounded-r-lg" : ""
                  }`}
                >
                  {tab === "all" && <FaRegPlayCircle size={16} />}
                  {tab === "books" && <MdOutlineLibraryBooks size={16} />}
                  {tab === "videos" && <GoVideo size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediFinder;
