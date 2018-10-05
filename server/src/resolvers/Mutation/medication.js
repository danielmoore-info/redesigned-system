const { getUserId } = require('../../utils')

const medication = {
  async createMedication(parent, {name, count, dispenser, dose}, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createMedication(
      {
        data: {
          name,
          count,
          dispenser,
          dose,
          patient: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },

  async updateMedication(parent, {id, name, count, dose}, ctx, info) {
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
          dose: dose,
        }
      },
      info
    )
  },

  async updatePatientMedication(parent, {id, name, count, dose, patientId}, ctx, info){
    const userId = getUserId(ctx)
    const medicationExists = await ctx.db.exists.Medication({
      id,
      patient: {
        id: patientId
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
          dose: dose,
        }
      },
      info
    )

  },
  async deleteMedication(parent, {id}, ctx, info) {
    const userId = getUserId(ctx)
    const medicationExists = await ctx.db.exists.Medication({
      id,
      patient: {
        id: userId
      }
    })
    if (!medicationExists) {
      throw new Error(`Medication not found.`)
    }
    return ctx.db.mutation.deleteMedication({where:{id}})
  }
}   

module.exports = {medication}