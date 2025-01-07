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
    canAnalyze(file: File | string): Promise<boolean>;
    analyze(file: File | string): Promise<PackageMetadata>;
}