import { useEffect, useReducer } from "react";
import { fetchPosts } from "./api/postsApi";
import { postsReducer, initialState } from "./reducer/postsReducer";
import PostList from "./components/PostList";

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  const { posts, loading, error } = state;

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

  let content;
  if (loading) {
    content = <p>Loading posts...</p>;
  } else if (error) {
    content = <p>Something went wrong: {error}</p>;
  } else if (posts.length === 0) {
    content = <p>No posts found.</p>;
  } else {
    content = <PostList posts={posts} />;
  }

  return (
    <div>
      <h1>Post Dashboard</h1>
      {content}
    </div>
  );
}

export default App;