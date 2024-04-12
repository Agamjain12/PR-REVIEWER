import { Octokit } from 'octokit';

enum state_enum {
    open = "open",
    closed = "closed"
}

type UpdatePullRequestData = {
  owner: string;
  repo: string;
  pull_number: number;
  title: string;
  body: string;
  state: state_enum;
  base: string;
};



export async function updatePullRequest(updateData: UpdatePullRequestData, token: string) {
  const { owner, repo, pull_number, title, body, state, base } = updateData;

  const octokit = new Octokit({
    auth: token
  });

  try {
    const response = await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number,
      title,
      body,
      state,
      base,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return { message: 'Pull request updated successfully', response: response.data };
  } catch (error) {
    return { message: 'Error updating pull request', error: error };
  }
}

// Usage example
const data = {
  owner: 'dummy owner',
  repo: 'dummy repo',
  pull_number: 3,
  title: 'New Title',
  body: 'Updated Body',
  state: state_enum.open,
  base: 'master'
};

const token = 'dummy token';

updatePullRequest(data, token)
  .then((result) => {
    console.log('Result:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

