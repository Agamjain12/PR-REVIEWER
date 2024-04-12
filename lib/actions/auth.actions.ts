"use server";

import { getServerSession } from "next-auth/next";
import { Account, Profile } from "next-auth";
import { nextauthOptions } from "@/lib/nextauth-options";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { Octokit } from "octokit";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
export async function getUserSession() {
  const session = await getServerSession(nextauthOptions);
  return { session };
}

interface ExtendedProfile extends Profile {
  id?: number;
  login?: string;
  picture?: string;
}

interface Repository {
  name: string;
  full_name: string;
}

interface SignInWithOauthParams {
  account: Account;
  profile: ExtendedProfile;
}

export async function signInWithOauth({
  account,
  profile,
}: SignInWithOauthParams) {
  connectDB();

  console.log("account", account, "profile", profile);

  let repositories: Repository[] = [];

  if (account?.provider === "github" && profile.id && profile.login) {
    try {
      const octokit = new Octokit({
        auth: account.access_token,
      });

      let page = 1;
      const perPage = 10; // Number of repositories per page
      let fetchMore = true;

      while (fetchMore) {
        const response = await octokit.request("GET /user/repos", {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
          per_page: perPage,
          page: page,
        });

        if (response.data.length === 0) {
          // No more repositories to fetch
          fetchMore = false;
        } else {
          repositories = [
            ...repositories,
            ...response.data.map((repo: any) => ({
              name: repo.name,
              full_name: repo.full_name,
            })),
          ];

          // Increment page for next pagination
          page++;
        }
      }

      // if (profile.login) {
      //   createPullRequestWebhooks(repositories, account, profile.login);
      // }

      console.log("User Repositories:", repositories);
    } catch (error) {
      console.error("Error fetching repositories:");
    }
  }

  console.log("checking for PR trigger");

  async function createPullRequestWebhooks(
    repositories: Repository[],
    account: any,
    owner: string
  ) {
    try {
      for (const repo of repositories) {
        let octokit = new Octokit({
          auth: account.access_token,
        });

        // Check if webhook already exists
        const hooksResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/hooks",
          {
            owner: owner,
            repo: repo.name,
          }
        );

        const existingWebhooks = hooksResponse.data.filter(
          (hook: any) => hook.config.url === process.env.WEBHOOK_URL
        );

        if (existingWebhooks.length > 0) {
          console.log(
            `Webhook already exists for repository: ${repo.full_name}`
          );
          continue; // Skip creation if webhook already exists
        }

        await octokit.request("POST /repos/{owner}/{repo}/hooks", {
          owner: owner,
          repo: repo.name,
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

        console.log(`Webhook created for repository: ${repo.full_name}`);
      }
    } catch (error) {
      console.error("Error creating webhooks:", error);
    }
  }

  const user = await User.findOne({ email: profile.email });

  if (user) return true;

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    user_name: profile.login,
    access_token: account.access_token,
    provider_account_id: account.providerAccountId,
    image: profile.picture,
    provider: account.provider,
    repositories: repositories,
  });

  // console.log(newUser)
  await newUser.save();

  return true;
}

interface GetUserByEmailParams {
  email: string;
}

export async function getUserByEmail({ email }: GetUserByEmailParams) {
  connectDB();

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new Error("User does not exist!");
  }

  // console.log({user})
  return { ...user._doc, _id: user._id.toString() };
}

export interface SignUpWithCredentialsParams {
  name: string;
  email: string;
  password: string;
}

export async function signUpWithCredentials({
  name,
  email,
  password,
}: SignUpWithCredentialsParams) {
  connectDB();

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // console.log({newUser})
    await newUser.save();

    return { success: true };
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`);
  }
}
interface SignInWithCredentialsParams {
  email: string;
  password: string;
}

export async function signInWithCredentials({
  email,
  password,
}: SignInWithCredentialsParams) {
  connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password!");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password");
  }

  return { ...user._doc, _id: user._id.toString() };
}
