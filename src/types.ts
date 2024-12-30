export interface PackageMetadata {
    packageName: string;
    versionCode: string;
    versionName: string;
    minOsVersion: string;
    platform: string;
    extractedAt: Date;
}

export interface PackageAnalyzer {
    canAnalyze(filePath: string): Promise<boolean>;
    analyze(filePath: string): Promise<PackageMetadata>;
}