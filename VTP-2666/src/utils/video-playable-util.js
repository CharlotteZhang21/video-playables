export function checkIfShouldBeEnabled (to, from, currentTime) {
    if (to !== undefined && currentTime > to) {
        return false;
    }
    if (from !== undefined && currentTime >= from) {
        return true;
    }
    return false;
}
