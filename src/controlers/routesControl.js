const bcrypt = require('bcryptjs');
const { PrismaClient } = require("@prisma/client")
const jwk  = require("jsonwebtoken");
const prisma = new PrismaClient();

async function obterUsuario(login){
  const user = await prisma.users.findFirst({
    where: { 
      login:{
        equals: login,
        mode: 'insensitive'
      }
    }
  });

  return user;
}

async function obterAllUsers(login){
  const users = await prisma.users.findMany();

  return users;
}

async function createUser(login, email, senha){
  const user = await prisma.users.create({
    data:{
      login,
      email,
      password_hash: await bcrypt.hash(senha, 10)
    }
  });

  return user;
}

async function updateUser(id, login, email, senha){
  const user = await prisma.users.update({
    where: {
      id: id,
    },
    data:{
      login,
      email,
      password_hash: await bcrypt.hash(senha, 10),
      isadmin
    }
  });

  return user;
}

async function deleteUser(login){
  const user = await prisma.users.findFirst({
    where: {
      login: {
        equals: login,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
    });

    // Se o usuário for encontrado
  if (user) {
    // Excluir a linha de acordo com o ID
    const result = await prisma.users.delete({
      where: {
        id: user.id,
      },
    });
    return true
  } else {
    // Se o usuário não for encontrado, lidar com o erro
    console.error("Usuário não encontrado.");
    return false
  }
}

async function validarToken(login, token){
  const user = await prisma.usertoken.findFirst({
    where: { 
      login:{
        equals: login,
        mode: 'insensitive'
      }, AND : {
        token: token
      }
    }
  });
  
  if(!user) 
    return false;
  else 
    return true;
}

async function isConnected(login){
  const user = await prisma.usertoken.findFirst({
    where: { 
      login:{
        equals: login,
        mode: 'insensitive'
      }
    }
  });
  
  if(!user) 
    return false;
  else 
    return true;
}

//-----------------------------------------------------------------


async function validUser(login, pwd){
  try {
    const result = await obterUsuario(login)
    const isPasswordValid = await bcrypt.compare(pwd, result.password_hash);

    if (!isPasswordValid) {
      return false;
    }

    return [true, result.isadmin];
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function isUserConnected(login){
  try {
    return await isConnected(login);
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function validToken(login, token){
  try {
    const result = await validarToken(login, token)

    if (!result) {
      console.log('Invalid token');
      return false
    }
  
    console.log('Valid token');    
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function deleteToken(login){
  // Buscar o ID do usuário
  const user = await prisma.usertoken.findFirst({
    where: {
      login: {
        equals: login,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
    });

    // Se o usuário for encontrado
  if (user) {
    // Excluir a linha de acordo com o ID
    const result = await prisma.usertoken.delete({
      where: {
        id: user.id,
      },
    });
  } else {
    // Se o usuário não for encontrado, lidar com o erro
    console.error("Usuário não encontrado.");
  }
}

async function salvarToken(login, token){
    try {
      const tokenaccess = await prisma.users.create({
        data:{
          login,
          token
        }
      });
      return tokenaccess;
    } catch (err) {
        console.error(err);
    }
}

function generateToken(login, pwd){
  const user = {
      login: login,
      pwd: pwd
  };
    
  const secretKey = "secret";  
  const token = jwk.sign(
      { id: user.id, login: user.login },
      secretKey,
      { expiresIn: '1h' }
    );
    
  console.log(token);
  return token;
}

module.exports = {
    validUser,
    validToken,
    deleteToken,
    isUserConnected,
    salvarToken,
    deleteUser,
    updateUser,
    createUser,
    obterAllUsers,
    generateToken
};

