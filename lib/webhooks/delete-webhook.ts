import { Octokit } from "octokit";

interface Repository {
  name: string;
  full_name: string;
  webhook_status: boolean;
}

export default async function deletePullRequestWebhooks(
  repository: Repository,
  access_token: any,
  owner: string
) {
  try {
    let octokit = new Octokit({
      auth: access_token,
    });

    // Get all hooks for the repository
    const hooksResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/hooks",
      {
        owner: owner,
        repo: repository.name,
      }
    );

    // Find the webhook matching the specified URL
    const webhookToDelete = hooksResponse.data.find(
      (hook: any) => hook.config.url === process.env.WEBHOOK_URL
    );

    if (!webhookToDelete) {
      console.log(`Webhook not found for repository: ${repository.full_name}`);
      return;
    }

    // Delete the webhook
    await octokit.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
      owner: owner,
      repo: repository.name,
      hook_id: webhookToDelete.id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    console.log(`Webhook deleted for repository: ${repository.full_name}`);
  } catch (error) {
    console.error("Error deleting webhooks:", error);
  }
}
