import { getUserSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { useState, useEffect } from "react";
import createPullRequestWebhooks from "@/lib/webhooks/create-webhook";
import deletePullRequestWebhooks from "@/lib/webhooks/create-webhook";

export default function UserRepositoriesPage() {
  const [userRepositories, setUserRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  let accessToken;

  useEffect(() => {
    async function fetchUserRepositories() {
      try {
        const { session } = await getUserSession();

        if (!session) {
          redirect("/");
          return;
        }

        connectDB();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
          console.log("No repositories found for this user");
          return;
        }

        setUserRepositories(user.repositories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user repositories:", error);
      }
    }

    fetchUserRepositories();
  }, []);

  const handleCreateWebhook = async (repoName) => {
    try {
      await createPullRequestWebhooks(repoName);
      console.log("Webhook created successfully for repository:", repoName);
    } catch (error) {
      console.error("Error creating webhook:", error);
    }
  };

  const handleDeleteWebhook = async (repoName) => {
    try {
      await deleteWebhook(repoName);
      console.log("Webhook deleted successfully for repository:", repoName);
    } catch (error) {
      console.error("Error deleting webhook:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Your Repositories
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {userRepositories.map((repo) => (
            <li
              key={repo._id}
              style={{
                display: "flex",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
                alignItems: "center",
                border: "1px solid #ccc",
              }}
            >
              <div className="flex-1" style={{ paddingRight: "10px" }}>
                {repo.name}
              </div>
              <div>
                <button
                  onClick={() => handleCreateWebhook(repo.name)}
                  style={{ marginRight: "10px" }}
                >
                  List
                </button>
                <button onClick={() => handleDeleteWebhook(repo.name)}>
                  Delist
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
