import getprismaClient from "../client/prismaClient.js";


export const checkAuth = async(req,res,next) => {
    const prisma = getprismaClient();
    let email = req.body.email;
    const user = await prisma.user.findUnique({where:{email}})
    if(!user) return res.status(404).json({status:false});
    return res.status(200).json({status:true});

}

export const createUser = async (req, res) => {
    const prisma = getprismaClient();
  
    try {
      const { name, email, image,about } = req.body;
      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          about,
          image, // You should hash the password before saving it to the database
        },
      });
  
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };