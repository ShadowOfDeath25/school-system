if (!Array.prototype.contains) {
    Array.prototype.contains = function (subArray) {
        if (Array.isArray(subArray)) {
            return subArray.every(v => this.includes(v));
        }
        return this.includes(subArray)
    };
}
