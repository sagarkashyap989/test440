import { htmlToReact } from '@/lib/htmlToReact';
import LikeButton from './LikeButton';
import { CardProps } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/app/stores/userStore';

export default function ExplanationCard({ explanation }: CardProps) {

  const user = useUserStore((state) => state.user);

  const [selectedText, setSelectedText] = useState<string>("");
  const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [notes, setNotes] = useState<{ text: string; note: string }[]>([]);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });


  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleMouseUp = (e: MouseEvent | React.MouseEvent) => {
    // If clicking inside popup form, don't reset selection
    if (formRef.current && formRef.current.contains(e.target as Node)) {
      return;
    }

    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setButtonPos({
          top: rect.top - containerRect.top - 30,
          left: rect.left - containerRect.left,
        });
      }

      setSelectedText(selection.toString().trim());
      setShowForm(false);
    } else {
      setButtonPos(null);
      setSelectedText("");
      setShowForm(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected text:", selectedText);
    console.log("Input value:", inputValue);
    setNotes((prev) => [...prev, { text: selectedText, note: inputValue }]);

    setInputValue("");
    setShowForm(false);
    setButtonPos(null);
    try {
      const res = await fetch(`/api/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, explanationId: explanation.id, text: selectedText, note: inputValue, highlightType: null }),
      });

      console.log(res);
      if (!res.ok) {
        throw new Error('Failed to inserting annotation');
      }

    } catch (error) {
      // Before: ["a", "b", "c"]
      setNotes((prev) => prev.slice(0, -1));
      // After: ["a", "b"]

      console.error('Error inserting annotation:', error);
    } finally {
    }
  };


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



  const applyHighlight = async (className: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText.trim()) return;

    const span = document.createElement("span");
    span.className = className;
    span.style.backgroundColor =
      className === "highlight-important"
        ? "rgba(255, 99, 71, 0.5)"
        : className === "highlight-medium"
          ? "rgba(255, 215, 0, 0.5)"
          : "rgba(144, 238, 144, 0.5)";

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch (err) {
      console.warn("Highlight failed:", err);
    }

    // Use small timeout to let highlight DOM update before React touches anything
    setTimeout(() => {
      setButtonPos(null);
      setShowForm(false);
      setSelectedText("");
    }, 100);

    try {
      const res = await fetch(`/api/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, explanationId: explanation.id, text: selectedText, note: null, highlightType: className.split('-')[1] }),
      });

      console.log(res);
      if (!res.ok) {
        throw new Error('Failed to inserting annotation');
      }
    } catch (error) {
      // Before: ["a", "b", "c"]
      setNotes((prev) => prev.slice(0, -1));
      // After: ["a", "b"]

      console.error('Error inserting annotation:', error);
    } finally {
    }
  };

  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        fetch(`/api/annotations?explanation_id=${explanation.id}`)
          .then((res) => res.json())
          .then(setNotes)
          .catch(console.error);
      } catch (err) {
        console.error("Failed to load annotations", err);
      }
    };
    fetchAnnotations();
  }, [explanation.id]);


  const highlightNotes = (htmlString: string) => {
    let updatedHtml = htmlString;
    notes.forEach(({ text }) => {
      const regex = new RegExp(`(${text})`, "gi");
      const noteData = notes.find(n => n.text.toLowerCase() === text.toLowerCase());
      // if (noteData && noteData.text) {
      //   const note = noteData.text.replace(/"/g, '&quot;'); // prevent quote breaking HTML
      //   updatedHtml = updatedHtml.replace(
      //     regex,
      //     `<span class="highlight-medium" data-note="${note}">$1</span>`
      //   );
      // }

      if (noteData && noteData.note) {
        const note = noteData.note.replace(/"/g, '&quot;'); // prevent quote breaking HTML
        updatedHtml = updatedHtml.replace(
          regex,
          `<strong class="has-note" data-note="${note}">$1</strong>`
        );
      }

    });
    return updatedHtml;
  };

  // Inside ExplanationCard component: 

  return (
    <div
      ref={containerRef}
      className="relative min-w-[300px] p-2 bg-gray-100 rounded-xl shadow"
      onMouseUp={handleMouseUp}
    >
      <div className="relative min-w-[300px] p-4 bg-gray-100 rounded-xl shadow">
        <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded shadow-sm min-h-[80px]">
          {explanation.text?.map((block: any, index: number) => {
            //when i select the text and leave the mouse click, the selected text gets unselected and the text is also no highlighted
            if (block.type === "paragraph") {
              return (
                <div key={index} className="my-2 leading-relaxed">
                  {htmlToReact(highlightNotes(block.content))}
                </div>

              );
            }
            //content in table get highlighted properly
            if (block.type === "table") {
              const { headers, rows } = block.content;
              return (
                <div key={index} className="overflow-x-auto">
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
                            <td
                              key={cIndex}
                              className="border border-gray-300 px-4 py-2"
                            >
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

      {/* Floating ? button */}
      {buttonPos && !showForm && (

        <div
          className="absolute flex items-center gap-2 bg-white border rounded-xl shadow-xl px-3 py-2 z-50"
          style={{ top: buttonPos.top, left: buttonPos.left }}
        >
          <button
            className="  bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition"

            onClick={() => setShowForm(true)}
          >
            ?
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 text-sm rounded-md shadow-sm hover:bg-red-600 transition"
            onClick={() => applyHighlight("highlight-important")}
          >
            🔴
          </button>
          <button
            className="bg-yellow-400 text-white px-3 py-1 text-sm rounded-md shadow-sm hover:bg-yellow-500 transition"
            onClick={() => applyHighlight("highlight-medium")}
          >
            🟡
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 text-sm rounded-md shadow-sm hover:bg-green-600 transition"
            onClick={() => applyHighlight("highlight-light")}
          >
            🟢
          </button>
        </div>
      )}

      {/* Popup form */}
      {buttonPos && showForm && (
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="absolute bg-white border rounded shadow-lg p-3 w-60"
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </form>
      )}
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
