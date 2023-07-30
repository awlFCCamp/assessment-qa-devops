const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  // CODE HERE

  //check that shuffle returns an array
  test("returns an array", () => {
    const inputArray = [100, 21, 334];
    const shuffledArray = shuffle(inputArray);
    expect(Array.isArray(shuffledArray)).toBe(true);
  });

  test("returns an empty array for empty input", () => {
    const inputArray = [];
    const shuffledArray = shuffle(inputArray);
    expect(shuffledArray).toEqual([]);
  });

  //check that it returns an array of the same length as the argument sent in
  test("returns an array of the same length as the input", () => {
    const inputArray = [21, 567, 29000, 1000, 1, 209];
    const shuffledArray = shuffle(inputArray);
    expect(shuffledArray).toHaveLength(inputArray.length);
  });

  //check that all the same items are in the array
  test("contains all the same items as the input", () => {
    const inputArray = [101, 22, 43, 124, 1205];
    const shuffledArray = shuffle(inputArray);

    // Check if shuffledArray contains all items from inputArray
    expect(shuffledArray).toEqual(expect.arrayContaining(inputArray));

    // Check if inputArray contains all items from shuffledArray
    expect(inputArray).toEqual(expect.arrayContaining(shuffledArray));
  });

  //check that the items have been shuffled around

  test("items have been shuffled around", () => {
    const inputArray = [1010, 2, 301, 214, 105];
    const shuffledArray = shuffle(inputArray);

    // Check if shuffledArray is not equal to inputArray
    expect(shuffledArray).not.toEqual(inputArray);
  });
});
