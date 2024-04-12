
## NextAuth  


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`]

## Environment Setup
Create a .env file in the root directory and add the following variables:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"

GITHUB_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

MONGODB_URI="YOUR_MONGODB_URI"
```


## Getting Started

Run the following command to start the project and the MongoDB database using Docker Compose:

```bash
docker compose up -d
```

This command will start the Next.js development server and set up the MongoDB database in a Docker container.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Without Docker Compose


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


