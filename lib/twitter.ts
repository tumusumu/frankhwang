/**
 * Twitter/X API integration (stub)
 *
 * This module defines the interfaces for future Twitter integration.
 * Implementation will use the `twitter-api-v2` package.
 */

export interface TweetDraft {
  text: string;
  postSlug: string;
  postUrl: string;
  lang: "en" | "zh";
}

export interface TwitterService {
  postTweet(draft: TweetDraft): Promise<{ id: string; url: string }>;
  deleteTweet(id: string): Promise<void>;
}

export function createTwitterService(): TwitterService {
  throw new Error(
    "Twitter service not implemented. Set TWITTER_API_KEY environment variable and install twitter-api-v2."
  );
}
