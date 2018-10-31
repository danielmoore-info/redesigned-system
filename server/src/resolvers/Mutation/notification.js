const { getUserId } = require('../../utils')

const notification = {
  async createNotification(parent, {type, message}, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createNotification(
      {
        data: {
          type,
          message,
          user: {
            connect: {id: userId}
          }
        }
      }
    )
  },

  async deleteNotification(parent, {id}, ctx, info) {
    const userId = getUserId(ctx)
    const notificationExists = await ctx.db.exists.Notification({
      id,
      user: {
        id: userId
      }
    })

    if(!notificationExists) {
      throw new Error(`Notification not found.`)
    }

    return ctx.db.mutation.deleteNotification({where:{id}})
  }
}

module.exports = {notification}