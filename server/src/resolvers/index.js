const { Query } = require('./Query')
const { Subscription } = require('./Subscription')
const { auth } = require('./Mutation/auth')
const { post } = require('./Mutation/post')
const {medication} = require('./Mutation/medication')
const {schedule} = require('./Mutation/schedule')
const { AuthPayload } = require('./AuthPayload')
const {notification} = require('./Mutation/notification')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...medication,
    ...schedule,
    ...notification,
  },
  Subscription,
  AuthPayload,
}
