// A simple example of a Vercel serverless function
// File: /api/download.js

import fetch from 'node-fetch'; // Vercel has node-fetch built-in

export default async function handler(request, response) {
  // Check if the request method is POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the video URL from the request body
  const { url } = request.body;

  if (!url) {
    return response.status(400).json({ error: 'Video URL is required.' });
  }

  // Define your RapidAPI details
  // ***IMPORTANT: Never expose your API key in client-side code!***
  const rapidApiKey = process.env.RAPIDAPI_KEY; // Use an environment variable
  const rapidApiHost = 'tiktok-video-downloader-api.p.rapidapi.com';

  const apiUrl = `https://${rapidApiHost}/get?url=${encodeURIComponent(url)}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
    });

    const data = await apiResponse.json();

    if (apiResponse.ok && data.download) {
      // Respond with the direct download URL
      return response.status(200).json({ downloadUrl: data.download });
    } else {
      // Handle API errors
      return response.status(500).json({ error: data.error || 'Failed to get download URL from RapidAPI.' });
    }

  } catch (error) {
    console.error('Error calling RapidAPI:', error);
    return response.status(500).json({ error: 'Internal server error.' });
  }
}
