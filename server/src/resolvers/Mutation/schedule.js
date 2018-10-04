const { getUserId } = require('../../utils')

const schedule = {
  async createSchedule(parent, {time, medications}, ctx, info) {
    const userId = getUserId(ctx)
    console.log(medications)
    return ctx.db.mutation.createSchedule(
      {
        data: {
          time,
          patient: {
            connect: { id: userId },
          },
          medications: {
            connect: [
              medications
            ]
          }
        },
      },
      info
    )
  },
}   

module.exports = {schedule}