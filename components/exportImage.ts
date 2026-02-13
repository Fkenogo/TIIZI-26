type ExportOptions = {
  fileName?: string;
  scale?: number;
  backgroundColor?: string;
};

export const exportNodeAsPng = async (node: HTMLElement, options: ExportOptions = {}) => {
  const { fileName = 'tiizi-export.png', scale = 2, backgroundColor = '#ffffff' } = options;
  const rect = node.getBoundingClientRect();

  const cloned = node.cloneNode(true) as HTMLElement;
  cloned.style.margin = '0';
  cloned.style.width = `${rect.width}px`;
  cloned.style.height = `${rect.height}px`;
  cloned.style.background = backgroundColor;

  const serializer = new XMLSerializer();
  const serialized = serializer.serializeToString(cloned);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        ${serialized}
      </foreignObject>
    </svg>
  `;

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.crossOrigin = 'anonymous';

  const pngDataUrl = await new Promise<string>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(rect.width * scale));
      canvas.height = Math.max(1, Math.floor(rect.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(image, 0, 0);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = url;
  }).finally(() => {
    URL.revokeObjectURL(url);
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = pngDataUrl;
  link.click();
};
