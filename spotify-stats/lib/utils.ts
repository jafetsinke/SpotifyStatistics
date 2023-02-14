// takes an array of objects and returns the average of the key
export function averageOfKeyInArray(key: string, array: any[]) {
  const average = array.reduce((total, next) => total + next[key], 0)/ array.length;
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