// api/download.js

export default async function handler(req, res) {
    // Get the TikTok URL from the query parameters
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'TikTok URL is required.' });
    }

    // Your RapidAPI key will be stored as an environment variable in Vercel
    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured.' });
    }

    // The API endpoint from RapidAPI for the TikTok downloader
    const apiUrl = 'https://tiktok-video-downloader-api.p.rapidapi.com/media';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-video-downloader-api.p.rapidapi.com'
        }
    };

    try {
        const fetchUrl = `${apiUrl}?videoUrl=${encodeURIComponent(url)}`;
        const response = await fetch(fetchUrl, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('RapidAPI Error:', errorData);
            throw new Error(errorData.message || 'Failed to fetch from RapidAPI.');
        }
        
        const data = await response.json();

        // The API response structure might vary. Adjust this based on the actual response.
        // I'm assuming the download URL is in a property like `media_url` or `download_url`.
        // You should check the exact response from your RapidAPI dashboard.
        const downloadUrl = data.media_url || data.aweme_list?.[0]?.video?.play_addr?.url_list?.[0];

        if (!downloadUrl) {
            console.error('No download URL found in API response:', data);
            return res.status(500).json({ error: 'Could not find a downloadable video link.' });
        }

        // Send the download URL back to the front-end
        res.status(200).json({ downloadUrl });

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ error: error.message });
    }
}
