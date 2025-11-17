// types.ts
//ParsedSyllabus.tsx
export type Explanation = {
  id: number;
  text: string;
  prompt: string;
  likes: number;
  liked_by?: number[];
  likes_count?: number;
};

export type Topic = {
  title: string;
  id: number,
  chapter_id: number,
  explanations: Explanation[] | null;

};

export type ChaptersUnit = {
  id: number;
  course_id: number,
  name: string,
  module_number: number,
  unit_number: number,
  topics: Topic[]
}

export type TopicUnit = {
  unit: string;
  chapters: ChaptersUnit[];
};

export type Module = {
  module_number: string;
  units: TopicUnit[];
};

export type ParsedSyllabusProps = {
  data: {

    id: number;
    semester: string;
    course_code: string;
    course_title: string;
    courseCode?: string;
    courseTitle?: string;
    credits: number;
    modules: Module[];
    topicLength?: number;
  } | null;
};

export type TopicExplanationProps = {
  topic: Topic;
};


export type CardProps = {
  explanation: Explanation;
};

export type CarouselProps = {
  explanations: Explanation[] | null;
};
export type TopicProps = {
  topic: {
    id:number;
    title: string;
    explanations: Explanation[] | null;
  };
  topics:{ 
    id:number;
    title: string;
    explanations: Explanation[] | null;
  }[];
  chpId: number;
  course_id: number;
};

export type SyllabusProps = {
  modules: Module[];
};

interface ParagraphBlock {
  type: "paragraph";
  content: string;
}

interface TableBlock {
  type: "table";
  content: {
    headers: string[];
    rows: string[][];
  };
}

export type Block = ParagraphBlock | TableBlock;
