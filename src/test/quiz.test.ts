import { describe, expect, it } from "vitest";
import { QUIZ_QUESTIONS } from "../data/questions";
import { createSession } from "../lib/quiz";

describe("createSession", () => {
  it("creates focused topic sessions with only matching questions", () => {
    const session = createSession(
      {
        mode: "focused_topic",
        topicId: "auto-loader",
        questionCount: 6,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: [] },
      15,
    );

    expect(session.questionIds).toHaveLength(6);
    const pickedTopics = session.questionIds.map(
      (id) => QUIZ_QUESTIONS.find((question) => question.id === id)?.topicId,
    );
    expect(new Set(pickedTopics)).toEqual(new Set(["auto-loader"]));
  });

  it("returns requested count for focused topic when enough questions exist", () => {
    const session = createSession(
      {
        mode: "focused_topic",
        topicId: "auto-loader",
        questionCount: 10,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: [] },
      23,
    );

    expect(session.questionIds).toHaveLength(10);
  });

  it("avoids immediately repeating recent questions when possible", () => {
    const recent = QUIZ_QUESTIONS.slice(0, 10).map((question) => question.id);
    const session = createSession(
      {
        mode: "overall_skills",
        questionCount: 12,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: recent },
      42,
    );

    const repeated = session.questionIds.filter((id) => recent.includes(id));
    expect(repeated.length).toBeLessThan(session.questionIds.length);
  });

  it("caps session size to available questions for the selected filter", () => {
    const session = createSession(
      {
        mode: "overall_skills",
        questionCount: 999,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: [] },
      42,
    );

    expect(session.questionIds).toHaveLength(QUIZ_QUESTIONS.length);
    expect(session.config.questionCount).toBe(QUIZ_QUESTIONS.length);
  });
});

describe("question bank quality", () => {
  it("has unique question IDs and at least 10 questions per topic", () => {
    const ids = QUIZ_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);

    const countsByTopic = QUIZ_QUESTIONS.reduce<Record<string, number>>(
      (acc, question) => {
        acc[question.topicId] = (acc[question.topicId] ?? 0) + 1;
        return acc;
      },
      {},
    );

    Object.values(countsByTopic).forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(10);
    });
  });
});
