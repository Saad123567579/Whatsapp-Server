import getprismaClient from "../client/prismaClient.js";


export const checkAuth = async(req,res,next) => {
    const prisma = getprismaClient();
    let email = req.body.email;
    const user = await prisma.user.findUnique({where:{email}})
    if(!user) return res.status(404).json({status:false});
    return res.status(200).json({status:true});

}