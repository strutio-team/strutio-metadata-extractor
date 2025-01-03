import { PackageAnalyzerFactory } from './analyzer-factory';
import { PackageMetadata } from './types';

export * from './types';
export * from './errors';
export * from './analyzers/apk';

export async function analyzePackage(file: File): Promise<PackageMetadata> {
    const analyzer = await PackageAnalyzerFactory.createAnalyzer(file);
    return analyzer.analyze(file);
}