export function notFound(req,res,next){res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`});}
export function errorHandler(err,req,res,next){
  console.error(err);
  if(err.code===11000) return res.status(409).json({message:'That product ID already exists. Choose a unique ID.'});
  if(err.name==='ValidationError') return res.status(400).json({message:Object.values(err.errors).map(e=>e.message).join('. ')});
  if(err.name==='CastError') return res.status(400).json({message:'The supplied record ID is invalid.'});
  if(err.type==='entity.parse.failed') return res.status(400).json({message:'Invalid JSON request body.'});
  res.status(err.status||500).json({message:err.message||'Unexpected server error.'});
}
