export const isLatinString = (str: string) => {
    const regExp = new RegExp('[a-zA-a]')

    return regExp.test(str)
}
type TFileSaverProps = { content: string, filename?: string, contentType?: string }

export function fileSaver({content, filename, contentType}: TFileSaverProps) {
    if (!contentType) contentType = 'application/octet-stream';
    if (!filename) {
        filename = `translationDb${Date.now()}.json`;
    }

    const a = document.createElement('a');
    const blob = new Blob([content], {'type': contentType});

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

export function debounce<F extends Function>(cb: F, delay = 250) {
    let timeout: NodeJS.Timeout

    return <A>(...args: A[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

export function throttle<F extends Function>(cb: F, delay = 250) {
    let shouldWait = false

    return  <A>(...args: A[]) => {
        if (shouldWait) return

        cb(...args)
        shouldWait = true
        setTimeout(() => {
            shouldWait = false
        }, delay)
    }
}
