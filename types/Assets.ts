export enum VideoAssetQuality {
  Preview = 'preview',
  Max = '',
}

export interface VideoAssetOptions {
  quality?: VideoAssetQuality;
}

export enum S3AssetBucket {
  Models = 'models',
  Collections = 'collections',
}
