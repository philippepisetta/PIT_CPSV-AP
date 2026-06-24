const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'cpsv-ap-app', 'src', 'hooks', 'useV2Queries.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const targetLine = "export function useV2ReferenceFrameworks() {";

const additionalHooks = `export function useV2S3Clusters() {
  return useQuery({
    queryKey: ["v2-s3-clusters"],
    queryFn: () => fetcher("/api/v2/s3-clusters"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3MarketApplications() {
  return useQuery({
    queryKey: ["v2-s3-market-applications"],
    queryFn: () => fetcher("/api/v2/s3-market-applications"),
    staleTime: 30 * 1000,
  });
}

`;

if (content.includes(targetLine)) {
  content = content.replace(targetLine, additionalHooks + "\n" + targetLine);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully appended s3-clusters and s3-market-applications hooks!');
} else {
  console.error('Target hook line not found in useV2Queries.ts');
}
