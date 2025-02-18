export const formatMessageTime = () => {
    return new Date().toLocaleTimeString('en-US',
        {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    )
}