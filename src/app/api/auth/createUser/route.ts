// pages/api/createUser.ts
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import {NextResponse} from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req:Request,res:Response) {

  const { name, email, pin, role } = await req.json();

  console.log(name, email, pin, role)

  try {

    // Verifica se o e-mail já está em uso
    const existingEmailUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmailUser) {
    return  NextResponse.json({ error: 'O email do utilizador já existe' }, { status: 400 });
    }


      // Verifica se o nome já está em uso
      const existingUserName = await prisma.user.findUnique({
        where: {
          username: name,
        },
      });
  
      if (existingUserName) {
        return  NextResponse.json({ error: 'O nome do utilizador já existe' }, { status: 400 });
      }



      const pinInt = Number(pin)



    // Insere os dados na base de dados usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        username: name,
        email: email,
        pin: pinInt,
        role: role,
      },
    });

    console.log('Novo usuário criado:', newUser);

    // Retorna uma resposta de sucesso
    return NextResponse.json({ message: 'User created successfully', user: newUser },{ status: 200 });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error.message);
    console.error('Detalhes do erro:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message , stack: error.stack }, { status: 500 });
  } finally {
    // Fecha a conexão do Prisma Client quando não for mais necessária
    await prisma.$disconnect();
  }
}
