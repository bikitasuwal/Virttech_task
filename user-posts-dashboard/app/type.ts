//for id
export interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}
// for post
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}