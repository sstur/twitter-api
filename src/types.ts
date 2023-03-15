export type User = {
  id: string;
  username: string;
  fullName: string;
  profilePic: string;
  bio: string;
  following: Array<string>;
  followers: Array<string>;
  likedTweets: Array<string>;
};

export type Tweet = {
  id: string;
  content: string;
  author: string;
  likedBy: Array<string>;
  createdAt: string;
};
