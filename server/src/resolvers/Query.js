const { getUserId } = require('../utils')

const Query = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx, info) {
    const id = getUserId(ctx)

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  medications(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const where = {
      patient: {
        id
      }
    }
    return ctx.db.query.medications({
      where,
      orderBy:'updatedAt_DESC'
    }, info)
  },

  schedules(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const where = {
      patient: {
        id
      },
    }
    return ctx.db.query.schedules({
      where
    }, info)
  }
}

module.exports = { Query }
