import express from "express";
import dotenv from "dotenv";

dotenv.config();

let router = express.Router();

router.get("/api/github-repos", async (req, res) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Use environment variable
    const user = "Subhamk2004";

    try {
        let response;

        // Check if GITHUB_TOKEN is available
        if (GITHUB_TOKEN) {
            response = await fetch(`https://api.github.com/user/repos?per_page=5&sort=updated`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            });
        } else {
            // Fetch public repos of the user
            response = await fetch(`https://api.github.com/users/${user}/repos?per_page=5&sort=updated`);
        }

        if (!response.ok) {
            console.error(`GitHub API error: ${response.statusText}`);
            return res.status(response.status).json({
                error: `GitHub API error: ${response.statusText}`,
            });
        }

        const repos = await response.json();

        const strippedRepos = repos.map((repo) => ({
            name: repo.name,
            visibility: repo.private ? "private" : "public",
            description: repo.description || "No description provided.",
            owner: {
                login: repo.owner.login,
                avatar_url: repo.owner.avatar_url,
                html_url: repo.owner.html_url,
            },
            html_url: repo.html_url,
            language: repo.language || "Not specified",
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            updated_at: repo.updated_at,
            default_branch: repo.default_branch,
            size: repo.size,
            watchers_count: repo.watchers_count,
            id: repo.id,
        }));

        res.status(200).json(strippedRepos);
    } catch (error) {
        console.error("Error fetching repos:", error);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
});

export default router;
