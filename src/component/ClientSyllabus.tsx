"use client";

import ParsedSyllabus from "@/component/ParsedSyllabus";
import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/app/stores/userStore";
import { useLearnedTopicsStore } from "@/app/stores/learnedTopicsStore";

interface Props { syllabus_id: string };

export default function ClientSyllabus({ syllabus_id }: Props) {
  const user = useUserStore((state) => state.user);
  const {   learnedTopics, setLearnedTopics } = useLearnedTopicsStore();
  const [parsedData, setParsedData] = useState();
  const [percentLearned, setPercentLearned] = useState(0);
console.log(learnedTopics)
  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/parse-syllabus?syllabus_id=${syllabus_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth0_id: user?.id || 0,
      }),
    });
    const data = await res.json();
    setParsedData(data);
    return data.topicLength;
  }, [syllabus_id, user?.id]);

  const fetchLearnedTopics = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/learned_topics/${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data, 'last-visited-course')
        setLearnedTopics(data || []);
        return data.length;
      } else {
        console.error('Failed to sync user');
      }
    } catch (error) {
      console.error(error);
    }
  }, [user?.id, setLearnedTopics]);

  // Calculate percentage learned
  // useEffect(() => {
  //   if (parsedData?.topicLength && learnedTopics) {
  //     const percentage = (learnedTopics.length / parsedData.topicLength) * 100;
  //     setPercentLearned(Math.trunc(percentage));
  //   }
  // }, [parsedData, learnedTopics]);

  // Initial data fetch
  // Initial fetch sequence
  useEffect(() => {
    const run = async () => {

      const allTopicLength = await fetchData();          // first get topicLength
      const learnedTopicLength = await fetchLearnedTopics(); // then get learned topics
      if (allTopicLength) {
        const percentage = (learnedTopicLength /allTopicLength) * 100;
        setPercentLearned(Math.trunc(percentage));
      }
    };


    run();
  }, [fetchData, fetchLearnedTopics]);

  //since fetchData, return response after fetchLearnedTopics, my percentage logicc breaks...

  return (
    <main className="py-4">
      <p className="mb-4">Course Completed :</p>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${percentLearned}%` }}
        >
          {percentLearned}%
        </div>
      </div>
      {parsedData && <ParsedSyllabus data={parsedData} />}
    </main>
  );
}