import { Octokit } from 'octokit';

console.log("what");

enum start_side_enum{
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

type CommentData = {
  owner: string;
  repo: string;
  pull_number: number;
  body: string;
  commit_id: string;
  path: string;
  start_line: number;
  start_side: start_side_enum;
  line: number;
  side: start_side_enum;
};

const data = {
    owner: 'dummy owner',
    repo: 'dummy repo',
    pull_number: 3,
    body: 'PR REVIEW COMMENT',
    commit_id: 'dummy commit id',
    path: 'pr_trigger.txt',
    start_line: 1,
    start_side: start_side_enum.RIGHT,
    line: 2,
    side: start_side_enum.RIGHT
  };


  postCommentOnPullRequest(data,"dummy token");

async function postCommentOnPullRequest(commentData: CommentData, token: string) {
  const { owner, repo, pull_number, body, commit_id, path, start_line, start_side, line, side } = commentData;

  const octokit = new Octokit({
    auth: token
  });

console.log("inside the function");
console.log(token);

  try {
    const response = await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
      owner,
      repo,
      pull_number,
      body,
      commit_id,
      path,
      start_line,
      start_side,
      line,
      side,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return { message: 'Comment posted successfully', response: response.data };
  } catch (error) {
    return { message: 'Error posting comment', error: error };
  }
}

