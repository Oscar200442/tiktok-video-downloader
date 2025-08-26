document.getElementById('downloadBtn').addEventListener('click', async () => {
    const tiktokUrl = document.getElementById('tiktokUrl').value;
    const statusDiv = document.getElementById('status');
    
    if (!tiktokUrl) {
        statusDiv.textContent = 'Please enter a URL.';
        return;
    }

    statusDiv.textContent = 'Processing...';

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: tiktokUrl })
        });

        const result = await response.json();

        if (response.ok) {
            // Initiate the download
            const link = document.createElement('a');
            link.href = result.video_url;
            link.download = 'tiktok_video.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            statusDiv.textContent = 'Download should start shortly!';
        } else {
            statusDiv.textContent = `Error: ${result.error || 'Failed to get video.'}`;
        }

    } catch (error) {
        statusDiv.textContent = `An unexpected error occurred.`;
        console.error(error);
    }
});
