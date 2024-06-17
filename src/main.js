// Copy everything

class v_co {
    constructor() { }

    // Copy text
    async txt(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log("Copy successfully to Clipboard!");
        } catch (err) {
            console.error("Unable to copy to clipboard: ", err);
        }
    }
}

export default new v_co();