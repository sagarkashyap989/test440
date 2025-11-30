'use client';

import { useState } from "react";
import UniversitySelectModal from "@/component/UniversitySelectModal";
import MajorSelectModal from "@/component/MajorSelectModal";
import Image from "next/image";

export type University = {
  id: number;
  name: string;
};

export type Major = {
  id: number;
  name: string;
  universityId: number | null;
};

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [universityList, setUniversityList] = useState<University[]>([]);
  const [majorList, setMajorList] = useState<Major[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setExtractedText(""); //type is string
    }
  };

  // import { createWorker } from 'tesseract.js';

  function preprocessImageToDataURL(
    imageFileOrUrl: File | string,
    scale: number = 2,
    blockSize: number = 16,
    blockOffset: number = 10
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = typeof window !== 'undefined' ? new window.Image() : null;
      if (!img) throw new Error('preprocessImageToDataURL must run in the browser');
      img.crossOrigin = 'anonymous';
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const srcW = img.width;
          const srcH = img.height;
          if (!srcW || !srcH) {
            reject(new Error('Image has zero width or height'));
            return;
          }

          const w = Math.round(srcW * scale);
          const h = Math.round(srcH * scale);

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get 2D canvas context'));
            return;
          }

          // white background (helps if PNG has transparency)
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, w, h);

          // draw the scaled image
          ctx.drawImage(img, 0, 0, w, h);

          // get pixel data
          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data; // Uint8ClampedArray

          // Convert to grayscale (in-place)
          // using luma formula: 0.299 R + 0.587 G + 0.114 B
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const l = 0.299 * r + 0.587 * g + 0.114 * b;
            const v = Math.round(l);
            data[i] = data[i + 1] = data[i + 2] = v;
            // keep alpha as-is (usually 255)
          }

          // Block-wise local thresholding
          const bs = Math.max(4, Math.floor(blockSize)); // ensure >=4
          for (let by = 0; by < h; by += bs) {
            for (let bx = 0; bx < w; bx += bs) {
              // compute mean luminance in block
              let sum = 0;
              let count = 0;
              const yMax = Math.min(h, by + bs);
              const xMax = Math.min(w, bx + bs);
              for (let y = by; y < yMax; y++) {
                for (let x = bx; x < xMax; x++) {
                  const idx = (y * w + x) * 4;
                  sum += data[idx]; // grayscale value at R channel
                  count++;
                }
              }
              const mean = count > 0 ? sum / count : 0;
              const threshold = mean - blockOffset;

              // apply threshold to block
              for (let y = by; y < yMax; y++) {
                for (let x = bx; x < xMax; x++) {
                  const idx = (y * w + x) * 4;
                  const v = data[idx] < threshold ? 0 : 255;
                  data[idx] = data[idx + 1] = data[idx + 2] = v;
                }
              }
            }
          }

          // Put processed pixels back to canvas
          ctx.putImageData(imageData, 0, 0);

          // Optionally: you can apply additional contrast adjustments here.

          // Export as PNG data URL
          const out = canvas.toDataURL('image/png');
          resolve(out);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Set image source from File or string URL
      if (typeof imageFileOrUrl === 'string') {
        img.src = imageFileOrUrl;
      } else {
        // File object
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            img.src = reader.result;
          } else {
            reject(new Error('Unexpected FileReader result type'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(imageFileOrUrl);
      }
    });
  }
  
  async function handleUpload(): Promise<void> {
    if (!image) return;

    // ensure client-side environment
    if (typeof window === 'undefined') {
      console.error('handleUpload must be run in a browser environment');
      return;
    }

    setIsLoading(true);
    setExtractedText(null);

    try {
      // 1) Preprocess image
      const preprocessedDataUrl = await preprocessImageToDataURL(image, 2.0);

      // 2) Use Tesseract.js with the correct API
      const tesseract = await import("tesseract.js");
      
      // Option 1: Use recognize directly (simpler approach)
      const result = await tesseract.recognize(
        preprocessedDataUrl,
        'eng',
        {
          logger: (m: unknown) => console.log('tesseract:', m),
          //
// 191:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
        }
      );

      const text: string = result.data.text || '';
      setExtractedText(text);

      // Continue with university fetch
      const uniRes = await fetch('/api/universities');
      if (!uniRes.ok) {
        console.error('Failed to fetch universities:', uniRes.statusText);
        setUniversityList([]);
        setShowUniversityModal(false);
      } else {
        const uniList: University[] = await uniRes.json();
        setUniversityList(uniList);
        setShowUniversityModal(true);
      }
    } catch (error) {
      console.error('OCR or upload error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMajorSubmit = async (major: Major) => {
    try {
      setSelectedMajor(major);
      setShowMajorModal(false);

      const res = await fetch('/api/groke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          university: selectedUniversity,
          major_id: major.id,
        }),
      });
      console.log(res, 'this is res groke')

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error:', errorText);
        alert('Failed to generate syllabus. Please try again.');
        return;
      }

      const data = await res.json();
      // Redirect if needed
      window.location.href = `/syllabus/${data.id}`;
    } catch (error) {
      console.error('Unexpected error in handleMajorSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Upload Your Syllabus Screenshot
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={100}
          height={100}
          className="w-full max-h-96 object-contain mb-4 border"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? "Extracting..." : "Extract Text with OCR"}
      </button>

      {extractedText && (
        <div className="mt-6 p-4 bg-black-600 rounded shadow">
          <h2 className="text-lg font-medium mb-2">Extracted Text:</h2>
        </div>
      )}
      {
        showUniversityModal && (
          <UniversitySelectModal
            open={showUniversityModal}
            onClose={() => setShowUniversityModal(false)}
            onSubmit={async (uni) => {
              setSelectedUniversity(uni);
              setShowUniversityModal(false);
              // Fetch majors for selected university
              const majorRes = await fetch(`/api/majors?universityId=${uni.id}`);
              const majors = await majorRes.json();
              setMajorList(majors);
              setShowMajorModal(true);
            }}
            universities={universityList}
          />
        )
      }

      {/* Major Selection Modal */}
      {
        showMajorModal && (
          <MajorSelectModal
            open={showMajorModal}
            onClose={() => setShowMajorModal(false)}
            majors={majorList}
            onSubmit={handleMajorSubmit}
            selectedMajor={selectedMajor}
            selectedUniversity={selectedUniversity}
          />
        )
      }
    </div>
  );
}
