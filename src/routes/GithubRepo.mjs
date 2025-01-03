// GithubRepo.mjs
import express from "express";
import dotenv from "dotenv";
import { encrypt, decrypt } from '../utils/patEncryptor.mjs';
import { User } from "../schemas/User.mjs";

const router = express.Router();

router.get("/api/github-repos", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = req.user.githubusername;
        let decryptedPAT = null;

        if (req.user.pat) {
            try {
                decryptedPAT = decrypt(req.user.pat);
            } catch (error) {
                console.error('PAT decryption error:', error.message);
            }
        }

        const headers = decryptedPAT
            ? { Authorization: `Bearer ${decryptedPAT}` }
            : { 'User-Agent': 'Your-App-Name' };

        const { search } = req.query;
        const apiUrl = search
            ? `https://api.github.com/search/repositories?q=${search}+user:${user}`
            : decryptedPAT
                ? 'https://api.github.com/user/repos?per_page=5&sort=updated'
                : `https://api.github.com/users/${user}/repos?per_page=5&sort=updated`;

        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            console.error(`GitHub API error: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: response.statusText });
        }

        const repos = await response.json();
        const strippedRepos = !search
            ? repos.map((repo) => ({
                name: repo.name,
                visibility: repo.private ? "private" : "public",
                description: repo.description || "No description provided.",
                owner: repo.owner,
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
            }))
            : repos;

        res.status(200).json(strippedRepos);
    } catch (error) {
        console.error("Error fetching repos:", error.message);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
});


export default router;