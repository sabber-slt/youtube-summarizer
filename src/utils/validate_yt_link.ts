export function isYouTubeLikeValid(link: string): RegExpMatchArray {
    return link.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g);
}