import { PackageAnalyzerFactory } from './analyzer-factory';
import { PackageMetadata } from './types';

export * from './types';
export * from './errors';
export * from './analyzers/apk';

export async function analyzePackage(filePath: string): Promise<PackageMetadata> {
    const analyzer = await PackageAnalyzerFactory.createAnalyzer(filePath);
    return analyzer.analyze(filePath);
}