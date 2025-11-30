'use client';

import { useState } from "react";
import Tesseract from "tesseract.js"; 
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
 
  const handleUpload = async () => {
    if (!image) return;

    setIsLoading(true);
    setExtractedText(null);

    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });

      const extracted = result.data.text;
      setExtractedText(extracted);

      const uniRes = await fetch('/api/universities');
      const uniList = await uniRes.json();
      setUniversityList(uniList);
      setShowUniversityModal(true);

    } catch (error) {
      console.log('error');
      console.error("OCR or upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
