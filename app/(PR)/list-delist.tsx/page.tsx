import { getUserSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import createPullRequestWebhooks from "@/lib/webhooks/create-webhook";
import deletePullRequestWebhooks from "@/lib/webhooks/create-webhook";

export default async function listDelistRepo() {
  try {
    const { session } = await getUserSession();

    if (!session) {
      redirect("/");
      return null;
    }

    connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return <div>No repositories found for this user</div>;
    }

    return (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Your Repositories
        </h1>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {user.repositories.map((repo: any) => (
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
              <div className="flex-1 w-[75%]">
                <p className="text-ellipsis w-full line-clamp-1">{repo.name}</p>
              </div>
              <div className="ml-2 w-[25%]">
                Status: {`${repo.webhook_status}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return <div>Error fetching user</div>;
  }
}
