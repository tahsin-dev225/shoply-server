import jwt from 'jsonwebtoken'

export const generateToken = ("/", async (req, res) => {
    const user = req.body;

    try {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate token" });
    }
});
