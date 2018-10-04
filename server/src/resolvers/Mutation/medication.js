const { getUserId } = require('../../utils')

const medication = {
  async createMedication(parent, {name, count}, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createMedication(
      {
        data: {
          name,
          count,
          patient: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },

  async updateMedication(parent, {id, name, count}, ctx, info) {
    const userId = getUserId(ctx)
    const medicationExists = await ctx.db.exists.Medication({
      id,
      patient: {
        id: userId
      },
    })
    if (!medicationExists) {
      throw new Error(`Medication not found`)
    }
    return ctx.db.mutation.updateMedication(
      {
        where:{id},
        data: {
          name: name,
          count: count,
        }
      },
      info
    )
  },
}   

module.exports = {medication}