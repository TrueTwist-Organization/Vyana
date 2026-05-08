/** Serves files from `public/video for vyana/{folder}/` (folder names match the client zip). */
export function vyanaMp4Url(folder: 'residantial' | 'comracial' | 'industrial', filename: string): string {
  return '/' + ['video for vyana', folder, filename].map(encodeURIComponent).join('/');
}
