import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Details Page | Leadership C.O.N.N.E.C.T.I.O.N.S.",
  description: "Redirecting to our blog posts",
};

export default function BlogDetailsPage() {
  // Redirect to the first blog post
  redirect('/blog/leadership-journey-begins');
  return null; // This won't be rendered due to the redirect
}
