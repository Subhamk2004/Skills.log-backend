// GithubRepo.mjs
import express from "express";
import dotenv from "dotenv";
import { encrypt, decrypt } from '../utils/patEncryptor.mjs';
import { User } from "../schemas/User.mjs";

const router = express.Router();

router.get("/api/github-repos", async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Get user details
        const user = req.user.githubusername;
        let decryptedPAT;

        // Only try to decrypt PAT if it exists
        if (req.user.pat) {
            try {
                decryptedPAT = decrypt(req.user.pat);
            } catch (error) {
                console.error('PAT decryption error:', error);
                // Continue without PAT if decryption fails
            }
        }

        let response;
        const { search } = req.query;

        // Build headers object
        const headers = decryptedPAT
            ? { Authorization: `Bearer ${decryptedPAT}` }
            : {};

        // Determine which API endpoint to use
        let apiUrl;
        if (search) {
            apiUrl = `https://api.github.com/search/repositories?q=${search}+user:${user}`;
        } else {
            apiUrl = decryptedPAT
                ? 'https://api.github.com/user/repos?per_page=5&sort=updated'
                : `https://api.github.com/users/${user}/repos?per_page=5&sort=updated`;
        }

        // Make the API request
        response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            console.error(`GitHub API error: ${response.statusText}`);
            return res.status(response.status).json({
                error: `GitHub API error: ${response.statusText}`
            });
        }

        const repos = await response.json();

        // Process the response based on whether it's a search or regular request
        let strippedRepos;
        if (!search) {
            strippedRepos = repos.map((repo) => ({
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
        } else {
            strippedRepos = repos;
        }

        res.status(200).json(strippedRepos);
    } catch (error) {
        console.error("Error fetching repos:", error);
        res.status(500).json({
            error: "Failed to fetch repos",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;