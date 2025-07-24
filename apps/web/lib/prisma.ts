// Mock database para desarrollo sin Prisma
export const prisma = {
  user: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
    delete: async () => ({ id: '1' })
  },
  property: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
    delete: async () => ({ id: '1' })
  },
  inspection: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
    delete: async () => ({ id: '1' })
  }
}

export default prisma