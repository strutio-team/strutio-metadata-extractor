export interface PackageMetadata {
    packageName: string;
    versionName: string;
    versionCode: string;
    minOsVersion: string;
    platform: string;
    extractedAt: Date;
    additionalInfo?: {
        permissions?: string[];
        features?: string[];
        targetSdkVersion?: string;
        compileSdkVersion?: string;
        provisioningProfile?: string;
        companyName?: string;
        fileDescription?: string;
        architecture?: string;
        isDotNet?: boolean;
    };
}

export interface PackageAnalyzer {
    /**
     * Checks if a file can be analyzed by this analyzer
     * @param {String | File | Blob} file - File path in Node.js, or File/Blob instance in Browser
     * @returns {Promise<boolean>} Whether the file can be analyzed
     */
    canAnalyze(file: File | string): Promise<boolean>;

    /**
     * Analyzes the given file and extracts package metadata
     * @param {String | File | Blob} file - File path in Node.js, or File/Blob instance in Browser
     * @returns {Promise<PackageMetadata>} Extracted metadata from the package
     * @throws {AnalysisError} If analysis fails or file is invalid
     */
    analyze(file: File | string): Promise<PackageMetadata>;
}