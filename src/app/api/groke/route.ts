import { NextRequest, NextResponse } from 'next/server';

interface Topic {
  id: number;
  chapter_id: number;
  title: string;
}

interface Module {
  id: number;
  course_id: number;
  name: string;
  module_number: number;
  unit_number: number;
  topics: Topic[];
}

interface ParsedSyllabus {
  id: number;
  semester_id: number;
  course_code: string;
  course_title: string;
  credits: number;
  major_id: null;
  modules: Module[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedSyllabus = await parseSyllabusWithGemini(body.text);



    if (!parsedSyllabus) {
      return NextResponse.json(
        { error: 'Failed to parse syllabus' },
        { status: 400 }
      );
    }
    console.log(parsedSyllabus,'parsedSyllabus')

    const backendResponse = await fetch(`${process.env.API_URL}groke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textData: parsedSyllabus, major_id: body.major_id }),
    });

    console.log()
    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });

    return NextResponse.json(parsedSyllabus, { status: 200 });
  } catch (error) {
    console.error('Error in syllabus parsing:', error);
    return NextResponse.json(
      { error: 'Failed to parse syllabus', details: (error as Error).message },
      { status: 500 }
    );
  }
}

const parseSyllabusWithGemini = async (rawSyllabusText: string): Promise<ParsedSyllabus | null> => {
  try {
    const cleanedText = rawSyllabusText.split('\n')
      .filter(line => !line.match(/^comece|wows|\|/))
      .join('\n')
      .trim();

    const prompt = `
You are an expert syllabus parser that strictly follows output formatting rules.

IMPORTANT INSTRUCTIONS:
1. Extract ONLY the actual syllabus content, ignoring any irrelevant text
2. Split ALL topic lists into individual items (never combine multiple topics in one item)
3. Create separate modules for each Unit (Unit 1, Unit 2, etc.)
4. For content under "General Principles", create a separate module within the same Unit
5. Follow EXACTLY this JSON structure:
{
  "id": number,
  "semester_id": 1,
  "course_code": "COURSECODE",
  "course_title": "course_title",
  "credits": 3,
  "major_id": null,
  "modules": [
    {
      "id": number,
      "course_id": same_as_parent_id,
      "name": "string",
      "module_number": sequential (1, 2, 3...),
      "unit_number": 1,
      "topics": [
        {
          "id": number,
          "chapter_id": same_as_module_id,
          "title": "string"
        }
      ]
    }
  ]
}

SPECIFIC RULES:
3. NEVER combine topics from different sections
4. Remove colons from topic titles to something suitable
5. Set course_code to "SIM101"
6. Set course_title to something suitable
7. Set credits to 3
8. Set major_id to null
9. All unit_number values should be 1
10. Topics should be split at commas and colons

Raw syllabus text:
"""
${cleanedText}
"""

ONLY RETURN THE JSON OUTPUT, NOTHING ELSE. DO NOT INCLUDE ANY EXPLANATIONS.`;


    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBmMesfCQC1hjj7qGiu0VKyXjND_gmvV-Y`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const responseData = await response.json();
    const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No response text from Gemini');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // Sometimes Gemini returns JSON wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        throw e;
      }
    }
    console.log(parsedResponse, 'respoce from gemini')
    // Validate and normalize the response
    if (!parsedResponse || !parsedResponse.modules || !Array.isArray(parsedResponse.modules)) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Generate proper IDs and relationships
    const courseId = Date.now();
    parsedResponse.id = courseId;
    parsedResponse.major_id = null;

    let topicIdCounter = 1;
    parsedResponse.modules.forEach((module: Module) => {
      module.course_id = courseId;
      module.unit_number = 1; // Force unit_number to 1
      module.topics.forEach((topic: Topic) => {
        topic.id = topicIdCounter++;
        topic.chapter_id = module.id;
      });
    });

    console.log(parsedResponse, 'parsedResponse')
    return parsedResponse as ParsedSyllabus;
  } catch (error) {
    console.error('Error parsing with Gemini:', error);
    return null;
  }
};