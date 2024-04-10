import React from "react";
import { withSessionSsr } from "@/lib/session";
import { useRouter } from "next/navigation";

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
    const user = req?.session?.user?._id;
    if (!user) {
      return {
        redirect: {
          destination: '/verify',
          permanent: false
        
        }
      }
    }
    return {
      props: {
        verified: true
      }
    }
		
	},
);

export default function Home() {
  const router =useRouter();
  const [posts, setPosts] = React.useState([]);

  async function fetchAllPosts() {
    await fetch("/api/posts/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.code === 200) setPosts(res.data);
        if (res.code === 401) {
          return router.push("/verify");
        }
      })
      .catch((err) => {
        console.error(err);
      });

  }

  React.useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <main>
      <h1>User verified Successfully</h1>
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        {/* Add your create new post form here */}
      </section>
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <ul className="grid grid-cols-3 gap-4">
          {/* Map through your posts array and render post previews */}
          {/* Each post preview should be a clickable element that navigates to a dynamic route */}
        </ul>
      </section>
    </main>
  );
}
