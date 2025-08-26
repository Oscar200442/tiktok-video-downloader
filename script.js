// script.js
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('tiktok-url');
    const downloadBtn = document.getElementById('download-btn');
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('download-link');
    const errorMessageDiv = document.getElementById('error-message');

    downloadBtn.addEventListener('click', async () => {
        const videoUrl = urlInput.value.trim();

        if (!videoUrl) {
            showError('Please enter a TikTok URL.');
            return;
        }
        
        // Reset UI
        hideError();
        resultDiv.classList.add('hidden');
        loader.classList.remove('hidden');
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Processing...';

        try {
            // This calls the Vercel Serverless Function we created.
            const apiResponse = await fetch(`/api/download?url=${encodeURIComponent(videoUrl)}`);

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || `HTTP error! status: ${apiResponse.status}`);
            }

            const data = await apiResponse.json();
            
            if (data.downloadUrl) {
                downloadLink.href = data.downloadUrl;
                resultDiv.classList.remove('hidden');
            } else {
                throw new Error('Could not retrieve the download link.');
            }

        } catch (error) {
            console.error('Error fetching video:', error);
            showError(error.message || 'An unknown error occurred.');
        } finally {
            loader.classList.add('hidden');
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download Video';
        }
    });

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }

    function hideError() {
        errorMessageDiv.classList.add('hidden');
    }
});
