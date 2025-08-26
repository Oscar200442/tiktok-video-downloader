const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    // This is the API endpoint to get the video link
    const rapidApiUrl = `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(rapidApiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com',
                'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY' // REPLACE THIS
            }
        });

        const result = await response.json();

        if (response.ok && result.data && result.data.play) {
            // Success: Send the video link back to the frontend
            res.status(200).json({ video_url: result.data.play });
        } else {
            // Error: API didn't return a valid link
            res.status(400).json({ error: 'Failed to retrieve video link from TikTok API.' });
        }
    } catch (error) {
        // Handle any network or other errors
        res.status(500).json({ error: 'Internal server error.' });
        console.error('API call error:', error);
    }
};
