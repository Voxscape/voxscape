export const apiRoutes = {
  vox: {
    models: {
      index: `/api/vox/models`,
      byId: (modelId: number) => `/api/vox/models/${modelId}`,
    },
    views: {},
    upload: `/api/vox/upload`,
  },
} as const;
