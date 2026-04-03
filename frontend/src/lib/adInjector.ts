// frontend/src/lib/adInjector.ts

export interface AdData {
  id: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
}

/**
 * Injects ads into HTML content safely after every 2 paragraphs.
 * Does not break semantic structure.
 */
export function injectInContentAds(htmlContent: string, inContentAds: AdData[]): string {
  if (!htmlContent || !inContentAds || inContentAds.length === 0) {
    return htmlContent;
  }

  // Split content by closing paragraph tags
  const paragraphs = htmlContent.split('</p>');
  let newContent = '';
  let adIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    // Re-append the closing tag unless it's the very last empty split
    const pSegment = paragraphs[i].trim();
    if (pSegment) {
       newContent += pSegment + '</p>';
    }

    // Inject 1 ad after every 2nd paragraph
    if ((i + 1) % 2 === 0 && i < paragraphs.length - 1) {
      // Modulo ensures we loop through all ads fairly if paragraphs > ads
      const ad = inContentAds[adIndex % inContentAds.length];
      
      const adHtml = `
        <div class="in-content-ad-wrapper my-8 flex flex-col items-center justify-center w-full clear-both">
          <span class="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-sans">Advertisement</span>
          <a href="${ad.linkUrl || '#'}" target="_blank" rel="noopener noreferrer nofollow" class="block w-full max-w-[728px] mx-auto transition-opacity hover:opacity-95">
            <img 
              src="${ad.imageUrl}" 
              alt="${ad.title || 'Advertisement'}" 
              loading="lazy" 
              class="w-full h-auto max-h-[250px] object-contain rounded-xl border border-gray-100 shadow-sm mx-auto" 
            />
          </a>
        </div>
      `;
      newContent += adHtml;
      adIndex++;
    }
  }

  return newContent;
}