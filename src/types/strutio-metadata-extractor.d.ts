declare module 'strutio-metadata-extractor' {
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

    export function analyzePackage(file: File): Promise<PackageMetadata>;
}