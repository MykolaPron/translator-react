export const isLatinString = (str: string) => {
    const regExp = new RegExp('[a-zA-a]')

    return regExp.test(str)
}
type TFileSaverProps = { content: string, filename?: string, contentType?: string }

export function fileSaver({content, filename, contentType}: TFileSaverProps) {
    if (!contentType) contentType = 'application/octet-stream';
    if (!filename) filename = 'translationDb.json';

    const a = document.createElement('a');
    const blob = new Blob([content], {'type': contentType});

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}
