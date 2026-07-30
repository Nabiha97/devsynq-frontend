import { gql, useQuery } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      githubConnected
      leetcodeConnected
      commitsToday
      leetcodeSolved {
        total
        easy
        medium
        hard
      }
      habits {
        id
        name
        targetFrequency
        currentStreak
        completedToday
      }
      courseProgress {
        id
        courseName
        lessonName
        completedAt
      }
      skillRecommendations
    }
  }
`;

type Habit = {
  id: string;
  name: string;
  targetFrequency: number;
  currentStreak: number;
  completedToday: boolean;
};

type CourseProgress = {
  id: string;
  courseName: string;
  lessonName: string;
  completedAt: string;
};

type LeetCodeSolved = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
};

type Me = {
  id: string;
  name: string;
  email: string;
  githubConnected: boolean;
  leetcodeConnected: boolean;
  commitsToday?: number;
  leetcodeSolved?: LeetCodeSolved;
  habits?: Habit[];
  courseProgress?: CourseProgress[];
  skillRecommendations?: string[];
};

type MeQueryResult = {
  me: Me;
};

export function useMe() {
  return useQuery<MeQueryResult>(ME_QUERY, { fetchPolicy: "network-only" });
}