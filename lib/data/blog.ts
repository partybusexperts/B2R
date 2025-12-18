import { createClient } from "../supabase/server";

export const mockPosts = [
  {
    author: "John Doe",
    content: "This is a sample blog post content.",
    created_at: "2023-01-01T00:00:00Z",
    excerpt: "An excerpt of the sample blog post.",
    id: "1",
    published_at: "2023-01-01T00:00:00Z",
    slug: "sample-blog-post",
    tags: ["sample", "blog"],
    thumbnail_url: "https://example.com/thumbnail1.jpg",
    title: "Sample Blog Post",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    author: "Jane Smith",
    content: "Another interesting blog post content goes here.",
    created_at: "2023-02-01T00:00:00Z",
    excerpt: "An excerpt of another interesting blog post.",
    id: "2",
    published_at: "2023-02-01T00:00:00Z",
    slug: "another-interesting-post",
    tags: ["interesting", "blog"],
    thumbnail_url: "https://example.com/thumbnail2.jpg",
    title: "Another Interesting Post",
    updated_at: "2023-02-01T00:00:00Z",
  },
  {
    author: "Alice Johnson",
    content: "Insights on the latest trends in technology.",
    created_at: "2023-03-01T00:00:00Z",
    excerpt: "A brief overview of the latest tech trends.",
    id: "3",
    published_at: "2023-03-01T00:00:00Z",
    slug: "latest-tech-trends",
    tags: ["technology", "trends"],
    thumbnail_url: "https://example.com/thumbnail3.jpg",
    title: "Latest Tech Trends",
    updated_at: "2023-03-01T00:00:00Z",
  },
];

export async function getBlogPosts() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getBlogs:", error);
    return null;
  }

  if (!posts) {
    console.warn("getBlogs:", "No data found");
    return null;
  }

  return posts;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getBlogPostBySlug:", error);
    return null;
  }

  if (!posts) {
    console.warn("getBlogPostBySlug:", error);
    return null;
  }

  return posts;
}

export type PostsData = Awaited<ReturnType<typeof getBlogPosts>>;
