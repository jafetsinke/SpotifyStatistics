import { SpotifyImage } from "./spotify";

// takes an array of objects and returns the average of the key, undefined values are interpreted as 0
export function averageOfKeyInArray(key: string, array: any[]) {
  const average = array.reduce((total, next) => total + next ? next[key]: 0, 0)/ array.length;
  return isNaN(average) ? "N/A" : average;
}

// takes an array of objects and returns the median of the key
export function medianOfKeyInArray(key: string, array: any[]) {
  const values = array.map((item) => item[key]);
  const sorted = values.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2) {
    return sorted[middle];
  } else {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }  
}

// returns a random number between min and max, not rounded
export function randomNum(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// returns the album art url for a track that has the nearest resolution to the size parameter
export function getImageURLWithTargetResolution(images: SpotifyImage[], size: number) {
  if (images.length === 1) {
    return images[0].url;
  } else if (images.length > 1) {
    let closestImage = images[0];
    let closestDiff = Math.abs(closestImage.width - size);
    for (const image of images) {
      const diff = Math.abs(image.width - size);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestImage = image;
      }
    }
    return closestImage.url;
  } else {
    return "/album-art-placeholder.jpg";
  }
}