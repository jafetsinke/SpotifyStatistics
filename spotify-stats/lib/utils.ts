export function averageOfKeyInArray(key: string, array: any[]) {
  const average = array.reduce((total, next) => total + next[key], 0)/ array.length;
  return isNaN(average) ? "N/A" : average;
}

export function randomNum(min: number, max: number) {
  return Math.random() * (max - min) + min;
}