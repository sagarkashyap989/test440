"use client";
import { useState, useRef } from "react";

export default function TopicContentWithHighlight({
  initialContent,
}: {
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const savedRange = useRef<Range | null>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0);
      savedRange.current = range.cloneRange(); // ✅ store the selection range
      const rect = range.getBoundingClientRect();
      setToolbarPos({ x: rect.left + rect.width / 2, y: rect.top - 40 });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const applyHighlight = (className: string) => {
    const range = savedRange.current;
    if (!range) return;

    const span = document.createElement("span");
    span.className = className;
    try {
      range.surroundContents(span);
    } catch (e) {
      console.warn("Highlight failed: ", e);
      return;
    }

    savedRange.current = null;
    setShowToolbar(false);
    setContent(contentRef.current?.innerHTML || "");
  };

  return (
    <div className="relative p-4">
      {/* Floating Highlight Toolbar */}
      {showToolbar && (
        <div
          className="absolute bg-white shadow-lg rounded-lg flex gap-2 px-2 py-1 border z-50"
          style={{
            top: toolbarPos.y,
            left: toolbarPos.x,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            className="bg-red-400 text-white px-2 py-1 text-sm rounded"
            onClick={() => applyHighlight("highlight-important")}
          >
            🔴
          </button>
          <button
            className="bg-yellow-400 text-white px-2 py-1 text-sm rounded"
            onClick={() => applyHighlight("highlight-medium")}
          >
            🟡
          </button>
          <button
            className="bg-green-400 text-white px-2 py-1 text-sm rounded"
            onClick={() => applyHighlight("highlight-light")}
          >
            🟢
          </button>
        </div>
      )}

      {/* Editable Text Section */}
      <div
        ref={contentRef}
        id="topic-content"
        onMouseUp={handleMouseUp}
        contentEditable
        className="border p-4 rounded-md leading-relaxed cursor-text bg-gray-50"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      {/* Styles for highlights */}
      <style jsx>{`
        .highlight-important {
          background-color: #ff6b6b;
        }
        .highlight-medium {
          background-color: #f9d949;
        }
        .highlight-light {
          background-color: #81c784;
        }
      `}</style>
    </div>
  );
}
