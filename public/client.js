document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const fileUrl = `${window.location.origin}${data.fileUrl}`;
      document.getElementById('fileLink').innerHTML = `<a href="${fileUrl}" target="_blank">View Uploaded File</a>`;
    } else {
      document.getElementById('fileLink').innerHTML = 'File upload failed.';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('fileLink').innerHTML = 'An error occurred during file upload.';
  }
});
