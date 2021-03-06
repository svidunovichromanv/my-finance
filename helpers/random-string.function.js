"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomString = void 0;
const allSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function getRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += allSymbols[Math.floor(Math.random() * allSymbols.length)];
    }
    return result;
}
exports.getRandomString = getRandomString;
//# sourceMappingURL=random-string.function.js.map