import { MATERIALI_SECTIONS, type MaterialeSection } from './materialiData';

export interface Raccolta {
  id: string;
  title: string;
  badge: string;
  description: string;
  iconName?: string;
  sections: MaterialeSection[];
  updatedAt?: string;
}

/**
 * ELENCO DELLE RACCOLTE DISPONIBILI
 * 
 * Per aggiungere una nuova raccolta in futuro (es. "Appunti Tributario"):
 * Aggiungi un nuovo oggetto a questo array con:
 * - id: identificatore univoco (stringa senza spazi)
 * - title: titolo della raccolta
 * - badge: etichetta categoria (es. "Diritto Tributario", "Ragioneria", ecc.)
 * - description: descrizione breve del contenuto
 * - iconName: 'GraduationCap' | 'BookOpen' | 'Scale' | 'Calculator' | 'FileText' | 'Briefcase' | 'Layers'
 * - sections: array di sezioni (ognuna con id, title, category, summary, content, ecc.)
 * 
 * Non è necessario toccare il codice della UI: la piattaforma creerà automaticamente
 * la card al Livello 1 e gestirà filtri, ricerca e lettura al Livello 2.
 */
export const RACCOLTE: Raccolta[] = [
  {
    id: 'esame-stato-completo',
    title: "Appunti e Schemi per l'Esame di Stato",
    badge: "Manuale Generale",
    description: "Trattazione completa in 77 capitoli con aspetti civilistici, fiscali e scritture contabili commentate per la preparazione all'abilitazione professionale.",
    iconName: "GraduationCap",
    sections: MATERIALI_SECTIONS,
    updatedAt: "2025-10-15"
  }
];

export function getRaccoltaById(id: string): Raccolta | undefined {
  return RACCOLTE.find(r => r.id === id);
}

export function getRaccoltaCategories(raccolta: Raccolta): string[] {
  return Array.from(new Set(raccolta.sections.map(s => s.category)));
}
