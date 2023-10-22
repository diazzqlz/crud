import { prisma } from "../database/prisma-client";
import { Contact, ContactCreate, ContactRepository, ContactCreateData } from "../interfaces/contacts-interface";

export class ContactRepositoryPrisma implements ContactRepository{
  async create(data: ContactCreateData): Promise<Contact> {
    const result = await prisma.contact.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        user_id: data.user_id
        
      }
    })

    return result
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<Contact | null> {
    const result = await prisma.contact.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    return result || null
  }

  async findAllContacts(user_id: string): Promise<Contact[]> {
    const result = await prisma.contact.findMany({
      where: {
        user_id
      }
    })

    return result
  }

  async updateContact({ id, name, email, phone }: Contact): Promise<Contact> {
    const result = await prisma.contact.update({
      where: {
        id
      },
      data: {
        email,
        name, 
        phone
      }
    })

    return result
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.contact.delete({
      where: {
        id
      }
    })

    return result ? true : false
  }
}