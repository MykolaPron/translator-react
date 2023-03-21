export  const isLatinString = (str: string) => {
    const regExp = new RegExp('[a-zA-a]')

    return regExp.test(str)
}
