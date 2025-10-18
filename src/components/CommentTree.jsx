import React from "react";
import Comment from "./Comment";

export default function CommentTree({ comments, onReply, onUpvote }) {
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onUpvote={onUpvote}
        />
      ))}
    </div>
  );
}
