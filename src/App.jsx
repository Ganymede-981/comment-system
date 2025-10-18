import React, { useState } from "react";
import CommentTree from "./components/CommentTree";
import commentsData from "./data/comments.json";
import { motion } from "framer-motion";

function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];
  flatComments.forEach((c, i) => {
    map[c.id] = { ...c, user: c.user || { name: `User_${i + 1}` }, replies: [] };
  });
  flatComments.forEach((c) => {
    if (c.parent_id) map[c.parent_id]?.replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

export default function App() {
  const [comments, setComments] = useState(() => buildCommentTree(commentsData));
  const [newComment, setNewComment] = useState("");

  const handleUpvote = (id, list = comments) =>
    list.map((c) =>
      c.id === id
        ? { ...c, upvotes: (c.upvotes || 0) + 1 }
        : { ...c, replies: handleUpvote(id, c.replies || []) }
    );

  const addReply = (parentId, text, list = comments) =>
    list.map((c) =>
      c.id === parentId
        ? {
            ...c,
            replies: [
              ...c.replies,
              {
                id: Date.now(),
                parent_id: parentId,
                text,
                upvotes: 0,
                created_at: new Date().toISOString(),
                user: { name: "You" },
                replies: [],
              },
            ],
          }
        : { ...c, replies: addReply(parentId, text, c.replies || []) }
    );

  const handleReply = (parentId, text) => setComments((p) => addReply(parentId, text, p));
  const handleUpvoteClick = (id) => setComments((p) => handleUpvote(id, p));

  const handleNewComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newC = {
      id: Date.now(),
      parent_id: null,
      text: newComment,
      upvotes: 0,
      created_at: new Date().toISOString(),
      user: { name: "You" },
      replies: [],
    };
    setComments((p) => [newC, ...p]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm py-4">
        <h1 className="text-center text-2xl font-bold text-blue-700">
          💬 Discussion Board
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* POST SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            How do you design nested comments?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Let’s discuss scalable nested comment systems in React. Share ideas
            and solutions!
          </p>
        </motion.section>

        {/* ADD COMMENT BOX */}
        <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
          <form onSubmit={handleNewComment}>
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition"
              >
                Post
              </button>
            </div>
          </form>
        </section>

        {/* COMMENTS */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🗨️ <span className="ml-2">Comments</span>
          </h2>
          {comments.length > 0 ? (
            <CommentTree
              comments={comments}
              onReply={handleReply}
              onUpvote={handleUpvoteClick}
            />
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Comment System Demo
      </footer>
    </div>
  );
}
