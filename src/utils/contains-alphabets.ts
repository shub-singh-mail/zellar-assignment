export default function containsOnlyAlphabets(str: string) {
  // The test() method returns true if the string matches the pattern, otherwise false
  return /^[a-zA-Z]+$/.test(str);
}
