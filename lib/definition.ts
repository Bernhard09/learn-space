export type Section = {
    id: string;
    type: 'text' | 'image' | 'link' | 'code';
    content?: string;
    img?: string;
    link?: string;
}