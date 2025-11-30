import { htmlToReact } from '@/lib/htmlToReact';
import LikeButton from './LikeButton';
import { CardProps,Block } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/app/stores/userStore';

interface NoteData {
  text: string;
  note: string;
  paragraphIndex: number;
  start: number;
  end: number;
  className: string;
}

export default function ExplanationCard({ explanation }: CardProps) {
  const user = useUserStore((state) => state.user);

  const [selectedText, setSelectedText] = useState<string>("");
  const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // -----------------------------------
  //  HANDLE TEXT SELECTION
  // -----------------------------------
  const handleMouseUp = (e: MouseEvent | React.MouseEvent, paragraphIndex: number) => {
    if (formRef.current && formRef.current.contains(e.target as Node)) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setButtonPos({
          top: rect.top - containerRect.top - 35,
          left: rect.left - containerRect.left,
        });
      }

      setSelectedText(selection.toString().trim());
      setActiveParagraphIndex(paragraphIndex);
      setShowForm(false);
    } else {
      setButtonPos(null);
      setSelectedText("");
      setActiveParagraphIndex(null);
      setShowForm(false);
    }
  };

  // -----------------------------------
  // fetchAnnotations
  // -----------------------------------
  interface ApiNote {
    highlight_type: string;
    end_index: number;
    note: string;
    paragraph_index: number;
    start_index: number;
    text: string;
  }

  useEffect(() => {
    const fetchAnnotations = async () => {
      try {

        const res = await fetch(`/api/annotations?explanation_id=${explanation.id}&user_id=${user?.id}`);
        if (!res.ok) return;
        const data = await res.json();

        const fetchedNotes: NoteData[] = data.map((a: ApiNote) => ({
          className: a.highlight_type,
          end: a.end_index,
          note: a.note,
          paragraphIndex: a.paragraph_index,
          start: a.start_index,
          text: a.text,
        }));

        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Error fetching annotations:", err);
      }
    };

    fetchAnnotations();
  }, [explanation.id]);

  // -----------------------------------
  // saveAnnotationToBackend
  // -----------------------------------
  const saveAnnotationToBackend = async (noteData: NoteData) => {
    try {
      const response = await fetch("/api/annotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          explanationId: explanation.id,
          text: noteData.text,
          note: noteData.note,
          highlightType: noteData.className,
          paragraphIndex: noteData.paragraphIndex,
          startIndex: noteData.start,
          endIndex: noteData.end,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to save annotation:", data.message);
      }
    } catch (err) {
      console.error("Error saving annotation:", err);
    }
  };


  // -----------------------------------
  //  APPLY HIGHLIGHT
  // -----------------------------------
  const applyHighlight = (className: string) => {
    if (!selectedText || activeParagraphIndex === null) return;

    const block = explanation.text[activeParagraphIndex];
    const plainText = block.content;

    const start = plainText.indexOf(selectedText);
    if (start === -1) return;
    const end = start + selectedText.length;

    const newNote: NoteData = {
      text: selectedText,
      note: inputValue || "",
      paragraphIndex: activeParagraphIndex,
      start,
      end,
      className,
    };

    setNotes((prev) => [...prev, newNote]);
    saveAnnotationToBackend(newNote)
    // reset
    setInputValue("");
    setShowForm(false);
    setButtonPos(null);
    setSelectedText("");
  };

  // -----------------------------------
  //  FORM SUBMIT
  // -----------------------------------
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedText || activeParagraphIndex === null) return;
    applyHighlight("highlight-note");
  };

  // -----------------------------------
  //  CLICK OUTSIDE HANDLER
  // -----------------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".popup-button")
      ) {
        setShowForm(false);
        setButtonPos(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------
  //  TOOLTIP HOVER HANDLERS
  // -----------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("has-note")) {
        const note = target.getAttribute("data-note") || "";
        const rect = target.getBoundingClientRect();
        setTooltip({
          visible: true,
          text: note,
          x: rect.left + rect.width / 2,
          y: rect.top - 35,
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("has-note")) {
        setTooltip({ visible: false, text: "", x: 0, y: 0 });
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // -----------------------------------
  //  HIGHLIGHTING LOGIC
  // -----------------------------------
  const highlightNotes = (content: string, paragraphIndex: number) => {
    let newContent = content;
    const paragraphNotes = notes
      .filter((note) => note.paragraphIndex === paragraphIndex)
      .sort((a, b) => b.start - a.start); // reverse to avoid messing indexes

    for (const n of paragraphNotes) {
      const before = newContent.slice(0, n.start);
      const middle = newContent.slice(n.start, n.end);
      const after = newContent.slice(n.end);
      newContent = `${before}<span class="has-note ${n.className}" data-note="${n.note}">${middle}</span>${after}`;
    }

    return newContent;
  };

  // -----------------------------------
  //  RENDER
  // ----------------------------------- 
  return (
    <div ref={containerRef} className="relative min-w-[300px] p-2 bg-gray-100 rounded-xl shadow">
      <div className="relative min-w-[300px] p-4 bg-gray-100 rounded-xl shadow">
        <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded shadow-sm min-h-[80px]">
          {explanation.text?.map((block: Block, index: number) => {
            if (block.type === "paragraph") {
              return (
                <div
                  key={index}
                  className="my-2 leading-relaxed"
                  onMouseUp={(e) => handleMouseUp(e, index)}
                >
                  {htmlToReact(highlightNotes(block.content, index))}
                </div>
              );
            }

            if (block.type === "table") {
              const { headers, rows } = block.content;
              return (
                <div key={index} className="overflow-x-auto my-4">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-200">
                      <tr>
                        {headers.map((header: string, i: number) => (
                          <th
                            key={i}
                            className="border border-gray-300 px-4 py-2 text-left font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: string[], rIndex: number) => (
                        <tr
                          key={rIndex}
                          className={rIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          {row.map((cell: string, cIndex: number) => (
                            <td key={cIndex} className="border border-gray-300 px-4 py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      <LikeButton explanation={explanation} />

      {/* Floating popup with highlight buttons */}
      {buttonPos && !showForm && (
        <div
          className="absolute flex items-center gap-2 bg-white border rounded-xl shadow-xl px-3 py-2 z-50"
          style={{ top: buttonPos.top, left: buttonPos.left }}
        >
          <button
            className="popup-button bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition"
            onClick={() => setShowForm(true)}
          >
            ?
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition"
            onClick={() => applyHighlight("highlight-red")}
          >
            🔴
          </button>
          <button
            className="bg-yellow-400 text-white px-3 py-1 text-sm rounded-md hover:bg-yellow-500 transition"
            onClick={() => applyHighlight("highlight-yellow")}
          >
            🟡
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition"
            onClick={() => applyHighlight("highlight-green")}
          >
            🟢
          </button>
        </div>
      )}

      {/* Popup form for notes */}
      {buttonPos && showForm && (
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="absolute bg-white border rounded shadow-lg p-3 w-60 z-50"
          style={{ top: buttonPos.top + 35, left: buttonPos.left }}
        >
          <p className="text-sm text-gray-600 mb-2">
            About: <span className="font-semibold">{selectedText}</span>
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your note..."
            className="w-full border px-2 py-1 rounded mb-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Save
          </button>
        </form>
      )}

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg pointer-events-none z-50"
          style={{
            top: tooltip.y - (containerRef.current?.getBoundingClientRect().top || 0),
            left: tooltip.x - (containerRef.current?.getBoundingClientRect().left || 0),
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
