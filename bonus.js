/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs)
{
    const sortedArr = strs.sort();
    const firstLetter = sortedArr[0];
    const lastLetter = sortedArr[sortedArr.length - 1];

    // console.log({ firstLetter, lastLetter });
    
    let commonPrefix = [];
    
    for (let i = 0; i < firstLetter.length; i++)
    {
        if (firstLetter[i] !== lastLetter[i])
        {
            break;
        }
        commonPrefix.push(firstLetter[i]);
    }

    return commonPrefix.join("");
};


const arr = ["ab","abc","abcd"]

console.log(longestCommonPrefix(arr));