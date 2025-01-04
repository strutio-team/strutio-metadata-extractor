// src/analyzers/ipa.ts
import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';

export class IpaAnalyzer implements PackageAnalyzer {
    private IpaParser: any;

    constructor() {
        try {
            // Use specific parser for better performance
            this.IpaParser = require('app-info-parser/src/ipa');
        } catch (error) {
            throw new Error('app-info-parser module is required for IPA analysis');
        }
    }

    async canAnalyze(file: File): Promise<boolean> {
        if (!file) {
            return false;
        }

        try {
            // Check if file extension is .ipa
            if (!file.name.toLowerCase().endsWith('.ipa')) {
                return false;
            }

            // Create blob from file for parser
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            const parser = new this.IpaParser(blob);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(file: File): Promise<PackageMetadata> {
        try {
            // Convert File to Blob for parser
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            const parser = new this.IpaParser(blob);
            const result = await parser.parse();

            if (!result.CFBundleIdentifier) {
                throw new AnalysisError('Invalid IPA: missing bundle identifier');
            }

            return {
                packageName: result.CFBundleIdentifier,
                versionCode: result.CFBundleVersion || 'unknown',
                versionName: result.CFBundleShortVersionString || 'unknown',
                minOsVersion: this.extractMinOsVersion(result),
                platform: 'ios',
                extractedAt: new Date(),
                additionalInfo: {
                    provisioningProfile: result.mobileProvision.Name
                }
            };
        } catch (error) {
            if (error instanceof AnalysisError) {
                throw error;
            }
            throw new AnalysisError(
                `Failed to analyze IPA: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    private extractMinOsVersion(result: any): string {
        try {
            return result.MinimumOSVersion?.toString() || 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }
}