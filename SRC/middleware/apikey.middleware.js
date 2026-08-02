export const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.APIKEY) {
        return res.status(401).json({ message: 'API key no proporcionada' });
    }
    next();
}

