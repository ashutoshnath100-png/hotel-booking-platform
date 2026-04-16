import jwt from "jsonwebtoken";

const auth = (req,resp,next) => {
    try {
        const token = req.headers.authorization;
    if(!token) {
        return resp.status(401).send("Access denied. No token provided.");
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    req.user = decoded;
    next();

    }
    catch (error) {
        resp.status(401).send("Invalid token");
    }

}

export default auth;