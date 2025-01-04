import express from "express";
import dotenv from "dotenv";
import { encrypt, decrypt } from '../utils/patEncryptor.mjs';
import { User } from "../schemas/User.mjs";

const router = express.Router();

// Initialize cache object
const cache = {
    repos: new Map(),
    cacheTimeout: 5 * 60 * 1000 // 5 minutes in milliseconds
};

router.get("/api/github-repos", async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Get user details
        const user = req.user.githubusername;

        // Check cache first
        const cacheKey = `${user}-${req.query.search || ''}`;
        const cachedData = cache.repos.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < cache.cacheTimeout) {
            return res.status(200).json(cachedData.data);
        }

        // PAT Handling
        let decryptedPAT;
        if (req.user.pat) {
            try {
                decryptedPAT = decrypt(req.user.pat);
                // console.log('PAT decryption successful');
            } catch (error) {
                console.error('PAT decryption error:', error);
                // Log additional details in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('Full PAT error:', error);
                }
            }
        }

        // Configure headers
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'SkillsLog-App',
            ...(decryptedPAT && {
                'Authorization': `Bearer ${decryptedPAT}`
            })
        };

        // Determine API endpoint
        const { search } = req.query;
        let apiUrl;
        if (search) {
            apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(search)}+user:${encodeURIComponent(user)}`;
        } else {
            apiUrl = decryptedPAT
                ? 'https://api.github.com/user/repos?per_page=5&sort=updated'
                : `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=5&sort=updated`;
        }

        // Log request details in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Making GitHub API request:', {
                url: apiUrl,
                headerKeys: Object.keys(headers),
                hasAuth: !!decryptedPAT
            });
        }

        // Make the API request
        const response = await fetch(apiUrl, {
            headers,
            timeout: 8000 // 8 second timeout
        });

        // Handle API response
        if (!response.ok) {
            const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
            const rateLimitReset = response.headers.get('x-ratelimit-reset');
            const responseBody = await response.text();

            console.error('GitHub API Error:', {
                status: response.status,
                statusText: response.statusText,
                rateLimitRemaining,
                rateLimitReset,
                body: responseBody
            });

            return res.status(response.status).json({
                error: `GitHub API error: ${response.statusText}`,
                rateLimitInfo: {
                    remaining: rateLimitRemaining,
                    resetsAt: rateLimitReset ? new Date(rateLimitReset * 1000) : null
                }
            });
        }

        const repos = await response.json();

        // Process repositories
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
            strippedRepos = repos.items || repos; // Handle search results differently
        }

        // Update cache
        cache.repos.set(cacheKey, {
            data: strippedRepos,
            timestamp: Date.now()
        });

        res.status(200).json(strippedRepos);

    } catch (error) {
        console.error("Error fetching repos:", error);
        res.status(500).json({
            error: "Failed to fetch repos",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Add cache cleanup interval
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.repos.entries()) {
        if (now - value.timestamp >= cache.cacheTimeout) {
            cache.repos.delete(key);
        }
    }
}, cache.cacheTimeout);

export default router;