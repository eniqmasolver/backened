// const asynchandler=(fn)=>{async(req,res,next)=>{
// try {
//     await(req,res,next)
    
// } catch (error) {
//    res.status(error.code || 550).json({
//     sucess:false,
//     message:error.message
//    }) 
// }
// }}

//method2
const asynchandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .reject((err)=>next(err))
    }
}
export default asynchandler