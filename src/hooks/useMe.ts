import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

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

export function useMe() {
  return useQuery(ME_QUERY, { fetchPolicy: "network-only" });
}