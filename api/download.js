// File: /api/download.js

// Import the fetch library for making HTTP requests. Vercel has this built-in.
import fetch from 'node-fetch'; 

// This is the main handler function for the serverless endpoint.
export default async function handler(request, response) {
  // Check if the request method is POST. We only want to accept POST requests for this endpoint.
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the video URL from the JSON body of the request.
  const { url } = request.body;

  // Validate that a URL was provided.
  if (!url) {
    return response.status(400).json({ error: 'Video URL is required.' });
  }

  // Define the RapidAPI details. IMPORTANT: Use environment variables for your key.
  const rapidApiKey = process.env.RAPIDAPI_KEY; // This key is set in Vercel settings
  const rapidApiHost = 'tiktok-video-downloader-api.p.rapidapi.com';

  // Construct the API URL with the user-provided video URL.
  const apiUrl = `https://${rapidApiHost}/get?url=${encodeURIComponent(url)}`;

  try {
    // Make the GET request to the RapidAPI endpoint.
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
    });

    // Parse the JSON response from RapidAPI.
    const data = await apiResponse.json();

    // Check if the API call was successful and returned a download URL.
    if (apiResponse.ok && data.download) {
      // If successful, return the download URL to the front-end.
      return response.status(200).json({ downloadUrl: data.download });
    } else {
      // If the API returned an error, pass that error message back to the client.
      return response.status(apiResponse.status).json({ error: data.error || 'Failed to get download URL from RapidAPI.' });
    }

  } catch (error) {
    // Handle any unexpected network or server errors.
    console.error('Error calling RapidAPI:', error);
    return response.status(500).json({ error: 'Internal server error.' });
  }
}
