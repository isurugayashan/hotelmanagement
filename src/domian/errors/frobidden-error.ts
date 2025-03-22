class FrobiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FrobiddenError";
        
    }
}

export default FrobiddenError; 