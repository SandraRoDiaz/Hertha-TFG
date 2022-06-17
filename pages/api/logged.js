import jwt from "jsonwebtoken";


export default async function (req, res) {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(" ")[1];
        const authUser = await jwt.verify(token, process.env.SECRET);
        const authorization = {
            token
        }
        return res.json({...authUser, authorization});
    } catch (error) {
        return res.status(403).json({error: "not a valid token"});
    }
}