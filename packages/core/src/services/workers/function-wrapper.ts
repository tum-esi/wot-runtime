// // function-wrapper: https://trackjs.com/blog/how-to-wrap-javascript-functions/#:~:text=Wrapping%20JavaScript%20functions%20lets%20you,functions%20to%20do%20their%20work
// const originalFunction = myFunction;
// window.myFunction = function myFunction(a, b, c) {
//   /* #1 */
//   /* work before the function is called */
//   try {
//     const returnValue = originalFunction.apply(this, arguments); /* #2 */
//     /* work after the function is called */
//     return returnValue;
//   } catch (e) {
//     /* work in case there is an error */
//     throw e;
//   }
// };
// for (const prop in originalFunction) {
//   /* #3 */
//   if (originalFunction.hasOwnProperty(prop)) {
//     window.myFunction[prop] = originalFunction[prop];
//   }
// }
