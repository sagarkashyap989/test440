// components/SyllabusDisplay.tsx
import { Fragment } from 'react';
import TopicAccordion from './TopicAccordion';
import { SyllabusProps } from '@/types'


export default function SyllabusDisplay({ modules }: SyllabusProps) {
  return (
    <div className="space-y-6">
      {modules?.map((mod, modIdx) => (
        <div key={modIdx}>
          {/* <h2 className="text-2xl font-bold text-blue-700 mb-2"> Module : {mod.module}</h2> */}
          <hr />
          {mod.units.map((unit, unitIdx) => (
            <div key={unitIdx} className="">
              {/* <h3 className="text-lg font-semibold text-gray-800 mb-2">Unit : {unit.unit}</h3> */}

              <h2 className="text-2xl font-bold text-blue-700 mb-2">Unit : {unit.unit}</h2>
              {unit.chapters.map((chp, chpIdx) => (
                <Fragment key={chpIdx}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{chp.name}</h3>

                  <div className="space-y-2">
                    {chp.topics.map((topic, topicIdx) => (
                      <TopicAccordion
                        key={topicIdx}
                        topic={topic}
                        chpId={chp.id}
                        topics={chp.topics}
                        course_id={chp.course_id}
                      />
                    ))}
                  </div>
                </Fragment>
              ))}

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}