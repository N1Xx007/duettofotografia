/**
 * Informações institucionais da Duetto.
 * Fonte: Manual da Marca Duetto (Agência Zenith Company, outubro de 2026).
 *
 * Campos marcados como `null` ainda não foram fornecidos pelo estúdio.
 * Enquanto estiverem vazios, o site simplesmente não exibe aquele canal
 * (nenhum contato fictício é apresentado ao visitante).
 */
export const site = {
  name: 'Duetto Estúdio Fotográfico',
  shortName: 'Duetto',
  tagline: 'Dois olhares, um só clique',
  city: 'Goiânia',
  state: 'GO',
  url: 'https://www.duettoestudio.com.br', // TODO: confirmar domínio definitivo
  description:
    'Estúdio de fotografia e audiovisual em Goiânia, criado por duas irmãs. Retratos, ensaios, gestantes, famílias, celebrações e imagem profissional para pessoas e marcas.',

  contact: {
    // Confirmado: link publicado pelo próprio estúdio.
    instagram: { handle: '@duettoestudiofotografico', url: 'https://www.instagram.com/duettoestudiofotografico' },
    // TODO: informar número no formato internacional, só dígitos (ex.: 5562999999999)
    whatsapp: null as string | null,
    // TODO: informar e-mail de atendimento
    email: null as string | null,
    // TODO: informar endereço do estúdio
    address: null as string | null,
  },

  /** Nomes das sócias — TODO: confirmar com o estúdio. */
  founders: null as [string, string] | null,
};

export function whatsappUrl(message = 'Olá, Duetto! Quero conversar sobre um ensaio.') {
  const n = site.contact.whatsapp;
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : null;
}

/** Canal principal de conversa: WhatsApp quando houver; senão, Instagram. */
export function primaryContact() {
  const wa = whatsappUrl();
  if (wa) return { href: wa, label: 'Conversar pelo WhatsApp' };
  if (site.contact.email) return { href: `mailto:${site.contact.email}`, label: 'Enviar um e-mail' };
  return { href: site.contact.instagram.url, label: 'Conversar pelo Instagram' };
}
