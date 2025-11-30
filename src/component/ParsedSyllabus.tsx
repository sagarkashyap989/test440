import SyllabusDisplay from "./SyllabusDisplay"; 
import { ParsedSyllabusProps } from '@/types';

 

export default function ParsedSyllabus({ data }: ParsedSyllabusProps) {
  if (!data) return null;

  return (
    <div className="mt-6 p-2 bg-green-50 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{data.semester}</h2>
      <h3 className="text-lg font-semibold text-purple-700 mb-2">
        {data?.course_code} - {data?.course_title} ({data.credits} credits)
      </h3>
      <div className="space-y-6">
        {/* {data.modules.map((mod, modIdx) => (
          <div key={modIdx}>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              🔹 {mod.module}
            </h3>
            <div className="space-y-4 pl-4">  
              {mod.units.map((unit, unitIdx) => (
                <div key={unitIdx}>
                  <h4 className="text-md font-semibold text-gray-900">{unit.unit}</h4>
                  <div className="space-y-2 pl-4">
                    <h1>sagar</h1>
                    {unit.topics.map((topic, topicIdx) => (
                      // <SyllabusDisplay /> why not import Syllabus display
                      <TopicExplanation key={topicIdx} topic={topic} />
                    ))} 
                  </div>
                </div>
              ))}

            </div>
          </div>
        ))} */}
        
             <SyllabusDisplay modules={data.modules} title={data?.course_title}/>
      </div>
    </div>
  );
}
