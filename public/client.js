document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area');

  dropArea.addEventListener('dragover', (event) => {
      event.preventDefault();
  });

  dropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
          uploadFile(files[0]);
      }
  });

  async function uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/upload', {
          method: 'POST',
          body: formData
      });

      if (response.ok) {
          const fileUrl = await response.text();
          const fullUrl = `${window.location.origin}${fileUrl}`;
          await navigator.clipboard.writeText(fullUrl);
          alert(`Link copied to clipboard: ${fullUrl}`);
      } else {
          alert('File upload failed.');
      }
  }
});
