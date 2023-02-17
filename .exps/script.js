const uploadFiles = (files) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    console.log(xhr.responseText);
  };

  xhr.open('POST', 'http://localhost:3000/disk-upload');

  const formData = new FormData();
  files.forEach(file => {
    formData.append('profile', file);
  });

  xhr.send(formData);
};


const readImageFile = (file, cb) => {
  const reader = new FileReader();
  reader.onload = () => {
    cb(reader.result);
  };

  reader.readAsDataURL(file);
};

const height = (width, aspectRatio) => {
  return (1 / aspectRatio) * width;
};

const aspectRatio = (image) => {
  return image.width / image.height;
};

const parseDataUrl = (dataUrl) => {
  const [, mimeType] = dataUrl.split(';')[0].split(':');
  const [, base64String] = dataUrl.split(',');

  const binary = atob(base64String);

  const u8int = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    u8int[index] = binary.charCodeAt(index);
  }

  return { u8int, mimeType };
};

const getImageFile = (image, { filename }) => {
  const hiddenCanvas = document.createElement('canvas');
  hiddenCanvas.style.display = 'none';

  hiddenCanvas.width = image.width;
  hiddenCanvas.height = image.height;

  const ctx = hiddenCanvas.getContext('2d');
  ctx.putImageData(image, 0, 0);

  const parsedDataUrl = parseDataUrl(ctx.canvas.toDataURL());

  return new File([parsedDataUrl.u8int], filename,
    { type: parsedDataUrl.mimeType });
};

const showImage = (ctx, imageSrc) => {
  const img = new Image();
  img.src = imageSrc;

  img.onload = () => {
    const imageWidth = 500;
    const imageHeight = height(500, aspectRatio(img));
    ctx.drawImage(img, 50, 50, imageWidth, imageHeight);

    const _img = ctx.getImageData(50, 50, imageWidth, imageHeight);
    const imageFile = getImageFile(_img, { filename: 'mon.jpeg' });
    uploadFiles([imageFile]);
  };
};

const main = () => {
  const canvas = document.getElementById('view');
  if (!canvas) return;

  const fileInput = document.getElementById('imageInput');

  const width = 600;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, width, height);
  ctx.width = width;
  ctx.height = height;

  fileInput.oninput = (event) => {
    const [file] = event.target.files;
    if (file) {
      readImageFile(file, (imgDataUrl) => {
        showImage(ctx, imgDataUrl);
      });
    }
  };
};

window.onload = main;
