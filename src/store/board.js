import {types, flow, getParent, cast, onSnapshot} from 'mobx-state-tree'
import apiCall from '../api'
import {User} from "./users";

const Task = types.model('Task', {
    id: types.identifier,
    title: types.string,
    description: types.string,
    assignee: types.safeReference(User)
})

const BoardSection = types.model('BoardSection', {
    id: types.identifier,
    title: types.string,
    tasks: types.array(Task)
}).actions(self => {
    return {
        load: flow(function* () {
            const {id: boardID} = getParent(self, 2);
            const {id: status} = self;

            const {tasks} = yield apiCall.get(`boards/${boardID}/tasks/${status}`);

            self.tasks = cast(tasks);

            onSnapshot(self, self.save)
        }),
        save: flow(function* ({tasks}) {
            const {id: boardID} = getParent(self, 2);
            const {id: status} = self;

            yield apiCall.put(`boards/${boardID}/tasks/${status}`, {tasks});
        }),
        afterCreate() {
            self.load();
        }
    }
})

const Board = types.model('Board', {
    id: types.identifier,
    title: types.string,
    sections: types.array(BoardSection)
}).actions(self => {
    return {
        moveTask(id, source, destination) {
            const fromSection = self.sections.find(section => section.id === source.droppableId)
            const toSection = self.sections.find(section => section.id === destination.droppableId)

            const taskToMoveIndex = fromSection.tasks.findIndex(task => task.id === id)
            const [task] = fromSection.tasks.splice(taskToMoveIndex, 1)

            toSection.tasks.splice(destination.index, 0, task.toJSON())
        },
        addTask(sectionId, payload) {
            const section = self.sections.find(section => section.id === sectionId)

            section.tasks.push({
                id: Date.now().toString(),
                ...payload
            })
        }
    }
})

const BoardStore = types.model('BoardStore', {
    boards: types.optional(types.array(Board), []),
    active: types.safeReference(Board)
}).views(self => ({
    get list() {
        return self.boards.map(({id, title}) => ({id, title}))
    }
})).actions(self => {
    return {
        selectBoard(id) {
            self.active = id
        },
        load: flow(function* () {
            self.boards = yield apiCall.get('boards')
            self.active = 'MAIN'
        }),
        afterCreate() {
            self.load()
        }
    }
})

export default BoardStore