import { useEffect, useReducer, useState } from "react";
import { fetchPosts } from "./api/postsApi";
import { postsReducer, initialState } from "./reducer/postsReducer";
import PostList from "./components/PostList";
import FilterForm from "./components/FilterForm";
function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  const { posts, loading, error } = state;
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchPosts(controller.signal);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (err.name === "AbortError") return;
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    }

    loadPosts();

    return () => {
      controller.abort();
    };
  }, []);
  // Derived state: computed during render, never stored in state
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(normalizedFilter)
  );
  let content;
  if (loading) {
    content = <p>Loading posts...</p>;
  } else if (error) {
    content = <p>Something went wrong: {error}</p>;
  } else if (filteredPosts.length === 0) {
    content = <p>No posts found.</p>;
  } else {
    content = <PostList posts={filteredPosts} />;
  }

  return (
    <div>
      <h1>Post Dashboard</h1>
      <FilterForm filter={filter} onFilterChange={setFilter} />
      {content}
    </div>
  );

}

export default App;