/**
 * Utilitários de imagem.
 *
 * Fotografias provisórias são servidas pelo CDN do Unsplash, que entrega AVIF/WebP
 * conforme o navegador (`auto=format`) e redimensiona sob demanda (`w=`).
 * Quando o acervo real da Duetto for adicionado, basta trocar `src` por um caminho
 * local em /public/acervo/... e definir `provisional: false` em src/data/projects.ts.
 */
import type { Photo } from '../data/projects';

const WIDTHS = [320, 480, 640, 800, 1200, 1600, 2200];

const isRemote = (src: string) => src.startsWith('photo-');

export function photoUrl(photo: Photo, width: number, quality = 68) {
  if (isRemote(photo.src)) {
    return `https://images.unsplash.com/${photo.src}?w=${width}&q=${quality}&auto=format&fit=max`;
  }
  return photo.src;
}

/** srcset limitado à maior largura útil para o espaço que a imagem ocupa. */
export function photoSrcset(photo: Photo, maxWidth = 2200) {
  if (!isRemote(photo.src)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${photoUrl(photo, w)} ${w}w`)
    .join(', ');
}

/** Cor dominante aproximada usada como fundo enquanto a imagem carrega. */
export function photoTone(photo: Photo) {
  return photo.tone ?? '#2a211c';
}
