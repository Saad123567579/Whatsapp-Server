import getprismaClient from "../client/prismaClient.js";
const JWT_SECRET_KEY = "12345678910";
import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  const prisma = getprismaClient();
  let email = req.body.email;
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ status: false });
  const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
    expiresIn: "24hr",
  });
  res.cookie(String("token"), token, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400),
  });
  return res.status(200).json({ status: true });

}

export const createUser = async (req, res) => {
  const prisma = getprismaClient();

  try {
    const { name, email, image, about } = req.body;
    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        about,
        image, // You should hash the password before saving it to the database
      },
    });
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET_KEY, {
      expiresIn: "24hr",
    });
    res.cookie(String("token"), token, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 86400),
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const Getuser = async (req, res) => {

  try {
    const token = req.cookies.token;
    const prisma = getprismaClient();
    if (!token) {
      return res.status(200).json("Token Not Found");
    }
    jwt.verify(String(token), JWT_SECRET_KEY, async (error, info) => {
      if (error) {
        return res.status(404).json("Invalid Token");
      }
      console.log(info);
      let user = await prisma.user.findUnique({ where: { id: info?.id } });
      if (!user) return res.status(404).json("False")
      return res.status(200).json(user);
    });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

export const Getallusers = async (req, res) => {
  try {
    const token = req.cookies.token;
    const prisma = getprismaClient();
    const users = await prisma.user.findMany();

    const loggedInUser = token ? await getLoggedInUser(token, prisma) : null;

    const userObj = {};

    for (const user of users) {
      if (!loggedInUser || loggedInUser.id !== user.id) {
        const firstLetter = user.name[0].toUpperCase();
        if (!userObj[firstLetter]) {
          userObj[firstLetter] = [];
        }
        userObj[firstLetter].push(user);
      }
    }

    const sortedKeys = Object.keys(userObj).sort();

    const sortedUsersArray = sortedKeys.map((key) => {
      return {
        letter: key,
        entries: userObj[key],
      };
    });

    return res.status(200).json(sortedUsersArray);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Internal Server Error");
  }
};

async function getLoggedInUser(token, prisma) {
  return new Promise((resolve, reject) => {
    jwt.verify(String(token), JWT_SECRET_KEY, async (error, info) => {
      if (error) {
        reject(error);
      }
      const loggedInUser = await prisma.user.findUnique({ where: { id: info?.id } });
      resolve(loggedInUser);
    });
  });
}







// export const Logout = async (req, res) => {
//   try {
//     res.clearCookie("token");

//     return res.status(200).json('Successfully logged out');
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json("Internal Server Error")
//   }
// }