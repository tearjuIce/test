import React from 'react'

const ImageComponent = React.memo(({ tokenSymbol }: { tokenSymbol: string }) => {
    const [url, setUrl] = React.useState("")

    const getImageURL = async () => {
        const imageUrl = `${import.meta.env.VITE_ICON_REPOSITORY}/${tokenSymbol}.svg`;
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error(`Failed to load image for ${tokenSymbol}: ${response.statusText}`);
                return "";
            }
            setUrl(imageUrl)
        } catch (error) {
            console.error(`Error fetching image for ${tokenSymbol}:`, error);
            return "";
        }
    }

    React.useEffect(() => {
        getImageURL()
    }, [])

    return (
        <img src={url} style={styles.img} />
    )
})

const styles = {
    img: {
        height: "20px",
        width: "20px"
    } as React.CSSProperties
}

export default ImageComponent