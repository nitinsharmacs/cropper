const readFile = (file, cb) => {
  const reader = new FileReader();
  reader.onload = () => {
    cb(reader.result);
  };

  reader.readAsDataURL(file);
};

const height = (dim, aspectRatio) => {
  return (1 / aspectRatio) * dim;
};

const aspectRatio = (image) => {
  return image.width / image.height;
};


const putImage = (ctx, imageUrl) => {
  const img = new Image();

  img.onload = () => {
    const imageWidth = ctx.canvas.width;
    const imageHeight = height(imageWidth, aspectRatio(img));
    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  };

  img.src = imageUrl;
};

const getCroppedImage = (ctx, selector) => {
  console.log(selector);
  return ctx.getImageData(selector.pos.x,
    selector.pos.y,
    selector.width,
    selector.height
  );
};

const setupImageCanvas = (cropArea) => {
  const [cropAreaRects] = cropArea.getClientRects();

  const imageViewCanvas = document.getElementById('image-view');

  imageViewCanvas.width = cropAreaRects.width;
  imageViewCanvas.height = cropAreaRects.height;

  const ctx = imageViewCanvas.getContext('2d');
  return ctx;
};


const main = () => {
  const cropArea = document.getElementById('crop-area');
  const imageInputBtn = document.getElementById('imageInput');
  const cropBtn = document.getElementById('crop-btn');

  const selectorConfig = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    controlPoint: {
      width: 20,
      height: 20
    }
  }
  const selector = createSelector(selectorConfig);
  let selected = false;

  const ctx = setupImageCanvas(cropArea);

  imageInputBtn.oninput = (event) => {
    const [imageFile] = event.target.files;

    readFile(imageFile, (imageDataUrl) => {
      putImage(ctx, imageDataUrl);
      renderSelector(cropArea, selector);
      selected = true;
    });
  };

  cropBtn.onclick = () => {
    if (selected) {
      const image = getCroppedImage(ctx, selector);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.putImageData(image, 0, 0);
      document.getElementById('cropper-selector').remove();
    }
  }
};

window.onload = main;
