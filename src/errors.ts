export class UnsupportedPackageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnsupportedPackageError';
    }
}

export class AnalysisError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = 'AnalysisError';
    }
}