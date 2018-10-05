const { getUserId } = require('../../utils')

const schedule = {
  async createSchedule(parent, {time, medications, takenTime}, ctx, info) {
    const userId = getUserId(ctx)
    console.log(medications)
    return ctx.db.mutation.createSchedule(
      {
        data: {
          time,
          takenTime,
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