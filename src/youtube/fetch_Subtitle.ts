import youtubedl from 'youtube-dl-exec';

export const audioHandler = async (url: string) => {
  try {
    const res = youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    }).then(async (output) => {
      // @ts-ignore
      const subtitle = output.automatic_captions.en[4];
      const fetchSubtitle = await fetch(subtitle.url);
      const subtitleText = await fetchSubtitle.text();
      const cleanText = subtitleText
        .replace(/<[^>]*>?/gm, '')
        .replace(/\n/g, '')
        .slice(0, 800);
      return cleanText;
    });
    return res;
  } catch (error) {
    return error;
  }
};
