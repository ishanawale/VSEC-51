import Task from '../models/Task.js';
export async function listTasks(req,res){const f={};if(req.query.status==='completed')f.completed=true;if(req.query.status==='pending')f.completed=false;if(req.query.priority)f.priority=req.query.priority;res.json(await Task.find(f).sort({completed:1,dueDate:1,createdAt:-1}));}
export async function createTask(req,res){res.status(201).json(await Task.create(req.body));}
export async function updateTask(req,res){const t=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!t)return res.status(404).json({message:'Task not found.'});res.json(t);}
export async function deleteTask(req,res){const t=await Task.findByIdAndDelete(req.params.id);if(!t)return res.status(404).json({message:'Task not found.'});res.json({message:'Task deleted.'});}
