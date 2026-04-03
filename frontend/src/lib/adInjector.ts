export interface AdData {
  id: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
}

const getValidUrl = (url?: string) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

/**
 * Injects ads into HTML content safely after every 2 paragraphs.
 * Randomly selects ads so different users see different ad combinations.
 */
export function injectInContentAds(htmlContent: string, inContentAds: AdData[]): string {
  if (!htmlContent || !inContentAds || inContentAds.length === 0) {
    return htmlContent;
  }

  const paragraphs = htmlContent.split('</p>');
  let newContent = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const pSegment = paragraphs[i].trim();
    if (pSegment) {
       newContent += pSegment + '</p>';
    }

    if ((i + 1) % 2 === 0 && i < paragraphs.length - 1) {
      const randomIndex = Math.floor(Math.random() * inContentAds.length);
      const ad = inContentAds[randomIndex];
      
      const adHtml = `
        <div class="my-10 w-full flex flex-col items-center justify-center p-4 rounded-2xl transition-colors" style="background: var(--bg3); border: 1px dashed var(--border);">
          <span class="text-[10px] uppercase tracking-widest mb-3 font-bold opacity-50" style="color: var(--text);">Advertisement</span>
          <a href="${getValidUrl(ad.linkUrl)}" target="_blank" rel="noopener noreferrer nofollow" class="block w-full max-w-[728px] mx-auto overflow-hidden rounded-xl shadow-md hover:opacity-90 hover:scale-[1.01] transition-all duration-300">
            <img 
              src="${ad.imageUrl}" 
              alt="${ad.title || 'Advertisement'}" 
              loading="lazy" 
              class="w-full h-auto max-h-[250px] object-contain mx-auto" 
            />
          </a>
        </div>
      `;
      newContent += adHtml;
    }
  }

  return newContent;
}