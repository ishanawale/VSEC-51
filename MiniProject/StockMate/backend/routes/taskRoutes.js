import {Router} from 'express';
import {listTasks,createTask,updateTask,deleteTask} from '../controllers/taskController.js';
const r=Router();
r.get('/',listTasks);
r.post('/',createTask);
r.put('/:id',updateTask);
r.delete('/:id',deleteTask);
export default r;
