import { Octokit } from "octokit";

interface Repository {
  name: string;
  full_name: string;
  webhook_status: boolean;
}

export default async function createPullRequestWebhooks(
  repository: Repository,
  access_token: any,
  owner: string
) {
  try {
    let octokit = new Octokit({
      auth: access_token,
    });

    // Check if webhook already exists
    const hooksResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/hooks",
      {
        owner: owner,
        repo: repository.name,
      }
    );

    const existingWebhooks = hooksResponse.data.filter(
      (hook: any) => hook.config.url === process.env.WEBHOOK_URL
    );

    if (existingWebhooks.length > 0) {
      console.log(
        `Webhook already exists for repository: ${repository.full_name}`
      );
      return;
    }

    await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner: owner,
      repo: repository.name,
      name: "web",
      active: true,
      events: ["pull_request"],
      config: {
        url: process.env.WEBHOOK_URL,
        content_type: "json",
        insecure_ssl: "0",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    console.log(`Webhook created for repository: ${repository.full_name}`);
  } catch (error) {
    console.error("Error creating webhooks:", error);
  }
}
