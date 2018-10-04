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
}   

module.exports = {medication}