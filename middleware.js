import { configDotenv } from "dotenv";
configDotenv();

const token = process.env.TOKEN || "token"

export default function authentication(request,response,next) {
    if(!request.headers.authorization) return response.status(401).json({message:"Unauthorized access."});
    let key = request.headers.authorization;
    key = key.split(" ")[1];
    if(token===key) next();
    else return response.status(401).json({message:"Unauthorized access."});
}