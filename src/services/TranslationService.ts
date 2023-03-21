export const getTranslation = async (str: string,lang={from:'uk', to: 'en'}) => {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${lang.from}&tl=${lang.to}&dt=t&q=${str}`
        )
        if (response.status !== 200) {
            console.warn(response)
            return str
        }

        const data = await response.json()
        const body = data && data[0] && data[0][0] && data[0].map((s: undefined[]) => s[0]).join("");

        return body ? body : str
    } catch (error) {
        console.warn(error)
        return str
    }

}

export const getTranscription = async (str: string) => {
    try {
        const response = await fetch(
            'https://tophonetics-api.ajlee.repl.co/api?text=' + str + '&dialect=am'
        )
        if (response.status !== 200) {
            console.warn(response)
            return str
        }
        return await response.text()
    } catch (error) {
        console.warn(error)
        return str
    }
}
