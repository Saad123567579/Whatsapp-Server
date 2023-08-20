import getprismaClient from "../client/prismaClient.js";

export const addMessage = async (req, res) => {
  try {
    const prisma = getprismaClient();
    const { message, from, to } = req.body;

    // Assuming onlineUsers is correctly defined and has the online status
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const msg = await prisma.message.create({
        data: {
          message,
          sender: { connect: { id: from } },
          receiver: { connect: { id: to } },
          status: getUser ? "seen" : "sent",
        },
        include: { sender: true, receiver: true },
      });

      return res.status(200).json(msg);
    } else {
      return res.status(400).json("Invalid data");
    }
  } catch (e) {
    
    return res.status(500).json("Internal Server Error");
  }
}

export const getMessages = async(req,res) => {
  try{
    const prisma = getprismaClient();
    const {from,to} = req.params;
    const messages = await prisma.message.findMany({
      where:{
        OR:[
          {
            senderId:from,
            receiverId:to
          },
          {
            senderId:to,
            receiverId:from
          }
        ]
      },
      orderBy:{id:"asc"}
    })
    if(!messages) return res.status(404).json("Empty");
    const unreadMessages = [];
    messages.forEach ( (message,index)=>{
      if(message.status !== "seen" && message.senderId===to){
        messages[index].status = "seen";
        unreadMessages.push(message.id);
      }
    })
    await prisma.message.updateMany({
      where:{id:{in:unreadMessages},
    },
    data:{status:"seen"}
    })
    return res.status(200).json(messages);

  } catch(e) {
    return res.status(500).json("Internal Server Error");
  }
}
