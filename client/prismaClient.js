import prismaClient, { PrismaClient } from "@prisma/client";


function getPrismaClient(){
    
    let client = new PrismaClient();
    
    return client;
}

export default getPrismaClient;