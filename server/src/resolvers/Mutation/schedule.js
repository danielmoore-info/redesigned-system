const { getUserId } = require('../../utils')

const schedule = {
  async createSchedule(parent, {time, medications, takenTime}, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createSchedule(
      {
        data: {
          time,
          takenTime,
          patient: {
            connect: { id: userId },
          },
          medications: {
            connect: medications
          }
        },
      },
      info
    )
  },

  async updateSchedule(parent, {id, time, medications, takenTime}, ctx, info) {
    const userId = getUserId(ctx)
    const scheduleExists = await ctx.db.exists.Schedule({
      id,
      patient: {
        id: userId
      },
    })
    if (!scheduleExists) {
      throw new Error(`Schedule not found`)
    }
    return ctx.db.mutation.updateSchedule(
      {
        where:{id},
        data: {
          time: time,
          medications: {
            connect: medications
          },
          takenTime: takenTime
        }
      },
      info
    )
  },
  async deleteSchedule(parent, {id}, ctx, info) {
    const userId = getUserId(ctx)
    const scheduleExists = await ctx.db.exists.Schedule({
      id,
      patient: {
        id: userId
      }
    })
    if (!scheduleExists) {
      throw new Error(`Schedule not found.`)
    }
    return ctx.db.mutation.deleteSchedule({where:{id}})
  }
}   

module.exports = {schedule}