import {types, flow} from 'mobx-state-tree'
import apiCall from '../api'

export const User = types.model('User', {
    id: types.identifier,
    createdAt: types.string,
    name: types.string,
    avatar: types.string
})

const ActiveUser = User.named('ActiveUser')

const UsersStore = types.model('UsersStore', {
    users: types.maybe(types.array(User)),
    me: types.maybe(ActiveUser)
}).views(self => {
    return {
        get list() {
            if(self.users && self.users.length > 0) {
                return self.users.map(({id, name}) => ({id, name}))
            }

            return []
        }
    }
}).actions(self => {
    return {
        load: flow(function* () {
            self.users = yield apiCall.get('users')
            self.me = yield apiCall.get('me')
        }),
        afterCreate() {
            self.load()
        }
    }
})

export default UsersStore